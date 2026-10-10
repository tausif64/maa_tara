<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        $team = TeamMember::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('about', [
            'teamMembers' => $team,
            'team' => $team,
        ]);
    }
}
