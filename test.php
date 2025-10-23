<?php
// 詳細な診断テストファイル
header('Content-Type: application/json; charset=utf-8');

$info = array(
    'status' => 'ok',
    'message' => 'PHP is working!',
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
    'current_dir' => __DIR__,
    'file_permissions' => substr(sprintf('%o', fileperms(__FILE__)), -4),
    'functions_available' => array(
        'file_get_contents' => function_exists('file_get_contents'),
        'mb_send_mail' => function_exists('mb_send_mail'),
        'json_encode' => function_exists('json_encode')
    )
);

echo json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
