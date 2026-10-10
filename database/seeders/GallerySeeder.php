<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use App\Models\GallerySection;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Gallery Sections
        $sections = [
            [
                'name' => 'Campus & Infrastructure',
                'slug' => 'campus-infrastructure',
                'description' => 'Our tranquil 60-bed residential facility surrounded by lush greenery, clean living quarters, and modern therapeutic spaces.',
                'cover_image' => 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 1,
            ],
            [
                'name' => 'Yoga & Meditation',
                'slug' => 'yoga-meditation',
                'description' => 'Daily sunrise pranayama, mindfulness sessions, and spiritual grounding in our dedicated open-air meditation pavilion.',
                'cover_image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 2,
            ],
            [
                'name' => 'Rehabilitation Activities',
                'slug' => 'rehabilitation-activities',
                'description' => 'Group therapy workshops, creative art therapy, recreational sports, and skill development programs.',
                'cover_image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 3,
            ],
            [
                'name' => 'Celebrations & Festivals',
                'slug' => 'celebrations-festivals',
                'description' => 'Community gatherings, cultural celebrations, Diwali, Holi, and national festivals celebrated in sobriety.',
                'cover_image' => 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 4,
            ],
            [
                'name' => 'Success & Reunions',
                'slug' => 'success-reunions',
                'description' => 'Alumni meets, sobriety milestone commemorations, and heartfelt family reunion moments.',
                'cover_image' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 5,
            ],
        ];

        $sectionModels = [];
        foreach ($sections as $sec) {
            $sectionModels[$sec['slug']] = GallerySection::firstOrCreate(
                ['slug' => $sec['slug']],
                $sec
            );
        }

        // 2. Gallery Items (Sample curated photographic items with Unsplash medical/wellness/nature photography placeholders)
        $items = [
            [
                'section_slug' => 'campus-infrastructure',
                'title' => 'Serene Campus Grounds & Meditation Garden',
                'caption' => 'A peaceful morning view of the lush gardens providing a quiet sanctuary for patient introspection and recovery.',
                'image_path' => 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
                'year' => 2026,
                'media_type' => 'image',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'section_slug' => 'yoga-meditation',
                'title' => 'Morning Pranayama & Mindful Breathing',
                'caption' => 'Patients practicing guided breathwork to regulate the nervous system and manage stress naturally.',
                'image_path' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
                'year' => 2026,
                'media_type' => 'image',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'section_slug' => 'rehabilitation-activities',
                'title' => 'Expressive Art & Music Therapy Session',
                'caption' => 'Creative therapies allow individuals to articulate deep emotions and rebuild self-expression in a supportive circle.',
                'image_path' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
                'year' => 2025,
                'media_type' => 'image',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'section_slug' => 'celebrations-festivals',
                'title' => 'Diwali of Hope — Lighting the Lamps of Recovery',
                'caption' => 'The Maa Tara family coming together to celebrate the triumph of light and sobriety over darkness.',
                'image_path' => 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
                'year' => 2025,
                'media_type' => 'image',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'section_slug' => 'success-reunions',
                'title' => 'Annual Alumni Sobriety Convocation',
                'caption' => 'Celebrating over 2,000+ transformed lives at our annual alumni gathering in Varanasi.',
                'image_path' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
                'year' => 2024,
                'media_type' => 'image',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'section_slug' => 'campus-infrastructure',
                'title' => 'Modern Inpatient Living Quarters',
                'caption' => 'Hygienic, comfortable, and air-conditioned accommodation ensuring dignity and rest.',
                'image_path' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
                'year' => 2025,
                'media_type' => 'image',
                'is_featured' => false,
                'sort_order' => 6,
            ],
            [
                'section_slug' => 'rehabilitation-activities',
                'title' => 'Daily Counseling & Cognitive Behavioral Group Therapy',
                'caption' => 'Senior clinical counselors guiding peer support circles to discuss triggers and relapse prevention.',
                'image_path' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
                'year' => 2026,
                'media_type' => 'image',
                'is_featured' => false,
                'sort_order' => 7,
            ],
            [
                'section_slug' => 'yoga-meditation',
                'title' => 'Sunset Sound Meditation & Mindfulness',
                'caption' => 'Evening guided sound meditation assisting patients in reducing cortisol and achieving peaceful sleep.',
                'image_path' => 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
                'year' => 2024,
                'media_type' => 'image',
                'is_featured' => false,
                'sort_order' => 8,
            ],
        ];

        foreach ($items as $itemData) {
            $secSlug = $itemData['section_slug'];
            unset($itemData['section_slug']);

            $itemData['section_id'] = $sectionModels[$secSlug]->id ?? null;

            GalleryItem::firstOrCreate(
                ['title' => $itemData['title']],
                $itemData
            );
        }
    }
}
