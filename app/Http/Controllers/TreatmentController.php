<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class TreatmentController extends Controller
{
    public function index(): Response
    {
        $services = Service::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('treatments', [
            'services' => $services,
        ]);
    }
}
