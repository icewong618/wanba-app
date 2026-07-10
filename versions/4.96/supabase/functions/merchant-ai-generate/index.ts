const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PlatformPost = {
  title: string;
  body: string;
  tags: string[];
};

type MerchantAiVersion = {
  title: string;
  body: string;
  tags: string[];
  platforms: Record<string, PlatformPost>;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function asText(value: unknown, fallback = "") {
  return String(value ?? fallback).trim();
}

function cleanTags(tags: unknown, fallback: string[]) {
  const input = Array.isArray(tags) ? tags : fallback;
  return input
    .map((tag) => asText(tag))
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .slice(0, 8);
}

function normalizePost(input: unknown, fallback: PlatformPost): PlatformPost {
  const obj = input && typeof input === "object" ? input as Partial<PlatformPost> : {};
  return {
    title: asText(obj.title, fallback.title).slice(0, 40),
    body: asText(obj.body, fallback.body),
    tags: cleanTags(obj.tags, fallback.tags),
  };
}

function normalizeVersion(input: unknown, rawText: string, type: string): MerchantAiVersion {
  const obj = input && typeof input === "object" ? input as Partial<MerchantAiVersion> : {};
  const fallbackTags = ["#乐生活", "#本地生活", `#${type || "商家发布"}`];
  const localFallback: PlatformPost = {
    title: asText(obj.title, "乐生活商家动态").slice(0, 40),
    body: asText(obj.body, rawText),
    tags: cleanTags(obj.tags, fallbackTags),
  };
  const platforms = obj.platforms && typeof obj.platforms === "object" ? obj.platforms as Record<string, unknown> : {};
  const local = normalizePost(platforms["乐生活"] || obj, localFallback);
  return {
    title: local.title,
    body: local.body,
    tags: local.tags,
    platforms: {
      "乐生活": local,
      "小红书": normalizePost(platforms["小红书"], local),
      "Instagram": normalizePost(platforms["Instagram"], local),
      "Facebook": normalizePost(platforms["Facebook"], local),
      "Google": normalizePost(platforms["Google"], local),
      "X": normalizePost(platforms["X"], local),
    },
  };
}

function parseJsonFromText(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return JSON");
    return JSON.parse(match[0]);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) return jsonResponse({ error: "OPENAI_API_KEY is not configured" }, 500);

  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return jsonResponse({ error: "Login required" }, 401);

  try {
    const payload = await req.json();
    const rawText = asText(payload.rawText);
    const type = asText(payload.type, "商家动态");
    const tone = asText(payload.tone, "自然");
    if (!rawText) return jsonResponse({ error: "Missing rawText" }, 400);

    const merchant = payload.merchant && typeof payload.merchant === "object" ? payload.merchant : {};
    const shopName = asText(merchant.business_name, "本地商家");
    const category = asText(merchant.category, "本地生活");
    const subcategory = asText(merchant.subcategory);
    const address = asText(merchant.address);
    const priorVersions = Array.isArray(payload.priorVersions) ? payload.priorVersions.slice(-3) : [];
    const imageCount = Array.isArray(payload.images) ? payload.images.length : 0;

    const systemPrompt = [
      "你是乐生活的商家内容编辑助手，服务洛杉矶华人本地生活社区。",
      "请根据商家输入素材生成真实可用的中文商家发布文案，并适配多个平台。",
      "重要限制：不要编造价格、库存、折扣比例、活动日期、地址、营业时间、排名、销量或任何商家没有提供的事实。",
      "如果素材里没有价格或折扣数字，不要主动添加。",
      "乐生活站内版本要自然、可信、适合本地社区信息流。",
      "小红书版本可以更种草，但不能夸大。",
      "Instagram 可以中英混合，但中文用户也要看得懂。",
      "Facebook 更像社区动态。",
      "Google 更像简短商家更新。",
      "X 要短。",
      "只返回 JSON，不要 Markdown，不要解释。",
    ].join("\n");

    const userPrompt = JSON.stringify({
      required_shape: {
        title: "站内标题，20字以内更好",
        body: "站内正文，2-4段",
        tags: ["#乐生活", "#本地生活"],
        platforms: {
          "乐生活": { title: "", body: "", tags: [] },
          "小红书": { title: "", body: "", tags: [] },
          "Instagram": { title: "", body: "", tags: [] },
          "Facebook": { title: "", body: "", tags: [] },
          "Google": { title: "", body: "", tags: [] },
          "X": { title: "", body: "", tags: [] },
        },
      },
      merchant: { shopName, category, subcategory, address },
      task: { type, tone, isRegenerate: !!payload.isRegen, regenCount: payload.regenCount || 0 },
      merchant_material: rawText,
      image_context: imageCount ? `商家上传了 ${imageCount} 张图片，可在文案里自然提到现场/新品/图片内容，但不能描述看不见的细节。` : "商家没有上传图片。",
      avoid_repeating: priorVersions,
    });

    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_output_tokens: 1800,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return jsonResponse({ error: result.error?.message || "OpenAI request failed" }, 502);
    }

    const outputText = result.output_text ||
      (Array.isArray(result.output) ? result.output.flatMap((item: any) => item.content || []).map((c: any) => c.text || "").join("\n") : "");
    const parsed = parseJsonFromText(outputText);
    const version = normalizeVersion(parsed, rawText, type);
    return jsonResponse({ version, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return jsonResponse({ error: message }, 500);
  }
});
