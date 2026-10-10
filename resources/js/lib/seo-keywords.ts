/**
 * Comprehensive SEO Keywords & Structured Data Configuration
 * Targeted for: "Best Rehab Center in Ranchi", "Best Rehab Center in Jharkhand & India",
 * "Nasha Mukti Kendra", "De-Addiction Centre", and regional search supremacy.
 */

export const MASTER_SEO_KEYWORDS = [
    // Top Priority High-Intent Search Queries
    'best rehab center in ranchi',
    'best rehab center in jharkhand',
    'best rehab center',
    'best rehab center in india',
    'best reahb center',
    'best reab center in india',
    'best nasha mukti kendra in ranchi',
    'best nasha mukti kendra in jharkhand',
    'best nasha mukti kendra in india',
    'nasha mukti kendra in ranchi',
    'nasha mukti kendra in jharkhand',
    'nasha mukti kendra ranchi',
    'nasha mukti kendra jharkhand',
    'nasha mukti kendra near me',
    'best nasha mukti kendra near me',

    // De-Addiction Centre Queries
    'de addiction centre in ranchi',
    'de addiction centre in jharkhand',
    'de addiction center in ranchi',
    'de addiction center in jharkhand',
    'best de addiction centre in ranchi',
    'best de addiction centre in jharkhand',
    'best de addiction centre in india',
    'de addiction centre near me',
    'de addiction center near me',

    // Rehabilitation Centre Queries
    'rehabilitation centre in ranchi',
    'rehabilitation centre in jharkhand',
    'rehabilitation center in ranchi',
    'rehabilitation center in jharkhand',
    'rehab centre in ranchi',
    'rehab centre in jharkhand',
    'rehab center in ranchi',
    'rehab center in jharkhand',
    'rehab center ranchi',
    'rehab center jharkhand',
    'top rehabilitation centre in ranchi',
    'top rehab center in ranchi',
    'top 10 rehab centers in ranchi',
    'top 10 rehab centers in jharkhand',
    'luxury rehab center in ranchi',
    'government approved rehab center in ranchi',
    'government approved nasha mukti kendra in ranchi',
    'registered nasha mukti kendra jharkhand',

    // Substance-Specific Treatment Keywords
    'alcohol rehabilitation centre in ranchi',
    'alcohol de addiction centre in ranchi',
    'alcohol rehab center in jharkhand',
    'alcoholism treatment in ranchi',
    'sharab chhudane ka kendra ranchi',
    'drug de addiction centre in ranchi',
    'drug rehabilitation centre in ranchi',
    'drug rehab center in ranchi',
    'substance abuse treatment center in ranchi',
    'substance abuse rehabilitation jharkhand',
    'brown sugar de addiction centre ranchi',
    'smack de addiction centre in ranchi',
    'cannabis de addiction centre ranchi',
    'ganja addiction treatment in ranchi',
    'heroin de addiction centre ranchi',
    'opioid detox centre in ranchi',
    'prescription drug de addiction ranchi',
    'smoking de addiction centre ranchi',
    'tobacco cessation clinic ranchi',

    // Clinical & Treatment Modalities
    'medical detox centre in ranchi',
    'psychiatric rehabilitation centre ranchi',
    'mental health and de addiction centre ranchi',
    'dual diagnosis treatment in ranchi',
    'cognitive behavioural therapy for addiction ranchi',
    '12 step recovery programme ranchi',
    'inpatient rehab centre in ranchi',
    'residential de addiction centre jharkhand',
    'family counseling for addiction ranchi',
    'relapse prevention therapy ranchi',
    'addiction psychiatrist in ranchi',

    // Regional & Geographical Coverage (Jharkhand, Bihar & Eastern India)
    'rehab center in jamshedpur',
    'rehab center in dhanbad',
    'rehab center in bokaro',
    'rehab center in hazaribagh',
    'rehab center in deoghar',
    'rehab center in ramgarh',
    'nasha mukti kendra jamshedpur',
    'nasha mukti kendra dhanbad',
    'nasha mukti kendra bokaro',
    'best rehab center in bihar and jharkhand',
    'best rehab center in eastern india',
    'rehab center near bihar',

    // Trust & Brand Keywords
    'maa tara freedom trust',
    'maa tara freedom trust ranchi',
    'maa tara nasha mukti kendra',
    'maa tara rehabilitation centre',
    'maa tara de addiction centre ranchi',

    // Hindi & Local Language Queries
    'राँची में नशा मुक्ति केंद्र',
    'झारखंड में बेस्ट नशा मुक्ति केंद्र',
    'राँची में शराब छुड़ाने का केंद्र',
    'नशा मुक्ति केंद्र झारखंड',
    'नशा मुक्ति केंद्र राँची',
    'sharab chhudane ka asan tarika ranchi',
    'nasha chhudane ka doctor ranchi',
];

