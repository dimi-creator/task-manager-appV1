<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request)
    {
        try {
            \Log::info('Tentative de connexion', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'user_agent' => $request->header('User-Agent')
            ]);

            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
                'device_name' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                \Log::warning('Tentative de connexion échouée - Utilisateur non trouvé', [
                    'email' => $request->email
                ]);
                return response()->json([
                    'message' => 'Les identifiants fournis sont incorrects.'
                ], 401);
            }

            if (!Hash::check($request->password, $user->password)) {
                \Log::warning('Tentative de connexion échouée - Mot de passe incorrect', [
                    'email' => $request->email
                ]);
                return response()->json([
                    'message' => 'Les identifiants fournis sont incorrects.'
                ], 401);
            }

            // Supprimer les anciens tokens
            $user->tokens()->where('name', $request->device_name)->delete();

            // Créer un nouveau token
            $token = $user->createToken($request->device_name)->plainTextToken;

            \Log::info('Connexion réussie', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ],
                'token' => $token
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la tentative de connexion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.'
            ], 500);
        }
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}