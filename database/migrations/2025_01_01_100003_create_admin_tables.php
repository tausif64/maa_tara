<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Site-wide settings stored as key-value pairs
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general'); // general|contact|social|hero|seo
            $table->timestamps();
        });

        // Patients / admissions managed by admin
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->enum('status', ['admitted', 'under_treatment', 'released', 'follow_up', 'discharged'])->default('admitted');
            $table->date('admission_date');
            $table->date('expected_release')->nullable();
            $table->date('actual_release')->nullable();
            $table->string('addiction_type')->nullable();
            $table->enum('severity', ['mild', 'moderate', 'severe', 'critical'])->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone', 20)->nullable();
            $table->string('room_number', 20)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
        Schema::dropIfExists('site_settings');
    }
};
