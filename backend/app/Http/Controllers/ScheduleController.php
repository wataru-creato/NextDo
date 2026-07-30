<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedules = \App\Models\Schedule::orderBy('start_time', 'asc')->get();
        return response()->json($schedules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $schedule=\App\Models\Schedule::create([
            'content'=>$request->scheduleContent,
            'start_time'=>$request->startTime,
            'end_time'=>$request->endTime,
        ]);
        return response()->json($schedule, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $schedule=\App\Models\Schedule::find($id);
        return response()->json($schedule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $schedule=\App\Models\Schedule::find($id);
        $schedule->update([
            'content'=>$request->scheduleContent,
            'start_time'=>$request->startTime,
            'end_time'=>$request->endTime,
        ]);
        return response()->json($schedule);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $schedule=\App\Models\Schedule::find($id);
        $schedule->delete();
        return response()->json(null, 204);
    }
}