export const DEFAULT_SITE_TITLE = 'Maa Tara Freedom Trust — Best Rehab Center in Ranchi & Jharkhand | Nasha Mukti Kendra';
export const DEFAULT_SITE_DESCRIPTION =
    'Maa Tara Freedom Trust is rated the best rehab center in Ranchi & Jharkhand, India. Government-approved Nasha Mukti Kendra & De-Addiction Rehabilitation Centre providing 24/7 medical detox, alcohol & drug addiction treatment, psychiatric care, and holistic lifelong recovery.';

export const DEFAULT_OG_IMAGE = 'https://maatarafreedomtrust.org/logo.jpeg';
export const DEFAULT_CANONICAL_URL = 'https://maatarafreedomtrust.org';

/**
 * Generate LocalBusiness / MedicalBusiness Schema.org JSON-LD for Google Rich Results
 */
export function generateLocalBusinessSchema(settings?: Record<string, string | null | undefined>) {
    const siteName = settings?.['site_name'] || 'Maa Tara Freedom Trust';
    const phone = settings?.['phone_primary'] || '+91-9876543210';
    const email = settings?.['email'] || 'care@maataratrust.org';
    const address1 = settings?.['address_line1'] || 'Sahera Road, Near Ring Road';
    const city = settings?.['city'] || 'Ranchi';
    const state = settings?.['state'] || 'Jharkhand';
    const pincode = settings?.['pincode'] || '834001';

    return {
        '@context': 'https://schema.org',
        '@type': ['MedicalBusiness', 'MedicalClinic', 'LocalBusiness'],
        '@id': 'https://maatarafreedomtrust.org/#organization',
        name: `${siteName} — Best Rehab Center & Nasha Mukti Kendra in Ranchi`,
        alternateName: [
            'Maa Tara Freedom Trust',
            'Maa Tara Nasha Mukti Kendra',
            'Maa Tara Rehab Center Ranchi',
            'Maa Tara De-Addiction Center',
        ],
        url: 'https://maatarafreedomtrust.org',
        logo: 'https://maatarafreedomtrust.org/logo.jpeg',
        image: [
            'https://maatarafreedomtrust.org/logo.jpeg',
        ],
        description:
            'Maa Tara Freedom Trust is the top-rated de-addiction and rehabilitation centre in Ranchi, Jharkhand, India. Offering 24x7 medical detox, psychiatric counseling, alcohol & drug rehabilitation, and holistic 12-step recovery.',
        telephone: phone,
        email: email,
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
        medicalSpecialty: [
            'Psychiatry',
            'AddictionMedicine',
            'PublicHealth',
        ],
        serviceType: [
            'Alcohol De-Addiction Treatment',
            'Drug Rehabilitation',
            'Medical Detoxification',
            'Substance Abuse Counseling',
            'Psychiatric Rehabilitation',
            '12-Step Recovery Program',
            'Family Counseling',
            'Dual Diagnosis Treatment',
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: address1,
            addressLocality: city,
            addressRegion: state,
            postalCode: pincode,
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 23.3441,
            longitude: 85.3096,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ],
                opens: '00:00',
                closes: '23:59',
            },
        ],
        areaServed: [
            { '@type': 'City', name: 'Ranchi' },
            { '@type': 'AdministrativeArea', name: 'Jharkhand' },
            { '@type': 'City', name: 'Jamshedpur' },
            { '@type': 'City', name: 'Dhanbad' },
            { '@type': 'City', name: 'Bokaro' },
            { '@type': 'AdministrativeArea', name: 'Bihar' },
            { '@type': 'Country', name: 'India' },
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '128',
            reviewCount: '128',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Rehabilitation & De-Addiction Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Inpatient Residential Rehab Care',
                        description: 'Comfortable residential accommodation with 24/7 medical supervision and healthy meals.',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Medically Supervised Alcohol & Drug Detox',
                        description: 'Safe detoxification managed by qualified psychiatrists and medical staff.',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Cognitive Behavioural Therapy & 12-Step Program',
                        description: 'Structured psychological counseling to rebuild habits and prevent relapse.',
                    },
                },
            ],
        },
        sameAs: [
            settings?.['facebook_url'] || 'https://facebook.com',
            settings?.['instagram_url'] || 'https://instagram.com',
            settings?.['youtube_url'] || 'https://youtube.com',
        ].filter(Boolean),
    };
}
