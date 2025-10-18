import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FavouritesContext = createContext();

const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FAVOURITE':
      const newFavourite = {
        ...action.payload,
        id: `${action.payload.episodeId}-${Date.now()}`,
        addedAt: new Date().toISOString(),
      };
      return {
        ...state,
        favourites: [...state.favourites, newFavourite],
      };
    case 'REMOVE_FAVOURITE':
      return {
        ...state,
        favourites: state.favourites.filter(fav => fav.id !== action.payload),
      };
    case 'SET_FAVOURITES':
      return {
        ...state,
        favourites: action.payload,
      };
    case 'SET_SORT_ORDER':
      return {
        ...state,
        sortOrder: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  favourites: [],
  sortOrder: 'newest',
};

export const FavouritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favouritesReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const savedFavourites = localStorage.getItem('podcast-favourites');
    if (savedFavourites) {
      dispatch({ type: 'SET_FAVOURITES', payload: JSON.parse(savedFavourites) });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('podcast-favourites', JSON.stringify(state.favourites));
  }, [state.favourites]);

  const addFavourite = (episode) => {
    dispatch({ type: 'ADD_FAVOURITE', payload: episode });
  };

  const removeFavourite = (favouriteId) => {
    dispatch({ type: 'REMOVE_FAVOURITE', payload: favouriteId });
  };

  const isFavourite = (episodeId) => {
    return state.favourites.some(fav => fav.episodeId === episodeId);
  };

  const setSortOrder = (order) => {
    dispatch({ type: 'SET_SORT_ORDER', payload: order });
  };

  const getSortedFavourites = () => {
    const favourites = [...state.favourites];
    
    switch (state.sortOrder) {
      case 'title-asc':
        return favourites.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return favourites.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
        return favourites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case 'oldest':
        return favourites.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      default:
        return favourites;
    }
  };

  const value = {
    favourites: getSortedFavourites(),
    sortOrder: state.sortOrder,
    addFavourite,
    removeFavourite,
    isFavourite,
    setSortOrder,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};