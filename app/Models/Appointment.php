<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Appointment extends Model
{
    protected $fillable = [
        'reference_code', 'patient_name', 'contact_number', 'email',
        'guardian_name', 'guardian_relation', 'service_type',
        'consultation_mode', 'appointment_date', 'time_slot',
        'notes', 'severity', 'status', 'assigned_to',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($appointment) {
            $appointment->reference_code = 'MTF-' . strtoupper(Str::random(6));
        });
    }

    public function getServiceLabelAttribute(): string
    {
        return match ($this->service_type) {
            'inpatient' => 'Inpatient Consultation',
            'outpatient' => 'Outpatient Session',
            'family_counseling' => 'Family Counseling',
            'emergency_detox' => 'Emergency Detox Admission',
            default => $this->service_type,
        };
    }
}
