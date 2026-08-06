<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('enrollment_webinars', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollment_webinars', 'rating')) {
                $table->integer('rating')->nullable()->after('review');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_webinars', function (Blueprint $table) {
            if (Schema::hasColumn('enrollment_webinars', 'rating')) {
                $table->dropColumn('rating');
            }
        });
    }
};
