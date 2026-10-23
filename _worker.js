// Cloudflare Pages Advanced-mode worker：伺服器端登入關卡（HTTP Basic Auth）。
// 密碼存 Cloudflare 環境變數 SITE_USER / SITE_PASS（不寫在程式、不進 git）。
// fail-closed：未設定 SITE_PASS 時一律要求登入，避免誤開放。
export default {
  async fetch(request, env) {
    const user = env.SITE_USER || "";
    const pass = env.SITE_PASS || "";
    const expected = "Basic " + btoa(`${user}:${pass}`);
    const got = request.headers.get("Authorization") || "";
    if (!pass || got !== expected) {
      return new Response("桃園災防區案件資料需登入後檢視。", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="桃園災防區 (需登入)", charset="UTF-8"',
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
