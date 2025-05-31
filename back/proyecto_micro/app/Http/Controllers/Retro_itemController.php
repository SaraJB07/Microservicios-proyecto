<?php

namespace App\Http\Controllers;

use App\Models\Retro_item;
use Illuminate\Http\Request;

class Retro_itemController extends Controller
{
    public function index()
    {
        $rows = Retro_item::all();
        return response()
            ->json(['data' => $rows], 200);
    }

    
    public function store(Request $request)
    {
        $data = $request->all();
        $newRetro_Item = new Retro_item();
        $newRetro_Item->sprint_id = $data['sprint_id'];
        $newRetro_Item->categoria = $data['categoria'];
        $newRetro_Item->descripcion = $data['descripcion'];
        $newRetro_Item->cumplida = $data['cumplida'];
        $newRetro_Item->fecha_revision = $data['fecha_revision'];
        $newRetro_Item->save();
        return response()->json(['data' => 'Datos guardados'], 201);
    }

    public function show(string $id)
    {
        $row = Retro_item::find($id);
        if (empty($row)) {
            return response()->json(['data' => 'No existe'], 404);
        }
        return response()->json(['data' => $row], 200);
    }

   
    public function update(Request $request, string $id)
    {
        
        $row = Retro_item::find($id);
        if (empty($row)) {
            return response()->json(['data' => 'No existe'], 404);
        }
        $data = $request->all();
        $row->sprint_id = $data['sprint_id'];
        $row->categoria = $data['categoria'];
        $row->descripcion = $data['descripcion'];
        $row->cumplida = $data['cumplida'];
        $row->fecha_revision = $data['fecha_revision'];
        $row->save();
        return response()->json(['data' => 'Datos guardados'], 200);
    }

    
    public function destroy(string $id)
    {
        $row = Retro_item::find($id);
        if (empty($row)) {
            return response()->json(['data' => 'No existe'], 404);
        }
        $row->delete();
        return response()->json(['data' => 'Datos eliminados'], 200);
    }
}
