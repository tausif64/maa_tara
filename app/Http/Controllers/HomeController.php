<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\HeroSlide;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $services = Service::where('is_active', true)->orderBy('sort_order')->get();
        $faqs = Faq::where('is_active', true)->orderBy('sort_order')->get();
        $heroSlides = HeroSlide::active()->ordered()->get();
        $testimonials = Testimonial::where('is_active', true)->latest()->take(3)->get()
            ->map(fn($t) => [
                'id'           => $t->id,
                'patient_name' => $t->patient_name,
                'message'      => $t->story,          // DB: story → frontend: message
                'rating'       => $t->rating,
                'location'     => $t->addiction_type, // repurpose addiction_type as location label
            ]);

        return Inertia::render('home', [
            'services'     => $services,
            'faqs'         => $faqs,
            'testimonials' => $testimonials,
            'heroSlides'   => $heroSlides,
        ]);
    }
}

