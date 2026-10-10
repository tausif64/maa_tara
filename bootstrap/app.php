<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();

/*
|--------------------------------------------------------------------------
| Hostinger & Shared Hosting Custom Public Path Binding
|--------------------------------------------------------------------------
| Automatically detect if public_html exists alongside the laravel/ folder
| (e.g. Hostinger structure: maatarafreedomtrust.org/{laravel, public_html})
| and bind it as the public web root.
*/
$customPublicHtml = dirname(__DIR__) . '/../public_html';
if (is_dir($customPublicHtml)) {
    $resolvedPath = realpath($customPublicHtml) ?: $customPublicHtml;
    $app->usePublicPath($resolvedPath);
}

return $app;
