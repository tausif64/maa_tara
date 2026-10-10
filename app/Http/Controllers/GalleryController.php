<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use App\Models\GallerySection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $sections = GallerySection::active()
            ->ordered()
            ->withCount(['items' => fn($q) => $q->active()])
            ->get();

        $years = GalleryItem::active()
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        $query = GalleryItem::with('section')
            ->active()
            ->forSection($request->input('section'))
            ->forYear($request->filled('year') ? (int) $request->input('year') : null)
            ->ordered();

        if ($request->filled('type') && in_array($request->input('type'), ['image', 'video'])) {
            $query->where('media_type', $request->input('type'));
        }

        $items = $query->get();

        $featured = GalleryItem::with('section')
            ->active()
            ->featured()
            ->ordered()
            ->take(6)
            ->get();

        return Inertia::render('gallery/index', [
            'sections' => $sections,
            'years' => $years,
            'items' => $items,
            'featured' => $featured,
            'filters' => [
                'section' => $request->input('section', 'all'),
                'year' => $request->input('year', 'all'),
                'type' => $request->input('type', 'all'),
            ],
        ]);
    }
}
