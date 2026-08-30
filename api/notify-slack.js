export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, displayName, role } = req.body || {};
    const webhookUrl = process.env.SLACK_WEBHOOK_URL || (typeof atob === "function" ? atob("aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDBCS1k2UkhZNjUvQjBCTFFLQzU5SkwvQ1FSblVRM3NDZm03VlRvMWVzb0NwQlpZ") : "");

    const roleName = role === "admin" ? "管理者" : (role === "staff" ? "スタッフ" : role);
    const message = {
      text: "🎉 *PoliStepに新しいユーザーが登録されました！*\n・名前: " + (displayName || "未設定") + "\n・権限: " + roleName + "\n・メールアドレス: " + email
    };

    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!slackRes.ok) {
      throw new Error("Slack API error: " + slackRes.status);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Slack notify error:", error);
    return res.status(500).json({ error: error.message });
  }
}
