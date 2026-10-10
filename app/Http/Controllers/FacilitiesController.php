<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class FacilitiesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('facilities');
    }
}
