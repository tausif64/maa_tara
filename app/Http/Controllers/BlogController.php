<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const PER_PAGE = 9;

    public function index(Request $request): Response
    {
        $hasFilters = $request->filled('search')
            || ($request->filled('category') && $request->input('category') !== 'all')
            || ($request->filled('tag') && $request->input('tag') !== 'all')
            || $request->filled('year');

        // Featured: the explicitly featured post, otherwise the latest published one.
        $featured = BlogPost::with(['category', 'tags'])
            ->published()
            ->featured()
            ->latest('published_at')
            ->first()
            ?? BlogPost::with(['category', 'tags'])
                ->published()
                ->latest('published_at')
                ->orderByDesc('id')
                ->first();

        $posts = BlogPost::with(['category', 'tags'])
            ->published()
            ->search($request->input('search'))
            ->filterByCategory($request->input('category'))
            ->filterByTag($request->input('tag'))
            ->filterByYear($request->filled('year') ? (int) $request->input('year') : null)
            // The hero shows the featured post on the unfiltered first page,
            // so keep it out of the grid to avoid showing it twice.
            ->when(!$hasFilters && $featured, fn ($q) => $q->whereKeyNot($featured->id))
            ->latest('published_at')
            ->orderByDesc('id') // tie-breaker: stable ordering across pages
            ->paginate(self::PER_PAGE)
            ->onEachSide(1) // compact page links: 1 ... 4 5 6 ... 12
            ->withQueryString();

        $categories = BlogCategory::active()
            ->ordered()
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->get();

        $popularTags = BlogTag::withCount(['posts' => fn ($q) => $q->published()])
            ->having('posts_count', '>', 0)
            ->orderByDesc('posts_count')
            ->take(15)
            ->get();

        $recentPosts = BlogPost::published()
            ->latest('published_at')
            ->take(5)
            ->get(['id', 'title', 'slug', 'featured_image', 'published_at', 'reading_time_minutes']);

        $years = BlogPost::published()
            ->whereNotNull('published_at')
            ->selectRaw('YEAR(published_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'featured' => $featured,
            'categories' => $categories,
            'popularTags' => $popularTags,
            'recentPosts' => $recentPosts,
            'years' => $years,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', 'all'),
                'tag' => $request->input('tag', 'all'),
                'year' => $request->input('year', ''),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $post = BlogPost::with(['category', 'tags'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        $post->increment('views_count');

        $related = BlogPost::with('category')
            ->published()
            ->where('id', '!=', $post->id)
            ->where(function ($q) use ($post) {
                if ($post->category_id) {
                    $q->where('category_id', $post->category_id);
                }
                if ($post->tags->isNotEmpty()) {
                    $q->orWhereHas('tags', fn ($t) => $t->whereIn('id', $post->tags->pluck('id')));
                }
            })
            ->latest('published_at')
            ->take(3)
            ->get();

        $prev = BlogPost::published()
            ->where('published_at', '<', $post->published_at ?? $post->created_at)
            ->latest('published_at')
            ->select('id', 'title', 'slug')
            ->first();

        $next = BlogPost::published()
            ->where('published_at', '>', $post->published_at ?? $post->created_at)
            ->oldest('published_at')
            ->select('id', 'title', 'slug')
            ->first();

        return Inertia::render('blog/show', [
            'post' => $post,
            'related' => $related,
            'prev' => $prev,
            'next' => $next,
        ]);
    }
}