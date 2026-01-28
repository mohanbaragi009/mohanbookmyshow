import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Featured Movie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl space-y-4 sm:space-y-6 animate-slide-in">
          {/* Badge */}
          <Badge variant="default" className="bg-primary/90">
            Featured Today
          </Badge>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Inception
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
              <span className="font-semibold text-foreground">8.8/10</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>2h 28m</span>
            <span>•</span>
            <span>Action, Sci-Fi, Thriller</span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-none">
            A thief who steals corporate secrets through the use of dream-sharing 
            technology is given the inverse task of planting an idea into the mind 
            of a C.E.O.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Book Tickets
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
