<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::updateOrInsert(
            ['email' => 'admin@maatarafreedomtrust.org'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // Services
        $services = [
            [
                'title' => 'Inpatient Care',
                'slug' => 'inpatient-care',
                'icon' => 'hospital',
                'short_description' => 'Residential rehabilitation with dedicated primary counselors and customized 24/7 recovery roadmaps in a safe, structured environment.',
                'full_description' => 'Our inpatient program provides a comprehensive, immersive recovery experience. Patients live on-site and receive around-the-clock medical supervision, individual therapy, group counseling, and holistic wellness activities. Each patient is assigned a dedicated primary counselor who develops a personalized recovery roadmap tailored to their specific addiction, history, and goals.',
                'category' => 'inpatient',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Outpatient Care',
                'slug' => 'outpatient-care',
                'icon' => 'calendar',
                'short_description' => 'Structured, flexible non-residential rehabilitation programs that allow you to maintain daily responsibilities while recovering.',
                'full_description' => 'Our outpatient program offers the same quality of care as inpatient treatment, but allows patients to live at home and continue with their daily lives. Regular scheduled sessions include individual therapy, group support meetings, medication management, and skill-building workshops.',
                'category' => 'outpatient',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Family Support Program',
                'slug' => 'family-support',
                'icon' => 'users',
                'short_description' => 'Comprehensive coping strategies, family counseling, and systemic healing to help loved ones recover together.',
                'full_description' => 'Addiction affects the entire family. Our family support program offers dedicated counseling sessions, educational workshops, and ongoing support groups to help families understand addiction, improve communication, set healthy boundaries, and heal together as a unit.',
                'category' => 'family',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Aftercare & Relapse Prevention',
                'slug' => 'aftercare',
                'icon' => 'shield',
                'short_description' => 'Trigger management, routine check-ups, and alumni support network to ensure long-term sobriety and life reintegration.',
                'full_description' => 'Recovery does not end at discharge. Our aftercare program includes regular follow-up sessions, trigger identification and management training, alumni support groups, vocational rehabilitation guidance, and 24/7 helpline access to prevent relapse and support lasting recovery.',
                'category' => 'aftercare',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($services as $s) {
            DB::table('services')->updateOrInsert(
                ['slug' => $s['slug']],
                array_merge($s, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        // FAQs
        $faqs = [
            [
                'question' => 'How do I admit a loved one to Maa Tara Freedom Trust?',
                'answer' => 'You can call our 24/7 helpline at +91-9876543210 or fill the consultation form on our website. Our admissions team will guide you through the entire process, including assessment, documentation, and facility orientation.',
                'category' => 'admission',
                'sort_order' => 1,
            ],
            [
                'question' => 'Is the treatment completely confidential?',
                'answer' => 'Absolutely. We follow strict confidentiality protocols. Your identity, diagnosis, and treatment details are never disclosed to anyone without your written consent. All staff members are bound by professional ethics and non-disclosure agreements.',
                'category' => 'general',
                'sort_order' => 2,
            ],
            [
                'question' => 'What is the typical duration of treatment?',
                'answer' => 'Treatment duration varies based on the nature and severity of addiction. Typically, inpatient programs run for 30–90 days, while outpatient programs span 60–180 days. Our clinical team will recommend an evidence-based plan tailored to the patient.',
                'category' => 'treatment',
                'sort_order' => 3,
            ],
            [
                'question' => 'What is the cost of treatment?',
                'answer' => 'Costs vary based on the program type, duration, and level of care required. We offer transparent pricing with no hidden fees. We also provide flexible payment plans and can assist with insurance claims where applicable. Contact us for a personalized quote.',
                'category' => 'fees',
                'sort_order' => 4,
            ],
            [
                'question' => 'Can family members visit during treatment?',
                'answer' => 'Yes. Family visits are encouraged as part of the healing process, subject to the patient\'s treatment phase and clinical recommendations. Structured family therapy sessions are also included in our programs.',
                'category' => 'family',
                'sort_order' => 5,
            ],
            [
                'question' => 'Do you treat both alcohol and drug addiction?',
                'answer' => 'Yes, we treat all forms of substance use disorders including alcohol, prescription medications, opioids, cannabis, cocaine, tobacco, and poly-substance abuse. We also address dual diagnoses where mental health conditions co-occur with addiction.',
                'category' => 'treatment',
                'sort_order' => 6,
            ],
            [
                'question' => 'Is detoxification medically supervised?',
                'answer' => 'Yes. All detoxification is conducted under the supervision of our qualified medical team with 24/7 monitoring. Medical detox safely manages withdrawal symptoms and ensures patient safety and comfort throughout the process.',
                'category' => 'treatment',
                'sort_order' => 7,
            ],
            [
                'question' => 'What happens after completing the program?',
                'answer' => 'Discharge is just the beginning. Our comprehensive aftercare program includes follow-up counseling sessions, alumni support group meetings, relapse prevention planning, and access to our 24/7 helpline to support your continued recovery journey.',
                'category' => 'aftercare',
                'sort_order' => 8,
            ],
        ];

        foreach ($faqs as $f) {
            DB::table('faqs')->updateOrInsert(
                ['question' => $f['question']],
                array_merge($f, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()])
            );
        }

        // Testimonials
        $testimonials = [
            [
                'patient_name' => 'Rohit K.',
                'patient_initials' => 'RK',
                'story' => 'I was deep into alcohol addiction for over 8 years and had given up hope. Maa Tara Freedom Trust gave me a second chance at life. The doctors, counselors, and staff treated me with dignity and respect. Today, I am 14 months sober and rebuilding my family life.',
                'rating' => 5,
                'addiction_type' => 'Alcohol',
                'recovery_months' => 14,
            ],
            [
                'patient_name' => 'Priya S.',
                'patient_initials' => 'PS',
                'story' => 'The family support program at Maa Tara helped my husband recover from drug addiction. We learned to communicate better, understand the disease, and heal as a family. The counselors are incredibly compassionate and knowledgeable.',
                'rating' => 5,
                'addiction_type' => 'Drugs',
                'recovery_months' => 10,
            ],
            [
                'patient_name' => 'Amit R.',
                'patient_initials' => 'AR',
                'story' => 'After trying multiple rehabs without success, I found Maa Tara. Their personalized approach—understanding my triggers, my background, my dreams—made all the difference. The aftercare program kept me on track. 2 years clean now!',
                'rating' => 5,
                'addiction_type' => 'Multiple Substances',
                'recovery_months' => 24,
            ],
        ];

        foreach ($testimonials as $t) {
            DB::table('testimonials')->updateOrInsert(
                ['patient_name' => $t['patient_name']],
                array_merge($t, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()])
            );
        }

        // Team members
        $team = [
            [
                'name' => 'Dr. Suresh Kumar Sharma',
                'designation' => 'Medical Director & Psychiatrist',
                'qualification' => 'MBBS, MD (Psychiatry), FIPS',
                'bio' => 'Dr. Sharma brings over 18 years of experience in addiction medicine and psychiatry. He leads the clinical team and oversees all medical protocols at Maa Tara Freedom Trust.',
                'specialization' => 'Addiction Medicine, Dual Diagnosis',
                'experience_years' => 18,
                'sort_order' => 1,
            ],
            [
                'name' => 'Dr. Anita Verma',
                'designation' => 'Clinical Psychologist',
                'qualification' => 'M.Phil (Clinical Psychology), PhD',
                'bio' => 'Dr. Verma specializes in Cognitive Behavioral Therapy, trauma-informed care, and family systems therapy. She has helped hundreds of patients rebuild their lives.',
                'specialization' => 'CBT, Trauma Therapy, Family Counseling',
                'experience_years' => 12,
                'sort_order' => 2,
            ],
            [
                'name' => 'Mr. Rajesh Tiwari',
                'designation' => 'Senior Rehabilitation Counselor',
                'qualification' => 'MA (Psychology), CADC',
                'bio' => 'A certified addiction counselor with 10 years of experience, Mr. Tiwari leads group therapy sessions and individual recovery coaching.',
                'specialization' => 'Group Therapy, Relapse Prevention',
                'experience_years' => 10,
                'sort_order' => 3,
            ],
        ];

        foreach ($team as $t) {
            DB::table('team_members')->updateOrInsert(
                ['name' => $t['name']],
                array_merge($t, ['photo' => null, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()])
            );
        }

        // Site settings — seeded only once via firstOrCreate logic via SiteSetting::set()
        $settings = [
            // general
            ['site_name', 'Maa Tara Freedom Trust', 'general'],
            ['site_tagline', 'Your Hope, Our Mission.', 'general'],
            ['established_year', '2009', 'general'],
            [
                'about_short',
                'A NHRDN-accredited residential rehabilitation centre dedicated to helping individuals break free from addiction through evidence-based care and compassionate support.',
                'general'
            ],
            [
                'about_full',
                'Maa Tara Freedom Trust was founded in 2009 with a single purpose: to give people struggling with addiction a real chance at recovery. Over the years we have grown into a fully accredited residential rehabilitation centre offering comprehensive inpatient care, outpatient counselling, family therapy, and long-term aftercare. Our multidisciplinary team of psychiatrists, psychologists, and counsellors work together to deliver evidence-based treatment in a safe, nurturing environment where every patient is treated with dignity and respect.',
                'general'
            ],
            [
                'vision',
                'A society free from addiction, where every individual can live a life of dignity, purpose, and well-being.',
                'general'
            ],
            [
                'mission',
                'To provide compassionate, high-quality, evidence-based addiction treatment that empowers individuals and families to heal, grow, and thrive.',
                'general'
            ],
            ['beds_capacity', '60', 'general'],
            ['success_rate', '92', 'general'],
            ['total_recovered', '2000', 'general'],

            // contact
            ['phone_primary', '+91-9876543210', 'contact'],
            ['phone_secondary', '+91-9123456789', 'contact'],
            ['whatsapp_number', '919876543210', 'contact'],
            ['email', 'care@maataratrust.org', 'contact'],
            ['address_line1', 'Village Pipri, Near Rail Vihar', 'contact'],
            ['address_line2', 'Varanasi Road', 'contact'],
            ['city', 'Varanasi', 'contact'],
            ['state', 'Uttar Pradesh', 'contact'],
            ['pincode', '221001', 'contact'],
            ['maps_embed_url', '', 'contact'],
            ['maps_link', 'https://maps.google.com', 'contact'],
            ['office_hours', '24/7 Emergency · Mon–Sat 9 am – 6 pm', 'contact'],

            // social
            ['social_facebook', '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_youtube', '', 'social'],
            ['social_twitter', '', 'social'],
            ['social_linkedin', '', 'social'],

            // hero
            ['hero_headline', 'A New Beginning Awaits You', 'hero'],
            [
                'hero_subheadline',
                'Compassionate, evidence-based addiction recovery in a safe and supportive residential environment. You are not alone — we walk this journey with you.',
                'hero'
            ],
            ['hero_cta_primary', 'Book a Consultation', 'hero'],
            ['hero_cta_secondary', 'Emergency Admission', 'hero'],
            ['announcement_text', '24/7 Emergency Admission Helpline: +91-9876543210', 'hero'],
            ['announcement_visible', '1', 'hero'],
            ['stat1_label', 'Years of Service', 'hero'],
            ['stat1_value', '15+', 'hero'],
            ['stat2_label', 'Lives Transformed', 'hero'],
            ['stat2_value', '2000+', 'hero'],
            ['stat3_label', 'Recovery Rate', 'hero'],
            ['stat3_value', '92%', 'hero'],
            ['stat4_label', 'Bed Capacity', 'hero'],
            ['stat4_value', '60', 'hero'],

            // seo
            ['seo_title', 'Maa Tara Freedom Trust — Rehabilitation Centre in Varanasi', 'seo'],
            [
                'seo_description',
                'Maa Tara Freedom Trust is an accredited residential rehabilitation and de-addiction centre in Varanasi, Uttar Pradesh offering evidence-based inpatient, outpatient and aftercare programs.',
                'seo'
            ],
            [
                'seo_keywords',
                'rehabilitation centre varanasi, de-addiction centre up, drug rehab india, alcohol rehab varanasi, maa tara freedom trust',
                'seo'
            ],
            ['seo_og_image', '', 'seo'],
            ['analytics_id', '', 'seo'],
        ];

        foreach ($settings as [$key, $value, $group]) {
            if (!DB::table('site_settings')->where('key', $key)->exists()) {
                DB::table('site_settings')->insert([
                    'key' => $key,
                    'value' => $value,
                    'group' => $group,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Call Blog, Gallery, and Hero Slides seeders
        $this->call([
            BlogSeeder::class,
            GallerySeeder::class,
            HeroSlideSeeder::class,
        ]);
    }
}
