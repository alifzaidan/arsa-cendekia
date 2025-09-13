<?php

namespace App\Http\Controllers\User\Profile;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentCourse;
use App\Models\EnrollmentWebinar;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $courseCount = EnrollmentCourse::whereHas('invoice', function ($query) use ($userId) {
            $query->where('user_id', $userId)->where('status', 'paid');
        })->count();

        $webinarCount = EnrollmentWebinar::whereHas('invoice', function ($query) use ($userId) {
            $query->where('user_id', $userId)->where('status', 'paid');
        })->count();

        // Ambil enrollment courses dengan progress
        $enrolledCourses = EnrollmentCourse::with(['course:id,title,slug', 'invoice'])
            ->whereHas('invoice', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'paid');
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                    'slug' => $enrollment->course->slug,
                    'type' => 'course',
                    'progress' => $enrollment->progress,
                    'completed_at' => $enrollment->completed_at,
                    'enrolled_at' => $enrollment->created_at,
                ];
            });

        // Ambil enrollment webinars dengan jadwal dan group URL
        $enrolledWebinars = EnrollmentWebinar::with(['webinar:id,title,slug,start_time,end_time,group_url', 'invoice'])
            ->whereHas('invoice', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'paid');
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->webinar->id,
                    'title' => $enrollment->webinar->title,
                    'slug' => $enrollment->webinar->slug,
                    'type' => 'webinar',
                    'start_time' => $enrollment->webinar->start_time,
                    'end_time' => $enrollment->webinar->end_time,
                    'group_url' => $enrollment->webinar->group_url,
                    'enrolled_at' => $enrollment->created_at,
                ];
            });

        // Gabungkan semua produk dan urutkan berdasarkan tanggal enrollment
        $recentProducts = collect()
            ->merge($enrolledCourses)
            ->merge($enrolledWebinars)
            ->sortByDesc('enrolled_at')
            ->take(10)
            ->values();

        return Inertia::render('user/profile/index', [
            'stats' => [
                'courses' => $courseCount,
                'webinars' => $webinarCount,
                'total' => $courseCount + $webinarCount,
            ],
            'recentProducts' => $recentProducts,
        ]);
    }
}
