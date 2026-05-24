import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require authenticated caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: userData, error: userError } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting movie availability update...");

    // Get all movies
    const { data: movies, error: fetchError } = await supabaseClient
      .from("movies")
      .select("*");

    if (fetchError) {
      throw fetchError;
    }

    let updatedCount = 0;

    for (const movie of movies || []) {
      // Check if movie should be marked as sold out (available_seats <= 0)
      if (movie.available_seats <= 0 && movie.availability === "available") {
        const { error: updateError } = await supabaseClient
          .from("movies")
          .update({ availability: "sold_out" })
          .eq("id", movie.id);

        if (!updateError) {
          updatedCount++;
          console.log(`Movie "${movie.title}" marked as sold out`);
        }
      }

      // Check if coming_soon movies should become available (release date passed)
      if (movie.availability === "coming_soon" && movie.release_date) {
        const releaseDate = new Date(movie.release_date);
        const today = new Date();
        
        if (releaseDate <= today) {
          const { error: updateError } = await supabaseClient
            .from("movies")
            .update({ availability: "available" })
            .eq("id", movie.id);

          if (!updateError) {
            updatedCount++;
            console.log(`Movie "${movie.title}" is now available`);
          }
        }
      }
    }

    console.log(`Movie availability update complete. Updated ${updatedCount} movies.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updatedCount} movies`,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating movie availability:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
