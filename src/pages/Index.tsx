import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieCarousel from "@/components/MovieCarousel";
import Footer from "@/components/Footer";
import { nowShowingMovies, upcomingMovies } from "@/data/movies";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner />
        <MovieCarousel
          title="Now Showing"
          subtitle="Book your tickets for the latest movies"
          movies={nowShowingMovies}
        />
        <MovieCarousel
          title="Coming Soon"
          subtitle="Mark your calendars for these upcoming releases"
          movies={upcomingMovies}
        />
        <MovieCarousel
          title="Recommended For You"
          subtitle="Based on your preferences"
          movies={[...nowShowingMovies].reverse()}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
