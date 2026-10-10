<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- SEO Master Metadata & Target Keywords -->
        <meta name="description" content="Maa Tara Freedom Trust is the best rehab center in Ranchi & Jharkhand, India. Government-approved Nasha Mukti Kendra offering 24/7 medical detox, alcohol & drug de-addiction, psychiatric counseling, and lifelong recovery.">
        <meta name="keywords" content="best rehab center in ranchi, best rehab center in jharkhand, best rehab center, best rehab center in india, best reahb center, best reab center in india, best nasha mukti kendra in ranchi, best nasha mukti kendra in jharkhand, nasha mukti kendra in ranchi, nasha mukti kendra in jharkhand, nasha mukti kendra ranchi, nasha mukti kendra jharkhand, nasha mukti kendra near me, best nasha mukti kendra near me, de addiction centre in ranchi, de addiction centre in jharkhand, de addiction center in ranchi, de addiction center in jharkhand, alcohol rehabilitation centre in ranchi, alcohol de addiction centre in ranchi, alcohol rehab center in jharkhand, drug de addiction centre in ranchi, drug rehabilitation centre in ranchi, substance abuse treatment center in ranchi, luxury rehab center in ranchi, top rehabilitation centre in ranchi, government approved rehab center in ranchi, psychiatric rehabilitation centre in ranchi, mental health and de addiction centre ranchi, brown sugar de addiction centre ranchi, smack de addiction centre in ranchi, cannabis de addiction centre ranchi, medical detox centre in ranchi, 12 step recovery rehab ranchi, residential de addiction centre jharkhand, rehab center in jamshedpur, rehab center in dhanbad, rehab center in bokaro, rehab center in bihar and jharkhand, best rehab center in eastern india, maa tara freedom trust ranchi, maa tara nasha mukti kendra, राँची में नशा मुक्ति केंद्र, झारखंड में बेस्ट नशा मुक्ति केंद्र, शराब छुड़ाने का केंद्र राँची, नशा मुक्ति केंद्र झारखंड, sharab chhudane ka kendra ranchi">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="googlebot" content="index, follow">

        <!-- Geo & Regional Local SEO Tags for Ranchi / Jharkhand -->
        <meta name="geo.region" content="IN-JH">
        <meta name="geo.placename" content="Ranchi, Jharkhand, India">
        <meta name="geo.position" content="23.3441;85.3096">
        <meta name="ICBM" content="23.3441, 85.3096">

        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:site_name" content="Maa Tara Freedom Trust">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_IN">
        <meta property="og:title" content="Maa Tara Freedom Trust — Best Rehab Center in Ranchi & Jharkhand">
        <meta property="og:description" content="Top-rated de-addiction and rehabilitation centre in Ranchi, Jharkhand. 24x7 medical detox, psychiatric counseling, and holistic addiction recovery.">
        <meta property="og:image" content="{{ asset('logo.jpeg') }}">

        <!-- Twitter Cards -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Maa Tara Freedom Trust — Best Rehab Center in Ranchi & Jharkhand">
        <meta name="twitter:description" content="Top-rated de-addiction and rehabilitation centre in Ranchi, Jharkhand. 24x7 medical detox, psychiatric counseling, and holistic addiction recovery.">
        <meta name="twitter:image" content="{{ asset('logo.jpeg') }}">

        <!-- Developer & Author Metadata -->
        <meta name="author" content="Tausif Ansari">
        <meta name="developer" content="Tausif Ansari">
        <meta name="designer" content="Tausif Ansari">
        <link rel="author" href="https://tausifansari.com/">
        <link rel="developer" href="https://tausifansari.com/">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon-iphone-60x60.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-iphone-retina-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png">
			

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Maa Tara Freedom Trust') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
