<?php
/**
 * 三流（Mitsulu）お問い合わせフォーム API - CORS完全対応版
 *
 * 配置場所: Xserver /mitsulu.style/public_html/form/contact.php
 * URL: https://form.mitsulu.style/contact.php
 * 送信先: mk@mitsulu.style
 *
 * 変更点:
 * - 全ての処理よりも先にCORSヘッダーを送信（ob_start使用）
 * - HTTPSリダイレクトを完全に無効化
 * - デバッグログ追加
 */

// 出力バッファリング開始（ヘッダー送信を確実にするため）
ob_start();

// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

// エラー表示を抑制（本番環境）
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ===== CORS設定（最優先処理） =====
$allowed_origins = array(
    'https://mitsulu.style',
    'https://www.mitsulu.style',
    'http://localhost:3000'
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// デバッグログ
error_log("[Contact Form] Method: {$request_method}, Origin: {$origin}, Time: " . date('Y-m-d H:i:s'));

// OPTIONSリクエストの処理（最優先）
if ($request_method === 'OPTIONS') {
    error_log("[Contact Form] Processing OPTIONS request from {$origin}");

    // 出力バッファをクリア
    ob_clean();

    // CORSヘッダーを送信
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        error_log("[Contact Form] Allowed origin: {$origin}");
    } else {
        header('Access-Control-Allow-Origin: https://mitsulu.style');
        error_log("[Contact Form] Using default origin for: {$origin}");
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header('Content-Type: text/plain');
    header('Content-Length: 0');

    http_response_code(200);
    error_log("[Contact Form] OPTIONS response sent successfully");

    ob_end_flush();
    exit(0);
}

// 通常のリクエスト用CORSヘッダー
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: https://mitsulu.style');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

error_log("[Contact Form] CORS headers set for {$request_method} request");

// POSTリクエストのみ許可
if ($request_method !== 'POST') {
    error_log("[Contact Form] Invalid method: {$request_method}");
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'POSTリクエストのみ受け付けます。'));
    ob_end_flush();
    exit;
}

// JSONデータを取得
$json_input = @file_get_contents('php://input');
if ($json_input === false || empty($json_input)) {
    error_log("[Contact Form] No input data");
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'No input data'));
    ob_end_flush();
    exit;
}

$data = json_decode($json_input, true);

// JSONデコードエラーチェック
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    error_log("[Contact Form] Invalid JSON: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid JSON'));
    ob_end_flush();
    exit;
}

// データ検証
$required_fields = array('name', 'email', 'message', 'category');
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        error_log("[Contact Form] Missing required field: {$field}");
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '必須項目が入力されていません'));
        ob_end_flush();
        exit;
    }
}

// メールアドレスの検証
$email_check = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
if (!$email_check) {
    error_log("[Contact Form] Invalid email: " . $data['email']);
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => '有効なメールアドレスを入力してください'));
    ob_end_flush();
    exit;
}

// データのサニタイズ
$name = mb_substr(strip_tags(trim($data['name'])), 0, 100);
$email = trim($data['email']);
$phone = isset($data['phone']) ? mb_substr(strip_tags(trim($data['phone'])), 0, 20) : '';
$company = isset($data['company']) ? mb_substr(strip_tags(trim($data['company'])), 0, 100) : '';
$category = strip_tags(trim($data['category']));
$message = mb_substr(strip_tags(trim($data['message'])), 0, 5000);

error_log("[Contact Form] Processing inquiry from: {$name} <{$email}>");

// 送信先メールアドレス
$to_email = 'mk@mitsulu.style';

// お問い合わせ種類の変換
$category_list = array(
    'facilitation' => 'ファシリテーション',
    'planning' => '企画・研修',
    'design' => 'デザイン・制作',
    'web' => 'Web構築・開発・運用',
    'pm' => '進行管理',
    'education' => '教育・講習',
    'experience' => '体験サポート',
    'estimate' => '料金見積もり',
    'other' => 'その他'
);

$category_display = isset($category_list[$category]) ? $category_list[$category] : $category;

// メール件名
$subject = '【三流】お問い合わせ - ' . $category_display;

// メール本文（管理者向け）
$admin_message = "三流のWebサイトからお問い合わせがありました。\n\n";
$admin_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$admin_message .= "■ お名前\n" . $name . "\n\n";
$admin_message .= "■ メールアドレス\n" . $email . "\n\n";

if (!empty($phone)) {
    $admin_message .= "■ 電話番号\n" . $phone . "\n\n";
}

if (!empty($company)) {
    $admin_message .= "■ 会社名・団体名\n" . $company . "\n\n";
}

