<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('reference_code')->unique();
            $table->string('patient_name');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_relation')->nullable();
            $table->enum('service_type', ['inpatient', 'outpatient', 'family_counseling', 'emergency_detox']);
            $table->enum('consultation_mode', ['in_person', 'online']);
            $table->date('appointment_date');
            $table->string('time_slot');
            $table->text('notes')->nullable();
            $table->string('severity')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('assigned_to')->nullable(); // user ID of counselor
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
