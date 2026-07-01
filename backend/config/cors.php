<?php

return [


    'paths' => ['api/*', 'v/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://127.0.0.1:5173', 
        'http://127.0.0.1:5174',
        'https://pdf-url-frontend.vercel.app/'
    ],

    'allowed_origins_patterns' => [ '#^https://pdf-url-frontend.*\.vercel\.app$#',],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Disposition'],

    'max_age' => 0,

    'supports_credentials' => true,
];