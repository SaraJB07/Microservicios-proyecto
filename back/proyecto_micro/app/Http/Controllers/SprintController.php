<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    
    public function index()
    {
     
        $rows = Sprint::query();
        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses(Sprint::class))) {
            $rows = $rows->whereNull('deleted_at');
        }
        $rows = $rows->get();
        return response()->json(
            ['data' => $rows],
            200
        );
    }

    
    public function store(Request $request)
    {
        $data = $request->all();
        $newModel = new Sprint();
        $newModel->nombre = $data['nombre'];
        $newModel->fecha_inicio = $data['fecha_inicio'];
        $newModel->fecha_fin = $data['fecha_fin'];
        $newModel->save();
        return response()->json(['data' => 'Datos guardados'], 201);

    }

   
    public function show(int $id)
    {
        $row = Sprint::find($id);
        return response()->json(
            ['data' => $row],
            200
        );
    }

 
    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $row = Sprint::find($id);
        $row->nombre = $data['nombre'];
        $row->fecha_inicio = $data['fecha_inicio'];
        $row->fecha_fin = $data['fecha_fin'];
        $row->save();
        return response()->json(['data' => 'Datos guardados'], 200);

    }

  
    public function destroy(string $id)
    {
        $row = Sprint::find($id);
        $row->delete();
        return response()->json(
            ['data' => "Registro eliminado"],
            200
        );
    }
}
