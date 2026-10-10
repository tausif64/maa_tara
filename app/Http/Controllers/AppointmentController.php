<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('appointment');
    }

    public function store(AppointmentRequest $request): RedirectResponse
    {
        // Honeypot check
        if ($request->filled('website')) {
            return redirect()->back();
        }

        $appointment = Appointment::create($request->validated());

        return redirect()->route('appointment.confirmation', $appointment->reference_code);
    }

    public function confirmation(string $code): Response
    {
        $appointment = Appointment::where('reference_code', $code)->firstOrFail();

        return Inertia::render('appointment-confirmation', [
            'appointment' => $appointment,
        ]);
    }
}
