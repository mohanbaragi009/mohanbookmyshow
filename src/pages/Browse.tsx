import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCardDB from "@/components/MovieCardDB";
import { useMovies } from "@/hooks/useMovies";
import { useOmdb } from "@/hooks/useOmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Browse = () => {
  const [params] = useSearchParams();
  const genre = params.get("genre")?.toLowerCase() ?? "";
  const language = params.get("language")?.toLowerCase() ?? "";
  const rawQ = params.get("q")?.trim() ?? "";
  const q = rawQ.toLowerCase();

  const { data: movies, isLoading } = useMovies();
  const { data: omdb, isLoading: omdbLoading, error: omdbError } = useOmdb(rawQ);

  const filtered = useMemo(() => {
    const list = movies ?? [];
    return list.filter((m) => {
      if (genre && !(m.genre || []).some((g) => g.toLowerCase() === genre)) return false;
      if (language && (m.language || "").toLowerCase() !== language) return false;
      if (q) {
        const hay = `${m.title} ${(m.genre || []).join(" ")} ${m.language ?? ""} ${m.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [movies, genre, language, q]);

  const heading = rawQ
    ? `Search results for "${rawQ}"`
    : genre
    ? `${params.get("genre")} Movies`
    : language
    ? `${params.get("language")} Movies`
    : "All Movies";

  const omdbResults = omdb?.Search ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading…" : `${filtered.length} match${filtered.length === 1 ? "" : "es"} in our catalog`}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">← Back to home</Link>
          </Button>
        </div>

        {/* Local catalog results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-secondary/30 rounded-xl">
            <p className="text-muted-foreground">No matches in our catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((m) => (
              <MovieCardDB key={m.id} movie={m} />
            ))}
          </div>
        )}

        {/* OMDB live results — only when searching */}
        {rawQ && (
          <section className="mt-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">From IMDb (Live)</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Real-time movie data powered by OMDb
              </p>
            </div>

            {omdbLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
                ))}
              </div>
            ) : omdbError ? (
              <p className="text-destructive text-sm">Could not load live results.</p>
            ) : omdb?.Response === "False" || omdbResults.length === 0 ? (
              <p className="text-muted-foreground text-sm">No live results found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {omdbResults.map((item) => (
                  <a
                    key={item.imdbID}
                    href={`https://www.imdb.com/title/${item.imdbID}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary transition-colors"
                  >
                    <div className="aspect-[2/3] bg-secondary overflow-hidden">
                      {item.Poster && item.Poster !== "N/A" ? (
                        <img
                          src={item.Poster}
                          alt={item.Title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No poster
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                        {item.Title}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span>{item.Year}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          IMDb
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
