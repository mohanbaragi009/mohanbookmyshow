import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useMovies } from "@/hooks/useMovies";

const DEFAULT_GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Thriller"];
const DEFAULT_LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada"];

const Footer = () => {
  const { data: movies } = useMovies();

  const { genres, languages } = useMemo(() => {
    const list = movies ?? [];
    const g = new Set<string>();
    const l = new Set<string>();
    list.forEach((m) => {
      (m.genre || []).forEach((x) => x && g.add(x));
      if (m.language) l.add(m.language);
    });
    DEFAULT_GENRES.forEach((x) => g.add(x));
    DEFAULT_LANGUAGES.forEach((x) => l.add(x));
    return {
      genres: Array.from(g).sort().slice(0, 8),
      languages: Array.from(l).sort().slice(0, 8),
    };
  }, [movies]);

  return (
    <footer className="bg-secondary/50 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Movies By Genre</h4>
            <ul className="space-y-2">
              {genres.map((g) => (
                <li key={g}>
                  <Link
                    to={`/browse?genre=${encodeURIComponent(g)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Movies By Language</h4>
            <ul className="space-y-2">
              {languages.map((l) => (
                <li key={l}>
                  <Link
                    to={`/browse?language=${encodeURIComponent(l)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Help</h4>
            <ul className="space-y-2">
              {["About Us", "Contact Us", "FAQs", "Terms & Conditions", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/mohanreddy_009/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-foreground">MohanBookMyShow</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2024 MohanBookMyShow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
