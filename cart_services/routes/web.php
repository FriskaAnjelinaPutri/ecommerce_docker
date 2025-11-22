<?php

use Illuminate\Http\Request;

// ------------------------------------------
// Dummy cart persisten
// ------------------------------------------
$GLOBALS['carts'] = [
    'items' => [
        ['id' => 1, 'name' => 'Product A', 'quantity' => 2, 'price' => 50.00],
        ['id' => 2, 'name' => 'Product B', 'quantity' => 1, 'price' => 30.00],
        ['id' => 3, 'name' => 'Product C', 'quantity' => 1, 'price' => 50.00],
    ],
    'total' => 130.00
];

// ------------------------------------------
// GET semua cart
// ------------------------------------------
$router->get('/carts', function () {
    return response()->json([
        'status' => true,
        'message' => 'Cart list fetched',
        'data' => $GLOBALS['carts']['items']
    ]);
});

// ------------------------------------------
// GET detail cart
// ------------------------------------------
$router->get('/carts/{id}', function ($id) {
    foreach ($GLOBALS['carts']['items'] as $item) {
        if ($item['id'] == $id) {
            return response()->json([
                'status' => true,
                'message' => 'Item found',
                'data' => $item
            ]);
        }
    }

    return response()->json([
        'status' => false,
        'message' => 'Item not found'
    ], 404);
});

// ------------------------------------------
// POST tambah cart
// ------------------------------------------
$router->post('/carts', function (Request $request) {
    $newItem = [
        'id' => rand(1000, 9999),
        'name' => $request->input('name', 'Unknown Product'),
        'quantity' => intval($request->input('quantity', 1)),
        'price' => floatval($request->input('price', 0)),
    ];

    $GLOBALS['carts']['items'][] = $newItem;

    return response()->json([
        'status' => true,
        'message' => 'Item added successfully',
        'data' => $newItem
    ]);
});

// ------------------------------------------
// DELETE cart
// ------------------------------------------
$router->delete('/carts/{id}', function ($id) {
    foreach ($GLOBALS['carts']['items'] as $index => $item) {
        if ($item['id'] == $id) {
            unset($GLOBALS['carts']['items'][$index]);
            $GLOBALS['carts']['items'] = array_values($GLOBALS['carts']['items']); // reset index
            return response()->json([
                'status' => true,
                'message' => 'Item deleted successfully'
            ]);
        }
    }

    return response()->json([
        'status' => false,
        'message' => 'Item not found'
    ], 404);
});
