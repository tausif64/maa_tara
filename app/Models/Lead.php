<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name', 'phone', 'email', 'addiction_type',
        'message', 'source', 'status', 'notes', 'honeypot',
    ];
}
