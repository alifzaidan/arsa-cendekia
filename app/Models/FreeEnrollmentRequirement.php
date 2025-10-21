<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FreeEnrollmentRequirement extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function enrollmentWebinar()
    {
        return $this->belongsTo(EnrollmentWebinar::class, 'enrollment_id')
            ->where('enrollment_type', 'webinar');
    }

    public function getEnrollment()
    {
        switch ($this->enrollment_type) {
            case 'webinar':
                return $this->enrollmentWebinar;
            default:
                return null;
        }
    }

    public function getUser()
    {
        $enrollment = $this->getEnrollment();
        return $enrollment ? $enrollment->invoice->user : null;
    }
}
