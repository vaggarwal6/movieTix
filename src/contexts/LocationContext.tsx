
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  city: string;
}

type LocationContextType = {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  isLoading: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Sample location data
const MOCK_LOCATIONS = [
  { id: '1', name: 'Downtown Cinema', city: 'New York' },
  { id: '2', name: 'Westside Multiplex', city: 'New York' },
  { id: '3', name: 'Harbor View Cinema', city: 'San Francisco' },
  { id: '4', name: 'Sunset Boulevard Theater', city: 'Los Angeles' },
  { id: '5', name: 'Lakeside IMAX', city: 'Chicago' }
];

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations] = useState<Location[]>(MOCK_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if a location was previously selected
  useEffect(() => {
    const storedLocationId = localStorage.getItem('selectedLocationId');
    if (storedLocationId) {
      const foundLocation = locations.find(loc => loc.id === storedLocationId);
      if (foundLocation) {
        setSelectedLocation(foundLocation);
      }
    } else if (locations.length > 0) {
      // Default to first location if none selected
      setSelectedLocation(locations[0]);
    }
    setIsLoading(false);
  }, [locations]);

  // Save selected location to localStorage
  const handleSetLocation = (location: Location) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocationId', location.id);
  };

  return (
    <LocationContext.Provider value={{ 
      locations, 
      selectedLocation, 
      setSelectedLocation: handleSetLocation,
      isLoading 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
