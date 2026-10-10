<?php

namespace App\Console\Commands;

use App\Services\SitemapService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateSitemapCommand extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate static public/sitemap.xml and update public/robots.txt';

    public function handle(SitemapService $sitemapService): int
    {
        $this->info('Generating XML Sitemap...');
        $xml = $sitemapService->generateXml();
        $sitemapPath = public_path('sitemap.xml');
        File::put($sitemapPath, $xml);
        $this->info("✓ Saved sitemap to {$sitemapPath}");

        $this->info('Generating robots.txt...');
        $robots = $sitemapService->generateRobotsTxt();
        $robotsPath = public_path('robots.txt');
        File::put($robotsPath, $robots);
        $this->info("✓ Saved robots.txt to {$robotsPath}");

        return Command::SUCCESS;
    }
}
