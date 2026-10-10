<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'image_path' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
                'sort_order' => 1,
                'is_active'  => true,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
                'sort_order' => 2,
                'is_active'  => true,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
                'sort_order' => 3,
                'is_active'  => true,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80',
                'sort_order' => 4,
                'is_active'  => true,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80',
                'sort_order' => 5,
                'is_active'  => true,
            ],
        ];

        foreach ($slides as $slide) {
            DB::table('hero_slides')->updateOrInsert(
                ['image_path' => $slide['image_path']],
                array_merge($slide, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
