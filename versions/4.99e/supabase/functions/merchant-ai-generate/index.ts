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
  xhs_titles?: string[];
  platforms: Record<string, PlatformPost>;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function asText(value: unknown, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function cleanTags(tags: unknown, fallback: string[]) {
  const input = Array.isArray(tags) ? tags : fallback;
  return input
    .map((tag) => asText(tag))
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .slice(0, 8);
}

function normalizePost(input: unknown, fallback: PlatformPost, maxTitleLength = 40): PlatformPost {
  const obj = input && typeof input === "object" ? input as Partial<PlatformPost> : {};
  return {
    title: asText(obj.title, fallback.title).slice(0, maxTitleLength),
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
  const xhsTitles = Array.isArray((obj as Record<string, unknown>).xhs_titles)
    ? ((obj as Record<string, unknown>).xhs_titles as unknown[]).map((item) => asText(item)).filter(Boolean).slice(0, 5)
    : [];
  const xhs = normalizePost(platforms["小红书"], local);
  const sharedLocal = (xhs.body && xhs.body.length >= local.body.length) ? xhs : local;
  const english = normalizePost(platforms["English"], {
    title: "",
    body: "",
    tags: ["#ScoopCity", "#LocalBusiness"],
  }, 80);
  return {
    title: sharedLocal.title,
    body: sharedLocal.body,
    tags: sharedLocal.tags,
    xhs_titles: xhsTitles,
    platforms: {
      "乐生活": sharedLocal,
      "小红书": sharedLocal,
      "Instagram": sharedLocal,
      "Facebook": sharedLocal,
      "Google": sharedLocal,
      "X": sharedLocal,
      "English": english,
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

function similarityText(value: string) {
  return value.replace(/\s+/g, "").replace(/[，。！？、,.!?~～#]/g, "");
}

function hasCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function isLowQualityVersion(version: MerchantAiVersion, rawText: string) {
  const raw = similarityText(rawText);
  const xhs = version.platforms["小红书"];
  const body = similarityText(xhs?.body || version.body || "");
  const hasTitles = Array.isArray(version.xhs_titles) && version.xhs_titles.length >= 3;
  const hasUsefulXhs = body.length >= Math.max(80, raw.length + 24);
  const isTooClose = raw.length > 12 && body.includes(raw);
  return !hasTitles || !hasUsefulXhs || isTooClose;
}

function isLowQualityEnglish(post: PlatformPost) {
  return !post?.body || post.body.length < 80 || hasCjk(post.body);
}

function sanitizeEnglishBrand(post: PlatformPost) {
  const replacements: [RegExp, string][] = [
    [/\bLe\s+Life\s+Dessert\s+Shop\b/gi, "Scoop City Dessert Shop"],
    [/\bLe\s+Life\b/gi, "Scoop City"],
    [/\bLe\s+Shijie\s+Dessert\s+Shop\b/gi, "Scoop City Dessert Shop"],
    [/\bLe\s+Shijie\b/gi, "Scoop City"],
    [/\bLeshenghuo\s+Dessert\s+Shop\b/gi, "Scoop City Dessert Shop"],
    [/\bLeshenghuo\b/gi, "Scoop City"],
  ];
  const apply = (value: string) => replacements.reduce((text, [pattern, next]) => text.replace(pattern, next), value || "");
  return {
    title: apply(post.title),
    body: apply(post.body),
    tags: cleanTags(post.tags, ["#ScoopCity", "#LocalBusiness"]).map((tag) => tag.replace(/#Leshenghuo/gi, "#ScoopCity")),
  };
}

async function callOpenAiJson(openaiKey: string, model: string, systemPrompt: string, userPrompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 2600,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "OpenAI request failed");
  }
  return result.choices?.[0]?.message?.content || "";
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
      "你同时是一名深耕小红书运营 5 年的资深内容编辑，非常熟悉小红书爆款逻辑。",
      "请根据商家输入素材生成真实可用的中文商家发布文案，并额外提供一个英文版本。",
      "重要限制：不要编造价格、库存、折扣比例、活动日期、地址、营业时间、排名、销量或任何商家没有提供的事实。",
      "如果素材里没有价格或折扣数字，不要主动添加。",
      "先写一篇高质量小红书种草主稿。乐生活站内版本和其他中文平台版本暂时全部使用同一篇主稿，不需要分别改写。",
      "小红书版本要使用爆款笔记逻辑：标题有情绪词、数字、痛点或好奇点；正文前三行要有钩子；结构为痛点引入、具体步骤或推荐理由、互动引导。",
      "小红书版本还要符合种草笔记结构：标题必须有数字和情绪词；正文开头用故事、痛点或反常识切入；中间 3-4 段，每段一个卖点；结尾用选择题式问题引导互动。",
      "小红书语气要口语化、像朋友分享，避免 AI 味、说教、空洞排比。",
      "小红书每段不要超过 3 行，整体像朋友聊天，不要像品牌通稿。",
      "小红书正文每段可以自然加入 emoji，但不要堆砌。适当使用：新手必看、小白避坑、千万别踩雷、手残党、绝绝子、天花板、后悔没早知道、保姆级、真实测评、干货满满、建议收藏、马住、评论区告诉我。",
      "不要简单复述商家原文。必须在不编造事实的前提下，把原始素材改写成更完整、更有点击欲望、更像真人分享的内容。",
      "如果素材较短，可以围绕已提供事实扩展消费场景、适合人群、到店体验建议和收藏理由，但不能虚构价格、限时、销量或未提供的活动细节。",
      "Instagram、Facebook、Google、X 暂时不要单独改写，直接使用同一篇中文主稿。",
      "另外必须生成 English 版本，语气自然、适合英文社交平台复制发布，不要编造中文素材里没有的事实。",
      "所有平台都要保留商家提供的真实信息边界，不能为了爆款而夸大。",
      "只返回合法 JSON 对象，不要 Markdown，不要解释。",
    ].join("\n");

    const userPrompt = JSON.stringify({
      required_shape: {
        title: "使用小红书主稿标题，20-32字",
        body: "使用小红书主稿正文，不要照抄商家原文",
        tags: ["#乐生活", "#本地生活", "#根据行业生成SEO词"],
        xhs_titles: [
          "必须提供5个小红书二极管标题，带emoji",
          "每个标题包含情绪词/数字/痛点/好奇点之一",
        ],
        platforms: {
          "乐生活": { title: "可与小红书标题相同", body: "可与小红书正文相同或轻微去平台化", tags: [] },
          "小红书": {
            title: "从 xhs_titles 中选择最适合的一个",
            body: "开头用故事/痛点/反常识切入 + 中间3-4段每段一个卖点 + 结尾选择题式互动；每段不超过3行并自然加入emoji",
            tags: ["#核心SEO词"],
          },
          "Instagram": { title: "同小红书", body: "同小红书", tags: [] },
          "Facebook": { title: "同小红书", body: "同小红书", tags: [] },
          "Google": { title: "同小红书", body: "同小红书", tags: [] },
          "X": { title: "同小红书", body: "同小红书", tags: [] },
          "English": { title: "English title", body: "Natural English version based only on provided facts", tags: ["#localbusiness"] },
        },
      },
      merchant: { shopName, category, subcategory, address },
      task: { type, tone, isRegenerate: !!payload.isRegen, regenCount: payload.regenCount || 0 },
      merchant_material: rawText,
      xiaohongshu_keyword_bank: {
        pain_words: ["新手必看", "小白避坑", "千万别踩雷", "手残党", "干皮救星", "太费钱了", "熬夜克星"],
        emotion_words: ["绝绝子", "天花板", "直接封神", "太好用了", "后悔没早知道", "神仙单品"],
        number_words: ["1分钟学会", "0成本", "3个小妙招", "Top1", "保姆级", "真实测评", "干货满满"],
        interaction_words: ["建议收藏", "马住", "点赞", "评论区告诉我", "你们遇到过吗", "出续集请扣1"],
      },
      image_context: imageCount ? `商家上传了 ${imageCount} 张图片，可在文案里自然提到现场/新品/图片内容，但不能描述看不见的细节。` : "商家没有上传图片。",
      avoid_repeating: priorVersions,
      quality_rules: [
        "不要返回和 merchant_material 几乎一样的正文。",
        "小红书正文要像朋友安利，不要像广告公告。",
        "小红书标题必须包含数字和情绪词。",
        "小红书开头必须是故事、痛点或反常识切入。",
        "小红书结尾必须问一个选择题式问题来引导评论。",
        "标题要有点击欲望，但不能标题党夸大。",
        "标签根据行业和内容生成 3-6 个 SEO 关键词。",
      ],
    });

    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    let outputText = await callOpenAiJson(openaiKey, model, systemPrompt, userPrompt);
    let parsed = parseJsonFromText(outputText);
    let version = normalizeVersion(parsed, rawText, type);
    if (isLowQualityVersion(version, rawText)) {
      const repairPrompt = JSON.stringify({
        instruction: "上一次结果质量不合格：小红书标题为空、正文太短，或只是复述商家原文。请重写，必须明显改写并满足爆款结构。",
        must: [
          "xhs_titles 必须有 5 个标题，每个带 emoji。",
          "小红书 body 至少 4 段，每段自然带 emoji。",
          "小红书标题必须有数字和情绪词。",
          "小红书开头必须用故事、痛点或反常识切入。",
          "小红书中间 3-4 段，每段一个卖点，每段不超过 3 行。",
          "小红书结尾必须用选择题式问题引导互动。",
          "小红书 body 不能照抄 merchant_material。",
          "English 平台必须是真正英文，不要出现中文汉字。",
          "English body 至少 80 个英文字符，基于中文素材自然翻译和改写。",
          "乐生活版本要自然可信。",
          "仍然不能编造价格、库存、折扣、日期、销量等事实。",
        ],
        merchant: { shopName, category, subcategory, address },
        task: { type, tone, isRegenerate: !!payload.isRegen, regenCount: payload.regenCount || 0 },
        merchant_material: rawText,
        output_shape: "返回同样 JSON 结构：title, body, tags, xhs_titles, platforms",
      });
      outputText = await callOpenAiJson(openaiKey, model, systemPrompt, repairPrompt);
      parsed = parseJsonFromText(outputText);
      version = normalizeVersion(parsed, rawText, type);
    }
    if (isLowQualityVersion(version, rawText)) {
      return jsonResponse({ error: "AI 输出质量不足，请补充更多素材后再试" }, 502);
    }
    if (isLowQualityEnglish(version.platforms["English"])) {
      const englishPrompt = JSON.stringify({
        instruction: "Translate the Chinese social post into natural English for local social platforms. Return JSON only.",
        rules: [
          "Translate from the Chinese post directly. Do not add new selling points.",
          "Use only facts from the Chinese post and merchant material.",
          "Translate 乐生活 as Scoop City. Do not use Leshenghuo.",
          "Do not invent price, discount, inventory, date, hours, ranking, or sales volume.",
          "Keep it friendly and concise.",
          "No Chinese characters in title, body, or tags.",
        ],
        merchant: { shopName, category, subcategory, address },
        chinese_post: version.platforms["乐生活"],
        merchant_material: rawText,
        required_shape: { title: "English title", body: "English body", tags: ["#ScoopCity", "#LocalBusiness"] },
      });
      const englishText = await callOpenAiJson(openaiKey, model, "You write natural English social posts for local businesses. Return legal JSON only.", englishPrompt);
      const englishParsed = parseJsonFromText(englishText);
      const englishPost = sanitizeEnglishBrand(normalizePost(englishParsed, { title: "", body: "", tags: ["#ScoopCity", "#LocalBusiness"] }, 80));
      if (!isLowQualityEnglish(englishPost)) {
        version.platforms["English"] = englishPost;
      }
    }
    version.platforms["English"] = sanitizeEnglishBrand(version.platforms["English"]);
    if (isLowQualityEnglish(version.platforms["English"])) {
      return jsonResponse({ error: "英文版本生成质量不足，请稍后重试" }, 502);
    }
    return jsonResponse({ version, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return jsonResponse({ error: message }, 500);
  }
});
