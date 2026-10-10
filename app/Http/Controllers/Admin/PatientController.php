<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('room_number', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $patients = $query->orderByDesc('admission_date')->paginate(15)->withQueryString();

        return Inertia::render('admin/patients', [
            'patients' => $patients,
            'filters'  => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'phone'            => 'required|string|max:20',
            'email'            => 'nullable|email',
            'status'           => 'required|in:admitted,under_treatment,released,follow_up,discharged',
            'admission_date'   => 'required|date',
            'expected_release' => 'nullable|date|after_or_equal:admission_date',
            'actual_release'   => 'nullable|date',
            'addiction_type'   => 'nullable|string',
            'severity'         => 'nullable|in:mild,moderate,severe,critical',
            'guardian_name'    => 'nullable|string',
            'guardian_phone'   => 'nullable|string',
            'room_number'      => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        Patient::create($data);

        return back()->with('success', 'Patient admitted successfully.');
    }

    public function update(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'phone'            => 'sometimes|string|max:20',
            'email'            => 'nullable|email',
            'status'           => 'sometimes|in:admitted,under_treatment,released,follow_up,discharged',
            'admission_date'   => 'sometimes|date',
            'expected_release' => 'nullable|date',
            'actual_release'   => 'nullable|date',
            'addiction_type'   => 'nullable|string',
            'severity'         => 'nullable|in:mild,moderate,severe,critical',
            'guardian_name'    => 'nullable|string',
            'guardian_phone'   => 'nullable|string',
            'room_number'      => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        $patient->update($data);

        return back()->with('success', 'Patient record updated.');
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return back()->with('success', 'Patient record deleted.');
    }
}
