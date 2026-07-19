import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, prefer",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type GoogleResult = {
  formatted_address?: string;
  place_id?: string;
  types?: string[];
  geometry?: { location?: { lat?: number; lng?: number } };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!googleKey) return jsonResponse({ error: "Google Maps address service is not configured" }, 503);

  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return jsonResponse({ error: "Login required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  if (!supabaseUrl || !supabaseKey) return jsonResponse({ error: "Supabase environment is not configured" }, 500);

  const client = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.slice("Bearer ".length);
  const { data: userData, error: userError } = await client.auth.getUser(token);
  const user = userData.user;
  if (userError || !user) return jsonResponse({ error: "Login expired, please sign in again" }, 401);

  try {
    const body = await req.json();
    const address = String(body?.address || "").trim();
    if (address.length < 5) return jsonResponse({ error: "Please enter a complete address" }, 400);
    if (address.length > 240) return jsonResponse({ error: "Address is too long" }, 400);

    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", address);
    url.searchParams.set("region", "us");
    url.searchParams.set("language", "en");
    url.searchParams.set("key", googleKey);
    const response = await fetch(url);
    const result = await response.json();
    const status = String(result?.status || "UNKNOWN_ERROR");

    if (!response.ok || status === "OVER_QUERY_LIMIT") {
      return jsonResponse({ error: "Address lookup is temporarily busy, please try again later" }, 429);
    }
    if (status === "ZERO_RESULTS") return jsonResponse({ results: [] });
    if (status !== "OK") {
      console.warn("Google geocoding failed", status, result?.error_message || "");
      return jsonResponse({ error: "Address lookup failed, please check the address and try again" }, 502);
    }

    const results = (Array.isArray(result.results) ? result.results : [])
      .map((item: GoogleResult) => {
        const latitude = Number(item.geometry?.location?.lat);
        const longitude = Number(item.geometry?.location?.lng);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        return {
          formatted_address: String(item.formatted_address || ""),
          place_id: String(item.place_id || ""),
          types: Array.isArray(item.types) ? item.types.slice(0, 4) : [],
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    return jsonResponse({ results });
  } catch (error) {
    console.error("merchant-geocode error", error);
    return jsonResponse({ error: "Address lookup failed, please try again" }, 500);
  }
});
