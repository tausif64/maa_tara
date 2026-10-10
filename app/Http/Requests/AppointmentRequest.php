<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['required', 'string', 'max:100'],
            'contact_number' => ['required', 'string', 'max:15'],
            'email' => ['nullable', 'email', 'max:150'],
            'guardian_name' => ['nullable', 'string', 'max:100'],
            'guardian_relation' => ['nullable', 'string', 'max:50'],
            'service_type' => ['required', 'in:inpatient,outpatient,family_counseling,emergency_detox'],
            'consultation_mode' => ['required', 'in:in_person,online'],
            'appointment_date' => ['required', 'date', 'after:today'],
            'time_slot' => ['required', 'string'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'severity' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string'], // honeypot
        ];
    }
}
