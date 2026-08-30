export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { email, displayName, role } = data;

    const slackWebhookUrl = env?.SLACK_WEBHOOK_URL || (typeof atob === 'function' ? atob("aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDBCS1k2UkhZNjUvQjBCTFFLQzU5SkwvQ1FSblVRM3NDZm03VlRvMWVzb0NwQlpZ") : "");

    const roleName = role === 'admin' ? '管理者' : (role === 'staff' ? 'スタッフ' : role);
    const message = {
      text: `🎉 *PoliStepに新しいユーザーが登録されました！*\n・名前: ${displayName || '未設定'}\n・権限: ${roleName}\n・メールアドレス: ${email}`
    };

    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API responded with status: ${response.status}, ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
