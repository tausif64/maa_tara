<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'name', 'phone', 'email', 'status',
        'admission_date', 'expected_release', 'actual_release',
        'addiction_type', 'severity',
        'guardian_name', 'guardian_phone',
        'room_number', 'notes',
    ];

    protected $casts = [
        'admission_date'   => 'date',
        'expected_release' => 'date',
        'actual_release'   => 'date',
    ];
}
