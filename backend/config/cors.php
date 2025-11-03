<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'tasks'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://tmappp.netlify.app',  // ✅ ton URL Netlify exacte
        'http://localhost:3000',       // pour le développement local React
        'http://localhost:8000',       // pour le développement local Laravel
        'http://127.0.0.1:3000',       // alternative pour le développement local
        'http://127.0.0.1:8000'        // alternative pour le développement local
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['*'],
    'max_age' => 0,
    'supports_credentials' => true,
];
