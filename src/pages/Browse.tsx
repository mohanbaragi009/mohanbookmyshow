import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCardDB from "@/components/MovieCardDB";
import { useMovies } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Browse = () => {
  const [params] = useSearchParams();
  const genre = params.get("genre")?.toLowerCase() ?? "";
  const language = params.get("language")?.toLowerCase() ?? "";
  const q = params.get("q")?.toLowerCase().trim() ?? "";

  const { data: movies, isLoading } = useMovies();

  const filtered = useMemo(() => {
    const list = movies ?? [];
    return list.filter((m) => {
      if (genre && !(m.genre || []).some((g) => g.toLowerCase() === genre))
        return false;
      if (language && (m.language || "").toLowerCase() !== language)
        return false;
      if (q) {
        const hay = `${m.title} ${(m.genre || []).join(" ")} ${m.language ?? ""} ${m.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [movies, genre, language, q]);

  const heading = q
    ? `Search results for "${params.get("q")}"`
    : genre
    ? `${params.get("genre")} Movies`
    : language
    ? `${params.get("language")} Movies`
    : "All Movies";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading…" : `${filtered.length} movie${filtered.length === 1 ? "" : "s"} found`}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">← Back to home</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No movies found for your selection.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/">Browse all movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((m) => (
              <MovieCardDB key={m.id} movie={m} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
