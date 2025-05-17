
import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card shadow-inner py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="h-6 w-6 text-secondary" />
            <span className="text-lg font-bold">MovieTix</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <a href="#" className="hover:text-secondary mb-2 md:mb-0">About Us</a>
            <a href="#" className="hover:text-secondary mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="hover:text-secondary mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="hover:text-secondary">Contact</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MovieTix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
