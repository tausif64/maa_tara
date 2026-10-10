import { Head } from '@inertiajs/react';
import {
    MASTER_SEO_KEYWORDS,
    DEFAULT_SITE_TITLE,
    DEFAULT_SITE_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    DEFAULT_CANONICAL_URL,
    generateLocalBusinessSchema,
} from '@/lib/seo-keywords';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string[] | string;
    canonicalPath?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    schemaJson?: Record<string, any> | Array<Record<string, any>>;
    noIndex?: boolean;
    settings?: Record<string, string | null | undefined>;
}

export default function SeoHead({
    title,
    description = DEFAULT_SITE_DESCRIPTION,
    keywords,
    canonicalPath = '',
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    schemaJson,
    noIndex = false,
    settings,
}: SeoHeadProps) {
    const fullTitle = title
        ? title.includes('Maa Tara')
            ? title
            : `${title} — Best Rehab Center in Ranchi | Maa Tara Freedom Trust`
        : DEFAULT_SITE_TITLE;

    // Combine custom keywords with master keywords without duplicate tokens
    const mergedKeywordsList = Array.isArray(keywords)
        ? [...new Set([...keywords, ...MASTER_SEO_KEYWORDS])]
        : typeof keywords === 'string'
        ? [...new Set([...keywords.split(',').map((k) => k.trim()), ...MASTER_SEO_KEYWORDS])]
        : MASTER_SEO_KEYWORDS;

    const keywordsContent = mergedKeywordsList.join(', ');

    const canonicalUrl = canonicalPath
        ? `${DEFAULT_CANONICAL_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
        : DEFAULT_CANONICAL_URL;

    // Default schemas if none specified
    const activeSchema =
        schemaJson || [
            generateLocalBusinessSchema(settings),
            {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Maa Tara Freedom Trust — Best Rehab Center in Ranchi & Jharkhand',
                url: DEFAULT_CANONICAL_URL,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${DEFAULT_CANONICAL_URL}/blog?search={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
        ];

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywordsContent} />

            {/* Developer and Author Attribution */}
            <meta name="author" content="Tausif Ansari" />
            <meta name="developer" content="Tausif Ansari" />
            <meta name="designer" content="Tausif Ansari" />

            {/* Crawling directives */}
            <meta
                name="robots"
                content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
            />
            <meta name="googlebot" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

            {/* Canonical Link */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph Tags */}
            <meta property="og:site_name" content="Maa Tara Freedom Trust" />
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Geo & Regional Local SEO Tags for Ranchi / Jharkhand */}
            <meta name="geo.region" content="IN-JH" />
            <meta name="geo.placename" content="Ranchi, Jharkhand, India" />
            <meta name="geo.position" content="23.3441;85.3096" />
            <meta name="ICBM" content="23.3441, 85.3096" />

            {/* Schema.org Structured Data */}
            {activeSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(activeSchema) }}
                />
            )}
        </Head>
    );
}
