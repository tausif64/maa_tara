<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'patient_name', 'patient_initials', 'story',
        'rating', 'addiction_type', 'recovery_months', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
