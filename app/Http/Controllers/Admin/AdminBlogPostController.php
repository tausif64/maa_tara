<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogPostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BlogPost::with(['category', 'tags'])
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = $request->input('search');
                $q->where(function ($sq) use ($term) {
                    $sq->where('title', 'like', "%{$term}%")
                        ->orWhere('author_name', 'like', "%{$term}%");
                });
            })
            ->when($request->filled('status') && $request->input('status') !== 'all', function ($q) use ($request) {
                $q->where('status', $request->input('status'));
            })
            ->when($request->filled('category') && $request->input('category') !== 'all', function ($q) use ($request) {
                $cat = $request->input('category');
                $q->whereHas('category', function ($sq) use ($cat) {
                    $sq->where('slug', $cat);
                });
            })
            ->when($request->filled('category_id') && $request->input('category_id') !== 'all', function ($q) use ($request) {
                $q->where('category_id', $request->input('category_id'));
            })
            ->latest('id');

        $posts = $query->paginate(15)->withQueryString();

        $stats = [
            'all' => BlogPost::count(),
            'total' => BlogPost::count(),
            'published' => BlogPost::where('status', 'published')->count(),
            'draft' => BlogPost::where('status', 'draft')->count(),
            'scheduled' => BlogPost::where('status', 'scheduled')->count(),
        ];

        $categories = BlogCategory::ordered()->get(['id', 'name', 'slug', 'badge_color']);

        return Inertia::render('admin/blog/index', [
            'posts' => $posts,
            'stats' => $stats,
            'counts' => $stats,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'category_id' => $request->input('category_id', ''),
                'category' => $request->input('category', ''),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/blog/create', [
            'categories' => BlogCategory::ordered()->get(),
            'tags' => BlogTag::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:blog_categories,id',
            'author_name' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|max:10240', // 10MB max
            'image_caption' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,scheduled',
            'is_featured' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'reading_time_minutes' => 'nullable|integer|min:1',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string',
        ]);

        $slug = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : BlogPost::generateUniqueSlug($validated['title']);

        // Ensure unique slug
        $slug = BlogPost::generateUniqueSlug($slug);

        $featuredImagePath = null;
        if ($request->hasFile('featured_image')) {
            $featuredImagePath = $request->file('featured_image')->store('blog/featured', 'public');
        }

        $readingTime = !empty($validated['reading_time_minutes'])
            ? (int) $validated['reading_time_minutes']
            : BlogPost::calculateReadingTime($validated['content'] ?? '');

        $publishedAt = $validated['published_at'] ?? null;
        if ($validated['status'] === 'published' && empty($publishedAt)) {
            $publishedAt = now();
        }

        $post = BlogPost::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category_id' => $validated['category_id'] ?? null,
            'author_name' => $validated['author_name'] ?: 'Maa Tara Care Team',
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'] ?? '',
            'featured_image' => $featuredImagePath ? '/storage/' . $featuredImagePath : null,
            'image_caption' => $validated['image_caption'] ?? null,
            'status' => $validated['status'],
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'published_at' => $publishedAt,
            'reading_time_minutes' => $readingTime,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'meta_keywords' => $validated['meta_keywords'] ?? null,
        ]);

        // Handle Tags
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $cleanName = trim($tagName);
                if (!empty($cleanName)) {
                    $tag = BlogTag::firstOrCreate(
                        ['slug' => Str::slug($cleanName)],
                        ['name' => $cleanName]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $post->tags()->sync($tagIds);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Article published successfully!');
    }

    public function edit(BlogPost $post): Response
    {
        $post->load(['category', 'tags']);

        return Inertia::render('admin/blog/edit', [
            'post' => $post,
            'categories' => BlogCategory::ordered()->get(),
            'tags' => BlogTag::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:blog_categories,id',
            'author_name' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|max:10240',
            'image_caption' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,scheduled',
            'is_featured' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'reading_time_minutes' => 'nullable|integer|min:1',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string',
        ]);

        $slug = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : $post->slug;

        if ($slug !== $post->slug) {
            $slug = BlogPost::generateUniqueSlug($slug, $post->id);
        }

        $featuredImagePath = $post->featured_image;
        if ($request->hasFile('featured_image')) {
            // Delete previous image from public storage if it was stored locally
            if ($post->featured_image && str_starts_with($post->featured_image, '/storage/blog/featured/')) {
                $oldPath = str_replace('/storage/', '', $post->featured_image);
                Storage::disk('public')->delete($oldPath);
            }
            $newFile = $request->file('featured_image')->store('blog/featured', 'public');
            $featuredImagePath = '/storage/' . $newFile;
        }

        $readingTime = !empty($validated['reading_time_minutes'])
            ? (int) $validated['reading_time_minutes']
            : BlogPost::calculateReadingTime($validated['content'] ?? $post->content);

        $publishedAt = $validated['published_at'] ?? $post->published_at;
        if ($validated['status'] === 'published' && empty($publishedAt)) {
            $publishedAt = now();
        }

        $post->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'category_id' => $validated['category_id'] ?? null,
            'author_name' => $validated['author_name'] ?: 'Maa Tara Care Team',
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'] ?? '',
            'featured_image' => $featuredImagePath,
            'image_caption' => $validated['image_caption'] ?? null,
            'status' => $validated['status'],
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'published_at' => $publishedAt,
            'reading_time_minutes' => $readingTime,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'meta_keywords' => $validated['meta_keywords'] ?? null,
        ]);

        // Handle Tags
        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $cleanName = trim($tagName);
                if (!empty($cleanName)) {
                    $tag = BlogTag::firstOrCreate(
                        ['slug' => Str::slug($cleanName)],
                        ['name' => $cleanName]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $post->tags()->sync($tagIds);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Article updated successfully!');
    }

    public function destroy(BlogPost $post): RedirectResponse
    {
        if ($post->featured_image && str_starts_with($post->featured_image, '/storage/blog/featured/')) {
            $oldPath = str_replace('/storage/', '', $post->featured_image);
            Storage::disk('public')->delete($oldPath);
        }

        $post->tags()->detach();
        $post->delete();

        return back()->with('success', 'Article deleted.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:delete,publish,draft,featured,unfeatured',
            'ids' => 'required|array',
            'ids.*' => 'exists:blog_posts,id',
        ]);

        $ids = $validated['ids'];

        switch ($validated['action']) {
            case 'delete':
                foreach (BlogPost::whereIn('id', $ids)->get() as $p) {
                    if ($p->featured_image && str_starts_with($p->featured_image, '/storage/blog/featured/')) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $p->featured_image));
                    }
                    $p->tags()->detach();
                    $p->delete();
                }
                $message = count($ids) . ' articles deleted.';
                break;

            case 'publish':
                BlogPost::whereIn('id', $ids)->update([
                    'status' => 'published',
                    'published_at' => now(),
                ]);
                $message = count($ids) . ' articles published.';
                break;

            case 'draft':
                BlogPost::whereIn('id', $ids)->update(['status' => 'draft']);
                $message = count($ids) . ' articles moved to draft.';
                break;

            case 'featured':
                BlogPost::whereIn('id', $ids)->update(['is_featured' => true]);
                $message = count($ids) . ' articles marked as featured.';
                break;

            case 'unfeatured':
                BlogPost::whereIn('id', $ids)->update(['is_featured' => false]);
                $message = count($ids) . ' articles unmarked as featured.';
                break;
        }

        return back()->with('success', $message);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB
        ]);

        $path = $request->file('image')->store('blog/editor', 'public');
        $url = '/storage/' . $path;

        return response()->json([
            'url' => $url,
        ]);
    }
}
