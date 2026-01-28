import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { useMovies } from '@/hooks/useMovies';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  confirmed: 'bg-blue-500/20 text-blue-500',
  paid: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: movies } = useMovies();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  const getMovieById = (movieId: string) => {
    return movies?.find((m) => m.id === movieId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your movie bookings</p>
          </div>
        </div>

        {bookingsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const movie = getMovieById(booking.movie_id);
              return (
                <div
                  key={booking.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex">
                    {movie && (
                      <img
                        src={movie.poster_url || ''}
                        alt={movie.title}
                        className="w-24 h-36 object-cover"
                      />
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {movie?.title || 'Unknown Movie'}
                        </h3>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(booking.show_date), 'EEE, MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{booking.show_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="h-3 w-3" />
                          <span>{booking.seats} seat(s)</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="font-semibold text-primary">
                          ₹{booking.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Ticket className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring movies and book your first ticket!
            </p>
            <Button asChild>
              <Link to="/">Browse Movies</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
