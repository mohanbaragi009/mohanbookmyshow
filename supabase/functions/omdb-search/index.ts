import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OMDB_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OMDB_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const id = (url.searchParams.get("i") || "").trim();
    const type = (url.searchParams.get("type") || "movie").trim();
    const page = (url.searchParams.get("page") || "1").trim();

    if (!q && !id) {
      return new Response(JSON.stringify({ error: "Provide q or i" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const omdb = new URL("https://www.omdbapi.com/");
    omdb.searchParams.set("apikey", apiKey);
    if (id) {
      omdb.searchParams.set("i", id);
      omdb.searchParams.set("plot", "short");
    } else {
      omdb.searchParams.set("s", q);
      omdb.searchParams.set("type", type);
      omdb.searchParams.set("page", page);
    }

    const res = await fetch(omdb.toString());
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("omdb-search error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
