import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheaters } from "@/hooks/useTheaters";
import { Skeleton } from "@/components/ui/skeleton";

const TheatersList = () => {
  const { data: theaters, isLoading } = useTheaters();

  // Group theaters by city
  const theatersByCity = theaters?.reduce((acc, theater) => {
    const city = theater.city || 'Other';
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(theater);
    return acc;
  }, {} as Record<string, typeof theaters>);

  if (isLoading) {
    return (
      <section className="py-10 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Our Theaters</h2>
          <p className="text-muted-foreground mb-8">Find a cinema near you</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Our Theaters</h2>
        <p className="text-muted-foreground mb-8">Find a cinema near you</p>

        {theatersByCity && Object.entries(theatersByCity).map(([city, cityTheaters]) => (
          <div key={city} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">{city}</h3>
              <Badge variant="secondary" className="ml-2">
                {cityTheaters?.length} theaters
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityTheaters?.map((theater) => (
                <Card 
                  key={theater.id} 
                  className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{theater.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {theater.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-medium text-primary">4.5</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {theater.amenities?.map((amenity, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-secondary/50 border-border"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TheatersList;