$admin_message .= "■ お問い合わせ種類\n" . $category_display . "\n\n";
$admin_message .= "■ お問い合わせ内容\n";
$admin_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$admin_message .= $message . "\n";
$admin_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$admin_message .= "---\n";
$admin_message .= "送信日時: " . date('Y年m月d日 H時i分s秒') . "\n";

$remote_addr = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown';
$user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';

$admin_message .= "送信元IP: " . $remote_addr . "\n";
$admin_message .= "User-Agent: " . $user_agent . "\n";

// メールヘッダー（管理者向け）
$admin_headers = "From: 三流お問い合わせフォーム <noreply@mitsulu.style>\r\n";
$admin_headers .= "Reply-To: " . $email . "\r\n";
$admin_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// メール送信（管理者向け）
$mail_admin_result = mb_send_mail($to_email, $subject, $admin_message, $admin_headers);

if ($mail_admin_result) {
    error_log("[Contact Form] Admin email sent successfully to {$to_email}");
} else {
    error_log("[Contact Form] Failed to send admin email to {$to_email}");
}

// 自動返信メール（お客様向け）
$reply_subject = '【三流】お問い合わせを受け付けました';

$reply_message = $name . " 様\n\n";
$reply_message .= "この度は三流（Mitsulu）にお問い合わせいただき、誠にありがとうございます。\n";
$reply_message .= "以下の内容でお問い合わせを受け付けました。\n";
$reply_message .= "24時間以内に担当者よりご連絡いたしますので、今しばらくお待ちください。\n\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$reply_message .= "【お問い合わせ内容の確認】\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$reply_message .= "【お名前】\n" . $name . "\n\n";
$reply_message .= "【メールアドレス】\n" . $email . "\n\n";

if (!empty($phone)) {
    $reply_message .= "【電話番号】\n" . $phone . "\n\n";
}

if (!empty($company)) {
    $reply_message .= "【会社名・団体名】\n" . $company . "\n\n";
}

$reply_message .= "【お問い合わせ種類】\n" . $category_display . "\n\n";
$reply_message .= "【お問い合わせ内容】\n" . $message . "\n\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$reply_message .= "■ 注意事項\n\n";
$reply_message .= "・このメールは自動送信されています。このメールへの返信は受け付けておりません。\n";
$reply_message .= "・担当者から改めてご連絡いたしますので、今しばらくお待ちください。\n";
$reply_message .= "・迷惑メールフォルダに振り分けられる場合がございます。\n";
$reply_message .= "  メールが届かない場合は、迷惑メールフォルダをご確認ください。\n";
$reply_message .= "・メールアドレスに誤りがあった場合、ご連絡できない可能性がございます。\n";
$reply_message .= "  その際は再度お問い合わせください。\n\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$reply_message .= "三流（Mitsulu）\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$reply_message .= "小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん\n\n";
$reply_message .= "【公式サイト】\n";
$reply_message .= "https://mitsulu.style\n\n";
$reply_message .= "【お問い合わせ】\n";
$reply_message .= "mk@mitsulu.style\n\n";
$reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

$reply_headers = "From: 三流 <noreply@mitsulu.style>\r\n";
$reply_headers .= "Reply-To: mk@mitsulu.style\r\n";
$reply_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 自動返信送信
$mail_user_result = mb_send_mail($email, $reply_subject, $reply_message, $reply_headers);

if ($mail_user_result) {
    error_log("[Contact Form] Auto-reply email sent successfully to {$email}");
} else {
    error_log("[Contact Form] Failed to send auto-reply email to {$email}");
}

// レスポンス返却
if ($mail_admin_result && $mail_user_result) {
    // 両方成功
    http_response_code(200);
    echo json_encode(array(
        'success' => true,
        'message' => 'お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。'
    ));

    error_log("[Contact Form] Success - Both emails sent to admin and user");

} elseif ($mail_admin_result && !$mail_user_result) {
    // 管理者には届いたが、自動返信が失敗
    http_response_code(200);
    echo json_encode(array(
        'success' => true,
        'message' => 'お問い合わせを受け付けました。（確認メールの送信に失敗した可能性があります）'
    ));

    error_log("[Contact Form] Partial success - Admin email sent but auto-reply failed");

} else {
    // メール送信に失敗
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'message' => 'メール送信に失敗しました。時間をおいて再度お試しいただくか、mk@mitsulu.styleへ直接ご連絡ください。'
    ));

    error_log("[Contact Form] Failed - Email sending error");
}

ob_end_flush();
?>
