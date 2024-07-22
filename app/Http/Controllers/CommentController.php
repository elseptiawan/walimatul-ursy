<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{Comment, User};
use Illuminate\Support\Facades\Hash;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'comment' => 'required|string',
            'is_present' => 'required|boolean',
        ]);

        $user = User::where('name', $request->name)->first();
        if (!$user) {
            $user = new User();
            $user->name = $request->name;
            $user->password = Hash::make('password');
            $user->email = $request->name . '@gmail.com';
            $user->save();
        }

        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->comment = $request->comment;
        $comment->is_present = $request->is_present;
        $comment->save();

        return response()->json(['message' => 'Created', 'status' => 201], 201);;
    }

    public function index(Request $request)
    {
        $request->validate([
            'next' => 'nullable|int',
            'per' => 'nullable|int|max:10'
        ]);

        $offset = $request['next'] ? $request['next'] * $request['per'] : 0;
        $comments = Comment::with('user')->limit(10)->offset($offset)->orderBy('id', 'DESC')->get();
        $count = Comment::count();
        return response()->json(['data' => $comments, 'code' => 200, 'total' => $count], 200);
    }
}
