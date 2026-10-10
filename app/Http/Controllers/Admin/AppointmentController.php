<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $appointments = Appointment::query()
            ->when($request->search, fn($q, $s) => $q->where('patient_name', 'like', "%$s%")
                ->orWhere('reference_code', 'like', "%$s%")
                ->orWhere('contact_number', 'like', "%$s%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->date, fn($q, $d) => $q->whereDate('appointment_date', $d))
            ->orderBy('appointment_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/appointments', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'date']),
        ]);
    }

    public function update(Request $request, Appointment $appointment): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,rescheduled,completed,cancelled',
        ]);
        $appointment->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Appointment status updated.');
    }
}
