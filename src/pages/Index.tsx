import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieCarouselDB from "@/components/MovieCarouselDB";
import Footer from "@/components/Footer";
import { useNowShowingMovies, useUpcomingMovies } from "@/hooks/useMovies";

const Index = () => {
  const { data: nowShowingMovies, isLoading: nowShowingLoading } = useNowShowingMovies();
  const { data: upcomingMovies, isLoading: upcomingLoading } = useUpcomingMovies();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner />
        <MovieCarouselDB
          title="Now Showing"
          subtitle="Book your tickets for the latest movies"
          movies={nowShowingMovies || []}
          isLoading={nowShowingLoading}
        />
        <MovieCarouselDB
          title="Coming Soon"
          subtitle="Mark your calendars for these upcoming releases"
          movies={upcomingMovies || []}
          isLoading={upcomingLoading}
          showBookButton={false}
        />
        <MovieCarouselDB
          title="Recommended For You"
          subtitle="Based on your preferences"
          movies={[...(nowShowingMovies || [])].reverse()}
          isLoading={nowShowingLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
