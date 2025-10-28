<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for the API. You can adjust these
    | values as needed for your application.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Here you may configure rate limiting for the API. You can adjust these
    | values as needed.
    |
    */

    'rate_limiting' => [
        'enabled' => env('API_RATE_LIMITING', true),
        'max_attempts' => env('API_RATE_LIMIT', 60),
        'decay_minutes' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | API Middleware
    |--------------------------------------------------------------------------
    |
    | Here you may specify which middleware should be applied to API requests.
    |
    */

    'middleware' => [
        'api' => [
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | API Prefix
    |--------------------------------------------------------------------------
    |
    | This value is the prefix for all API routes. You may change this value
    | to anything you like.
    |
    */

    'prefix' => 'api',

    /*
    |--------------------------------------------------------------------------
    | API Authentication
    |--------------------------------------------------------------------------
    |
    | Here you may configure the authentication settings for the API.
    |
    */

    'auth' => [
        'enabled' => true,
        'guard' => 'sanctum',
        'middleware' => 'auth:sanctum',
    ],
];
