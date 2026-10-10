<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeadRequest;
use App\Models\Lead;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('contact',['settings'     => SiteSetting::all_flat(),]);
    }

    public function store(LeadRequest $request): RedirectResponse
    {
        // Honeypot check
        if ($request->filled('website')) {
            return redirect()->back();
        }

        Lead::create([
            ...$request->validated(),
            'source' => 'contact_form',
            'status' => 'new',
        ]);

        return redirect()->back()->with('success', 'Thank you! Our team will contact you within 24 hours.');
    }
}
