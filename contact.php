<?php
/**
 * 三流（Mitsulu）お問い合わせフォーム送信処理
 * 
 * 設置場所: https://mitsulu.style/contact.php
 * 送信先: mk@mitsulu.style
 */

// CORS設定（Vercelからのアクセスを許可）
header('Access-Control-Allow-Origin: https://mitsulu.style');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONSリクエスト（プリフライト）への対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POSTリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// JSONデータを取得
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// JSONデコードエラーチェック
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// データ検証
$required_fields = ['name', 'email', 'message', 'category'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => '必須項目が入力されていません: ' . $field]);
        exit;
    }
}

// メールアドレスの検証
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '有効なメールアドレスを入力してください']);
    exit;
}

// XSS対策：HTMLタグを除去
$data = array_map(function($value) {
    return is_string($value) ? strip_tags($value) : $value;
}, $data);

// 送信先メールアドレス
$to = 'mk@mitsulu.style';

// お問い合わせ種類の変換
$category_map = [
    'facilitation' => 'ファシリテーション',
    'planning' => '企画・研修',
    'design' => 'デザイン・制作',
    'web' => 'Web構築・開発・運用',
    'pm' => '進行管理',
    'education' => '教育・講習',
    'experience' => '体験サポート',
    'estimate' => '料金見積もり',
    'other' => 'その他'
];
$category_display = isset($category_map[$data['category']]) ? $category_map[$data['category']] : $data['category'];

// メール件名
$subject = '【三流】お問い合わせ - ' . $category_display;

// メール本文
$message = "三流のWebサイトからお問い合わせがありました。\n\n";
$message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$message .= "■ お名前\n";
$message .= $data['name'] . "\n\n";

$message .= "■ メールアドレス\n";
$message .= $data['email'] . "\n\n";

if (!empty($data['phone'])) {
    $message .= "■ 電話番号\n";
    $message .= $data['phone'] . "\n\n";
}

if (!empty($data['company'])) {
    $message .= "■ 会社名・団体名\n";
    $data['company'] . "\n\n";
}

$message .= "■ お問い合わせ種類\n";
$message .= $category_display . "\n\n";

$message .= "■ お問い合わせ内容\n";
$message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$message .= $data['message'] . "\n";
$message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$message .= "---\n";
$message .= "送信日時: " . date('Y年m月d日 H時i分s秒') . "\n";
$message .= "送信元IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$message .= "User-Agent: " . (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown') . "\n";

// メールヘッダー（管理者向け）
$headers = "From: 三流お問い合わせフォーム <noreply@mitsulu.style>\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// メール送信
$mail_sent = mb_send_mail($to, $subject, $message, $headers);

if ($mail_sent) {
    // 自動返信メール（お客様向け）
    $auto_reply_subject = '【三流】お問い合わせを受け付けました';
    
    $auto_reply_message = $data['name'] . " 様\n\n";
    $auto_reply_message .= "この度は三流にお問い合わせいただき、誠にありがとうございます。\n";
    $auto_reply_message .= "以下の内容で受け付けました。\n\n";
    $auto_reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $auto_reply_message .= "【受付内容】\n\n";
    $auto_reply_message .= "お問い合わせ種類: " . $category_display . "\n\n";
    $auto_reply_message .= "お問い合わせ内容:\n";
    $auto_reply_message .= $data['message'] . "\n";
    $auto_reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $auto_reply_message .= "内容を確認次第、1〜2営業日以内にご返信いたします。\n";
    $auto_reply_message .= "今しばらくお待ちくださいませ。\n\n";
    $auto_reply_message .= "※このメールは自動送信されています。\n";
    $auto_reply_message .= "※このメールに返信されても確認できませんのでご了承ください。\n\n";
    $auto_reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $auto_reply_message .= "三流（Mitsulu）\n";
    $auto_reply_message .= "様々な悩みの受け皿に\n";
    $auto_reply_message .= "https://mitsulu.style\n";
    $auto_reply_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $auto_reply_headers = "From: 三流 <noreply@mitsulu.style>\r\n";
    $auto_reply_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $auto_reply_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // 自動返信送信（失敗しても管理者へのメールは送信済みなのでエラーにしない）
    mb_send_mail($data['email'], $auto_reply_subject, $auto_reply_message, $auto_reply_headers);

    // 成功レスポンス
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'お問い合わせを受け付けました。ご入力いただいたメールアドレス宛に確認メールをお送りしました。'
    ]);
} else {
    // メール送信失敗
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'メール送信に失敗しました。時間をおいて再度お試しください。'
    ]);
}
?>
