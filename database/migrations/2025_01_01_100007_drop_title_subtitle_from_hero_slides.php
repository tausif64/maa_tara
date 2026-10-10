<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            // Drop title and subtitle columns if they still exist (legacy)
            $columns = Schema::getColumnListing('hero_slides');
            if (in_array('title', $columns)) {
                $table->dropColumn('title');
            }
            if (in_array('subtitle', $columns)) {
                $table->dropColumn('subtitle');
            }
        });
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('title')->nullable()->after('image_path');
            $table->string('subtitle')->nullable()->after('title');
        });
    }
};
