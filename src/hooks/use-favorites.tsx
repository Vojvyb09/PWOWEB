
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface FavoritesContextType {
  favoriteScriptIds: string[];
  favoriteDepartmentIds: string[];
  toggleFavoriteScript: (id: string) => void;
  toggleFavoriteDepartment: (id: string) => void;
  removeFavoriteScript: (id: string) => void;
  removeFavoriteDepartment: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const useFavoritesState = () => {
  const [favoriteScriptIds, setFavoriteScriptIds] = useState<string[]>([]);
  const [favoriteDepartmentIds, setFavoriteDepartmentIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedScripts = localStorage.getItem('favoriteScripts');
      const storedDepartments = localStorage.getItem('favoriteDepartments');
      if (storedScripts) {
        setFavoriteScriptIds(JSON.parse(storedScripts));
      }
      if (storedDepartments) {
        setFavoriteDepartmentIds(JSON.parse(storedDepartments));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded){
      localStorage.setItem('favoriteScripts', JSON.stringify(favoriteScriptIds));
    }
  }, [favoriteScriptIds, isLoaded]);

  useEffect(() => {
    if(isLoaded){
      localStorage.setItem('favoriteDepartments', JSON.stringify(favoriteDepartmentIds));
    }
  }, [favoriteDepartmentIds, isLoaded]);

  const toggleFavorite = useCallback((id: string, favorites: string[], setFavorites: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }, []);

  const removeFavorite = useCallback((id: string, setFavorites: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  }, []);

  const toggleFavoriteScript = (id: string) => toggleFavorite(id, favoriteScriptIds, setFavoriteScriptIds);
  const toggleFavoriteDepartment = (id: string) => toggleFavorite(id, favoriteDepartmentIds, setFavoriteDepartmentIds);
  const removeFavoriteScript = (id: string) => removeFavorite(id, setFavoriteScriptIds);
  const removeFavoriteDepartment = (id: string) => removeFavorite(id, setFavoriteDepartmentIds);

  return { 
    favoriteScriptIds, 
    favoriteDepartmentIds, 
    toggleFavoriteScript, 
    toggleFavoriteDepartment,
    removeFavoriteScript,
    removeFavoriteDepartment,
  };
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const favoritesState = useFavoritesState();
  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
