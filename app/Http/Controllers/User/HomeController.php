<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Promotion;
use App\Models\Tool;
use App\Models\Webinar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $referralCode = $request->query('ref');

        if ($referralCode) {
            session(['referral_code' => $referralCode]);
        }

        $tools = Tool::all();

        // Ambil promotion yang aktif
        $activePromotion = Promotion::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->latest()
            ->first();

        // Ambil data dari ketiga model
        $courses = Course::with(['category'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'thumbnail' => $course->thumbnail,
                    'slug' => $course->slug,
                    'strikethrough_price' => $course->strikethrough_price,
                    'price' => $course->price,
                    'level' => $course->level,
                    'category' => $course->category,
                    'type' => 'course',
                    'created_at' => $course->created_at,
                ];
            });

        $webinars = Webinar::with(['category'])
            ->where('status', 'published')
            ->where('start_time', '>=', now())
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($webinar) {
                return [
                    'id' => $webinar->id,
                    'title' => $webinar->title,
                    'thumbnail' => $webinar->thumbnail,
                    'slug' => $webinar->slug,
                    'strikethrough_price' => $webinar->strikethrough_price ?? 0,
                    'price' => $webinar->price,
                    'start_time' => $webinar->start_time,
                    'category' => $webinar->category,
                    'type' => 'webinar',
                    'created_at' => $webinar->created_at,
                ];
            });

        // Gabungkan semua produk dan urutkan berdasarkan tanggal terbaru
        $latestProducts = collect()
            ->merge($courses)
            ->merge($webinars)
            ->sortByDesc('created_at')
            ->take(6)
            ->values();

        // Ambil semua produk untuk fake notifications (tidak hanya 6 teratas)
        $allProducts = collect()
            ->merge($courses)
            ->merge($webinars)
            ->map(function ($product) {
                return [
                    'id' => $product['id'],
                    'title' => $product['title'],
                    'type' => $product['type'],
                    'price' => $product['price'],
                ];
            });

        $myProductIds = [
            'courses' => [],
            'webinars' => [],
        ];

        if (Auth::check()) {
            $userId = Auth::id();

            $myCourseIds = Invoice::with('courseItems')
                ->where('user_id', $userId)
                ->where('status', 'paid')
                ->get()
                ->flatMap(function ($invoice) {
                    return $invoice->courseItems->pluck('course_id');
                })
                ->unique()
                ->values()
                ->all();

            $myWebinarIds = Invoice::with('webinarItems')
                ->where('user_id', $userId)
                ->where('status', 'paid')
                ->get()
                ->flatMap(function ($invoice) {
                    return $invoice->webinarItems->pluck('webinar_id');
                })
                ->unique()
                ->values()
                ->all();

            $myProductIds = [
                'courses' => $myCourseIds,
                'webinars' => $myWebinarIds,
            ];
        }

        return Inertia::render('user/home/index', [
            'tools' => $tools,
            'latestProducts' => $latestProducts,
            'myProductIds' => $myProductIds,
            'allProducts' => $allProducts,
            'activePromotion' => $activePromotion,
            'referralInfo' => [
                'code' => session('referral_code'),
                'hasActive' => session('referral_code') && session('referral_code') !== 'ATM2025',
            ],
        ]);
    }
}
