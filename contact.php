<?php
/**
 * 三流（Mitsulu）お問い合わせフォーム API
 *
 * 配置場所: Xserver /mitsulu.style/public_html/form/contact.php
 * URL: https://form.mitsulu.style/contact.php
 * 送信先: mk@mitsulu.style
 *
 * 機能:
 * - フロントエンド（React）からのPOSTリクエストを受信
 * - バリデーション処理
 * - 管理者へメール送信
 * - 送信者へ自動返信メール送信
 */

// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

// エラー表示を抑制（本番環境）
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// 文字エンコーディング設定（重要！）
// 'uni' を使用することで UTF-8 + Base64 エンコーディングが適用される
mb_language('uni');
mb_internal_encoding('UTF-8');

// CORS設定（Vercelからのアクセスを許可）
// 複数のオリジンに対応
$allowed_origins = array(
    'https://mitsulu.style',
    'https://www.mitsulu.style',
    'http://localhost:3000'  // ローカル開発用
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// OPTIONSリクエストは最優先で処理（リダイレクト回避）
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';

if ($request_method === 'OPTIONS') {
    // OPTIONSリクエストに対するCORSヘッダーを即座に送信
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: https://mitsulu.style');
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24時間キャッシュ
    http_response_code(200);
    exit; // ここで処理を終了（リダイレクトさせない）
}

// 通常のリクエスト用CORSヘッダー
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    // デフォルトでmitsulu.styleを許可
    header('Access-Control-Allow-Origin: https://mitsulu.style');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// POSTリクエストのみ許可（OPTIONSは既に処理済み）
if ($request_method !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'POSTリクエストのみ受け付けます。'));
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

// メール送信（管理者向け）
// mb_send_mail() は自動的に Content-Type と Transfer-Encoding を設定
$mail_admin_result = mb_send_mail($to_email, $subject, $admin_message, $admin_headers);

// ログメッセージ
$log_msg = "[" . date('Y-m-d H:i:s') . "] ";

if (!$mail_admin_result) {
    $log_msg .= "管理者メール送信失敗 to: {$to_email}, from: {$email}\n";
    error_log($log_msg);
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

// 自動返信送信
// mb_send_mail() は自動的に Content-Type と Transfer-Encoding を設定
$mail_user_result = mb_send_mail($email, $reply_subject, $reply_message, $reply_headers);

if (!$mail_user_result) {
    $log_msg .= "自動返信メール送信失敗 to: {$email}\n";
    error_log($log_msg);
}

// レスポンス返却
if ($mail_admin_result && $mail_user_result) {
    // 両方成功
    http_response_code(200);
    echo json_encode(array(
        'success' => true,
        'message' => 'お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。'
    ));

    $log_msg .= "メール送信成功 from: {$email}, name: {$name}\n";
    error_log($log_msg);

} elseif ($mail_admin_result && !$mail_user_result) {
    // 管理者には届いたが、自動返信が失敗
    http_response_code(200);
    echo json_encode(array(
        'success' => true,
        'message' => 'お問い合わせを受け付けました。（確認メールの送信に失敗した可能性があります）'
    ));

} else {
    // メール送信に失敗
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'message' => 'メール送信に失敗しました。時間をおいて再度お試しいただくか、mk@mitsulu.styleへ直接ご連絡ください。'
    ));
}
?>
