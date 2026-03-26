<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CheckoutAuthController extends Controller
{
    public function checkEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        return response()->json([
            'exists' => (bool) $user,
            'name' => $user?->name,
            'phone_number' => $user?->phone_number,
        ]);
    }

    public function autoLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $user = User::where('email', $validated['email'])
            ->where('phone_number', $validated['phone_number'])
            ->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Data email dan nomor telepon tidak sesuai.',
            ], 422);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
        ]);
    }

    public function quickRegister(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $affiliateCode = session('referral_code') ?? 'ARS2025';
        $referredByUserId = null;

        if ($affiliateCode) {
            $affiliateUser = User::where('affiliate_code', $affiliateCode)->first();
            if ($affiliateUser) {
                $referredByUserId = $affiliateUser->id;
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'password' => Hash::make($validated['phone_number']),
            'referred_by_user_id' => $referredByUserId,
        ]);

        $user->assignRole('user');

        Auth::login($user);
        $request->session()->regenerate();

        session()->forget('referral_code');

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
        ], 201);
    }
}
