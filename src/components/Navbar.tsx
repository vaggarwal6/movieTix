
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Film, MapPin, User, LogIn } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedLocation, locations, setSelectedLocation } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-secondary" />
            <Link to="/" className="text-xl font-bold">
              MovieTix
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/90 hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-foreground/90 hover:text-secondary transition-colors">
              Movies
            </Link>
          </nav>

          {/* Location Picker & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {selectedLocation && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedLocation.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {locations.map((location) => (
                    <DropdownMenuItem 
                      key={location.id}
                      onClick={() => setSelectedLocation(location)}
                      className={selectedLocation.id === location.id ? "bg-muted" : ""}
                    >
                      {location.name} - {location.city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-6 space-y-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-accent text-foreground/90"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block px-3 py-2 rounded-md hover:bg-accent text-foreground/90"
              onClick={toggleMenu}
            >
              Movies
            </Link>
            
            <div className="pt-2">
              {selectedLocation && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 w-full">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedLocation.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {locations.map((location) => (
                      <DropdownMenuItem 
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                      >
                        {location.name} - {location.city}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md hover:bg-accent text-foreground/90"
                    onClick={toggleMenu}
                  >
                    <User className="inline-block mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }} 
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/login" onClick={toggleMenu}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
