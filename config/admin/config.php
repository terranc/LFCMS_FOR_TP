<?php
return [
    'view_replace_str' => [
        '__PUBLIC__' => '/static/admin',
        '__UPLOAD__' => '', //上传URL
        '__UPLOAD_PATH__' => '', //上传目录
        '__ROOT__' => '/',
        '__SELF__' => strip_tags($_SERVER['REQUEST_URI']),
    ],
];