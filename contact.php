<?php
/**
 * 三流（Mitsulu）お問い合わせフォーム送信処理
 * 
 * 設置場所: https://mitsulu.style/contact.php
 * 送信先: mk@mitsulu.style
 */

// エラー表示を抑制（本番環境）
error_reporting(0);
ini_set('display_errors', 0);

// CORS設定（Vercelからのアクセスを許可）
header('Access-Control-Allow-Origin: https://mitsulu.style');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONSリクエスト（プリフライト）への対応
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';

if ($request_method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POSTリクエストのみ許可
if ($request_method !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'Method Not Allowed'));
    exit;
}

// JSONデータを取得
$json_input = @file_get_contents('php://input');
if ($json_input === false) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'No input data'));
    exit;
}

$data = json_decode($json_input, true);

// JSONデコードエラーチェック
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid JSON'));
    exit;
}

// データ検証
$required_fields = array('name', 'email', 'message', 'category');
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '必須項目が入力されていません'));
        exit;
    }
}

// メールアドレスの検証
$email_check = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
if (!$email_check) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => '有効なメールアドレスを入力してください'));
    exit;
}

// データのサニタイズ
$name = mb_substr(strip_tags(trim($data['name'])), 0, 100);
$email = trim($data['email']);
$phone = isset($data['phone']) ? mb_substr(strip_tags(trim($data['phone'])), 0, 20) : '';
$company = isset($data['company']) ? mb_substr(strip_tags(trim($data['company'])), 0, 100) : '';
$category = strip_tags(trim($data['category']));
$message = mb_substr(strip_tags(trim($data['message'])), 0, 5000);

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
$mail_result = mb_send_mail($to_email, $subject, $admin_message, $admin_headers);

if ($mail_result) {
    // 自動返信メール（お客様向け）
    $reply_subject = '【三流】お問い合わせを受け付けました';
    
    $reply_message = $name . " 様\n\n";
    $reply_message .= "この度は三流にお問い合わせいただき、誠にありがとうございます。\n";
    $reply_message .= "以下の内容で受け付けました。\n\n";
    $reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $reply_message .= "【受付内容】\n\n";
    $reply_message .= "お問い合わせ種類: " . $category_display . "\n\n";
    $reply_message .= "お問い合わせ内容:\n" . $message . "\n";
    $reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $reply_message .= "内容を確認次第、1〜2営業日以内にご返信いたします。\n";
    $reply_message .= "今しばらくお待ちくださいませ。\n\n";
    $reply_message .= "※このメールは自動送信されています。\n";
    $reply_message .= "※このメールに返信されても確認できませんのでご了承ください。\n\n";
    $reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $reply_message .= "三流（Mitsulu）\n";
    $reply_message .= "様々な悩みの受け皿に\n";
    $reply_message .= "https://mitsulu.style\n";
    $reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $reply_headers = "From: 三流 <noreply@mitsulu.style>\r\n";
    $reply_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // 自動返信送信
    @mb_send_mail($email, $reply_subject, $reply_message, $reply_headers);

    // 成功レスポンス
    http_response_code(200);
    echo json_encode(array(
        'success' => true, 
        'message' => 'お問い合わせを受け付けました。ご入力いただいたメールアドレス宛に確認メールをお送りしました。'
    ));
} else {
    // メール送信失敗
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'メール送信に失敗しました。時間をおいて再度お試しください。'
    ));
}
?>
