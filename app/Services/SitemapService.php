<?php

namespace App\Services;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\GallerySection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class SitemapService
{
    /**
     * Generate the complete XML sitemap content.
     */
    public function generateXml(): string
    {
        $urls = [];

        // 1. Static Core Pages
        $latestPost = BlogPost::published()->latest('updated_at')->first();
        $homeLastMod = $latestPost ? $latestPost->updated_at : Carbon::now();

        $staticPages = [
            [
                'loc'        => URL::to('/'),
                'lastmod'    => $homeLastMod->toIso8601String(),
                'changefreq' => 'daily',
                'priority'   => '1.0',
            ],
            [
                'loc'        => URL::to('/about'),
                'lastmod'    => Carbon::now()->startOfMonth()->toIso8601String(),
                'changefreq' => 'monthly',
                'priority'   => '0.8',
            ],
            [
                'loc'        => URL::to('/treatments'),
                'lastmod'    => Carbon::now()->startOfWeek()->toIso8601String(),
                'changefreq' => 'weekly',
                'priority'   => '0.9',
            ],
            [
                'loc'        => URL::to('/facilities'),
                'lastmod'    => Carbon::now()->startOfMonth()->toIso8601String(),
                'changefreq' => 'monthly',
                'priority'   => '0.8',
            ],
            [
                'loc'        => URL::to('/gallery'),
                'lastmod'    => Carbon::now()->startOfWeek()->toIso8601String(),
                'changefreq' => 'weekly',
                'priority'   => '0.8',
            ],
            [
                'loc'        => URL::to('/blog'),
                'lastmod'    => $homeLastMod->toIso8601String(),
                'changefreq' => 'daily',
                'priority'   => '0.9',
            ],
            [
                'loc'        => URL::to('/contact'),
                'lastmod'    => Carbon::now()->startOfMonth()->toIso8601String(),
                'changefreq' => 'monthly',
                'priority'   => '0.7',
            ],
            [
                'loc'        => URL::to('/appointment'),
                'lastmod'    => Carbon::now()->startOfMonth()->toIso8601String(),
                'changefreq' => 'monthly',
                'priority'   => '0.8',
            ],
        ];

        foreach ($staticPages as $page) {
            $urls[] = $page;
        }

        // 2. Published Blog Posts
        try {
            $posts = BlogPost::published()
                ->select(['id', 'title', 'slug', 'featured_image', 'image_caption', 'is_featured', 'updated_at', 'published_at'])
                ->orderByDesc('published_at')
                ->get();

            foreach ($posts as $post) {
                $lastMod = $post->updated_at ?? $post->published_at ?? Carbon::now();
                $postUrl = [
                    'loc'        => URL::to('/blog/' . $post->slug),
                    'lastmod'    => $lastMod->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority'   => $post->is_featured ? '0.9' : '0.8',
                ];

                if (!empty($post->featured_image)) {
                    $imgUrl = str_starts_with($post->featured_image, 'http')
                        ? $post->featured_image
                        : URL::to($post->featured_image);

                    $postUrl['image'] = [
                        'loc'   => $imgUrl,
                        'title' => $post->image_caption ?: $post->title,
                    ];
                }

                $urls[] = $postUrl;
            }
        } catch (\Throwable $e) {
            // Graceful fallback if database is not migrated yet
        }

        // 3. Active Blog Categories with posts
        try {
            $categories = BlogCategory::active()
                ->withCount(['posts' => fn($q) => $q->published()])
                ->get()
                ->filter(fn($cat) => $cat->posts_count > 0);

            foreach ($categories as $cat) {
                $urls[] = [
                    'loc'        => URL::to('/blog') . '?category=' . urlencode($cat->slug),
                    'lastmod'    => ($cat->updated_at ?? Carbon::now())->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority'   => '0.6',
                ];
            }
        } catch (\Throwable $e) {
            // Graceful fallback
        }

        // 4. Active Gallery Sections
        try {
            $sections = GallerySection::active()
                ->withCount(['items' => fn($q) => $q->active()])
                ->get()
                ->filter(fn($sec) => $sec->items_count > 0);

            foreach ($sections as $section) {
                $urls[] = [
                    'loc'        => URL::to('/gallery') . '?section=' . urlencode($section->slug),
                    'lastmod'    => ($section->updated_at ?? Carbon::now())->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority'   => '0.6',
                ];
            }
        } catch (\Throwable $e) {
            // Graceful fallback
        }

        // Build XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
        $xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' . "\n";
        $xml .= '        xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

        foreach ($urls as $u) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
            if (!empty($u['lastmod'])) {
                $xml .= '    <lastmod>' . htmlspecialchars($u['lastmod'], ENT_XML1, 'UTF-8') . "</lastmod>\n";
            }
            if (!empty($u['changefreq'])) {
                $xml .= '    <changefreq>' . htmlspecialchars($u['changefreq'], ENT_XML1, 'UTF-8') . "</changefreq>\n";
            }
            if (!empty($u['priority'])) {
                $xml .= '    <priority>' . htmlspecialchars($u['priority'], ENT_XML1, 'UTF-8') . "</priority>\n";
            }
            if (!empty($u['image'])) {
                $xml .= "    <image:image>\n";
                $xml .= '      <image:loc>' . htmlspecialchars($u['image']['loc'], ENT_XML1, 'UTF-8') . "</image:loc>\n";
                if (!empty($u['image']['title'])) {
                    $xml .= '      <image:title>' . htmlspecialchars($u['image']['title'], ENT_XML1, 'UTF-8') . "</image:title>\n";
                }
                $xml .= "    </image:image>\n";
            }
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }

    /**
     * Generate standard robots.txt content with dynamic sitemap location.
     */
    public function generateRobotsTxt(): string
    {
        $sitemapUrl = URL::to('/sitemap.xml');

        $lines = [
            '# ====================================================================',
            '# Robots.txt for Maa Tara Freedom Trust (Nasha Mukti & Rehab Kendra)',
            '# ====================================================================',
            '',
            'User-agent: *',
            'Allow: /',
            '',
            '# Disallow Admin & Backend Portals',
            'Disallow: /admin/',
            'Disallow: /admin',
            'Disallow: /dashboard',
            '',
            '# Disallow Auth & Sensitive Endpoints',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /password/',
            'Disallow: /forgot-password',
            'Disallow: /reset-password',
            'Disallow: /email/',
            'Disallow: /two-factor-challenge',
            'Disallow: /user/profile-information',
            'Disallow: /user/password',
            '',
            '# Disallow Private Booking Confirmation Codes',
            'Disallow: /appointment/confirmation/',
            '',
            '# Allow Public Assets & Media',
            'Allow: /build/',
            'Allow: /storage/',
            'Allow: /images/',
            'Allow: /favicon.ico',
            '',
            '# Sitemap Location',
            'Sitemap: ' . $sitemapUrl,
            '',
        ];

        return implode("\n", $lines);
    }
}
