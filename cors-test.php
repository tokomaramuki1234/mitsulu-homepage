<?php
/**
 * CORS動作確認用テストファイル
 * 配置場所: /mitsulu.style/public_html/form/cors-test.php
 * URL: https://form.mitsulu.style/cors-test.php
 */

// 全ての処理よりも前にCORSヘッダーを送信
$allowed_origins = array(
    'https://mitsulu.style',
    'https://www.mitsulu.style',
    'http://localhost:3000'
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';

// デバッグ用ログ
error_log("CORS Test - Method: {$request_method}, Origin: {$origin}");

// OPTIONSリクエストの処理
if ($request_method === 'OPTIONS') {
    error_log("CORS Test - Processing OPTIONS request");

    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        error_log("CORS Test - Allowed origin: {$origin}");
    } else {
        header('Access-Control-Allow-Origin: https://mitsulu.style');
        error_log("CORS Test - Default origin set");
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    error_log("CORS Test - OPTIONS response sent");
    exit;
}

// 通常のリクエスト用CORSヘッダー
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://mitsulu.style');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// POSTリクエストのテスト
if ($request_method === 'POST') {
    error_log("CORS Test - Processing POST request");

    echo json_encode(array(
        'success' => true,
        'message' => 'CORS test successful!',
        'origin' => $origin,
        'method' => $request_method,
        'timestamp' => date('Y-m-d H:i:s')
    ));
    exit;
}

// その他のリクエストメソッド
http_response_code(405);
echo json_encode(array(
    'success' => false,
    'message' => 'Method not allowed'
));
?>
