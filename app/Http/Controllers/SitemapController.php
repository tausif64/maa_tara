<?php

namespace App\Http\Controllers;

use App\Services\SitemapService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __construct(
        protected SitemapService $sitemapService
    ) {}

    /**
     * Render the dynamic XML sitemap.
     */
    public function sitemap(): Response
    {
        $xml = $this->sitemapService->generateXml();

        return response($xml, 200, [
            'Content-Type'  => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600, must-revalidate',
        ]);
    }

    /**
     * Render dynamic robots.txt.
     */
    public function robots(): Response
    {
        $txt = $this->sitemapService->generateRobotsTxt();

        return response($txt, 200, [
            'Content-Type'  => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=86400, must-revalidate',
        ]);
    }
}
