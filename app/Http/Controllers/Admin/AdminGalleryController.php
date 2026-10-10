<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\GallerySection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminGalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = GalleryItem::with('section')
            ->when($request->filled('section_id') && $request->input('section_id') !== 'all', function ($q) use ($request) {
                $q->where('section_id', $request->input('section_id'));
            })
            ->when($request->filled('year') && $request->input('year') !== 'all', function ($q) use ($request) {
                $q->where('year', (int) $request->input('year'));
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = $request->input('search');
                $q->where(function ($sq) use ($term) {
                    $sq->where('title', 'like', "%{$term}%")
                        ->orWhere('caption', 'like', "%{$term}%");
                });
            })
            ->ordered();

        $items = $query->paginate(24)->withQueryString();

        $sections = GallerySection::ordered()->withCount('items')->get();

        $years = GalleryItem::distinct()->orderByDesc('year')->pluck('year');

        $stats = [
            'total' => GalleryItem::count(),
            'images' => GalleryItem::where('media_type', 'image')->count(),
            'videos' => GalleryItem::where('media_type', 'video')->count(),
            'featured' => GalleryItem::where('is_featured', true)->count(),
        ];

        return Inertia::render('admin/gallery/index', [
            'items' => $items,
            'sections' => $sections,
            'years' => $years,
            'stats' => $stats,
            'filters' => [
                'section_id' => $request->input('section_id', 'all'),
                'year' => $request->input('year', 'all'),
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'image' => 'required_without:video_url|nullable|image|max:15360', // 15MB
            'media_type' => 'required|in:image,video',
            'video_url' => 'nullable|string|max:500',
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'section_id' => 'nullable|exists:gallery_sections,id',
            'year' => 'required|integer|min:2000|max:2099',
            'date_taken' => 'nullable|date',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $imagePath = '';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery/originals', 'public');
            $imagePath = '/storage/' . $path;
        } elseif (!empty($validated['video_url'])) {
            $imagePath = $validated['video_url'];
        }

        GalleryItem::create([
            'section_id' => $validated['section_id'] ?? null,
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'image_path' => $imagePath,
            'year' => (int) $validated['year'],
            'date_taken' => $validated['date_taken'] ?? null,
            'media_type' => $validated['media_type'],
            'video_url' => $validated['video_url'] ?? null,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return back()->with('success', 'Media item added to gallery.');
    }

    public function batchUpload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|max:15360',
            'section_id' => 'nullable|exists:gallery_sections,id',
            'year' => 'required|integer|min:2000|max:2099',
            'is_active' => 'nullable|boolean',
        ]);

        $sectionId = $validated['section_id'] ?? null;
        $year = (int) $validated['year'];
        $isActive = $validated['is_active'] ?? true;
        $uploadedCount = 0;

        foreach ($request->file('images') as $file) {
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanTitle = ucwords(str_replace(['-', '_'], ' ', $originalName));

            $path = $file->store('gallery/originals', 'public');

            GalleryItem::create([
                'section_id' => $sectionId,
                'title' => $cleanTitle,
                'image_path' => '/storage/' . $path,
                'year' => $year,
                'media_type' => 'image',
                'is_active' => $isActive,
                'sort_order' => 0,
            ]);

            $uploadedCount++;
        }

        return back()->with('success', "Successfully uploaded {$uploadedCount} images.");
    }

    public function update(Request $request, GalleryItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'section_id' => 'nullable|exists:gallery_sections,id',
            'year' => 'required|integer|min:2000|max:2099',
            'date_taken' => 'nullable|date',
            'media_type' => 'required|in:image,video',
            'video_url' => 'nullable|string|max:500',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|max:15360',
        ]);

        $imagePath = $item->image_path;
        if ($request->hasFile('image')) {
            if ($item->image_path && str_starts_with($item->image_path, '/storage/gallery/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $item->image_path));
            }
            $path = $request->file('image')->store('gallery/originals', 'public');
            $imagePath = '/storage/' . $path;
        }

        $item->update([
            'section_id' => $validated['section_id'] ?? null,
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'image_path' => $imagePath,
            'year' => (int) $validated['year'],
            'date_taken' => $validated['date_taken'] ?? null,
            'media_type' => $validated['media_type'],
            'video_url' => $validated['video_url'] ?? null,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return back()->with('success', 'Gallery item updated.');
    }

    public function destroy(GalleryItem $item): RedirectResponse
    {
        if ($item->image_path && str_starts_with($item->image_path, '/storage/gallery/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $item->image_path));
        }

        $item->delete();

        return back()->with('success', 'Gallery item deleted.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:delete,set_section,set_year,set_featured,unset_featured',
            'ids' => 'required|array',
            'ids.*' => 'exists:gallery_items,id',
            'target_section_id' => 'nullable|exists:gallery_sections,id',
            'target_year' => 'nullable|integer|min:2000|max:2099',
        ]);

        $ids = $validated['ids'];

        switch ($validated['action']) {
            case 'delete':
                foreach (GalleryItem::whereIn('id', $ids)->get() as $item) {
                    if ($item->image_path && str_starts_with($item->image_path, '/storage/gallery/')) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $item->image_path));
                    }
                    $item->delete();
                }
                $msg = count($ids) . ' items deleted.';
                break;

            case 'set_section':
                GalleryItem::whereIn('id', $ids)->update(['section_id' => $validated['target_section_id']]);
                $msg = count($ids) . ' items moved to selected section.';
                break;

            case 'set_year':
                GalleryItem::whereIn('id', $ids)->update(['year' => $validated['target_year']]);
                $msg = count($ids) . ' items updated with year ' . $validated['target_year'] . '.';
                break;

            case 'set_featured':
                GalleryItem::whereIn('id', $ids)->update(['is_featured' => true]);
                $msg = count($ids) . ' items marked as featured.';
                break;

            case 'unset_featured':
                GalleryItem::whereIn('id', $ids)->update(['is_featured' => false]);
                $msg = count($ids) . ' items removed from featured.';
                break;
        }

        return back()->with('success', $msg);
    }
}
