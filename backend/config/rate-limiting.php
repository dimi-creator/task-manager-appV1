<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for rate limiting. You can specify
    | the maximum number of requests that can be made within a given time
    | period for any given IP address or user.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure rate limiting for different parts of your
    | application. You can adjust these values as needed.
    |
    */

    'defaults' => [
        'limit' => 60, // Number of requests
        'expires' => 1, // In minutes
    ],

    'routes' => [
        'login' => [
            'limit' => 5, // 5 requests per minute for login
            'expires' => 1, // 1 minute
        ],
        'api' => [
            'limit' => 60, // 60 requests per minute for API
            'expires' => 1, // 1 minute
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Response When Rate Limited
    |--------------------------------------------------------------------------
    |
    | This value determines the response that will be returned when a rate
    | limit is exceeded. You can customize this response as needed.
    |
    */

    'response' => [
        'status' => 429,
        'content' => [
            'message' => 'Too many attempts. Please try again later.',
        ],
        'headers' => [
            'Retry-After' => 60, // Seconds to wait before retrying
            'X-RateLimit-Limit' => 60, // Maximum number of requests
            'X-RateLimit-Remaining' => 0, // Remaining number of requests
        ],
    ],
];
