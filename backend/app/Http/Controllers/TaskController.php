<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        // Par défaut, on affiche 6 tâches par page
        $perPage = $request->input('per_page', 6);
        $page = $request->input('page', 1);
        
        $query = Task::with('user');
        
        // Si on a un filtre de statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Si on a un filtre de catégorie
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        // Récupération des tâches paginées
        $tasks = $query->orderBy('created_at', 'desc')
                      ->paginate($perPage, ['*'], 'page', $page);
        
        return response()->json([
            'data' => $tasks->items(),
            'current_page' => $tasks->currentPage(),
            'last_page' => $tasks->lastPage(),
            'per_page' => $tasks->perPage(),
            'total' => $tasks->total(),
        ]);
    }

    public function store(Request $request)
    {
        // Gérer les requêtes OPTIONS (prévol)
        if ($request->isMethod('OPTIONS')) {
            return response()->json('OK', 200, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, Authorization',
                'Access-Control-Allow-Credentials' => 'true'
            ]);
        }

        \Log::info('Requête reçue pour créer une tâche', [
            'all' => $request->all(),
            'headers' => $request->headers->all(),
            'content_type' => $request->header('Content-Type'),
            'accept' => $request->header('Accept')
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,in_progress,completed',
                'category' => 'nullable|string',
            ]);

            \Log::info('Données validées', $validated);

            // S'assurer que le statut est valide
            $validated['status'] = in_array($validated['status'], ['pending', 'in_progress', 'completed']) 
                ? $validated['status'] 
                : 'pending';

            $task = Task::create(array_merge($validated, ['user_id' => auth()->id()]));
            \Log::info('Tâche créée', $task->toArray());

            return response()->json($task, 201, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, Authorization',
                'Access-Control-Allow-Credentials' => 'true'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la tâche', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, Authorization',
                'Access-Control-Allow-Credentials' => 'true'
            ]);
        }
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'category' => 'nullable|string',
        ]);

        // S'assurer que le statut est valide
        $validated['status'] = in_array($validated['status'], ['pending', 'in_progress', 'completed']) 
            ? $validated['status'] 
            : 'pending';

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}