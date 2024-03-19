import React, {
    createContext, type Dispatch, type SetStateAction, useContext, useState,
  } from 'react';
import SearchResult from '../models/searchResults';

  
  interface SearchBarContextProps {

    searchBarResult: SearchResult[];
    setSearchBarResult: Dispatch<SetStateAction<SearchResult[]>>;

  }
  
  const SearchBarContext = createContext<SearchBarContextProps | undefined>(undefined);
  
  function SearchBarProvider({ children }: { children: React.ReactNode }) {

    const [searchBarResult, setSearchBarResult] = useState<SearchResult[]>([]);
  
    return (
      <SearchBarContext.Provider value={{
        searchBarResult,
        setSearchBarResult,
      }}
      >
        {children}
      </SearchBarContext.Provider>
    );
  }
  
  const useSearchBarContext = () => {
    const context = useContext(SearchBarContext);
    if (!context) {
      throw new Error("useSearchBarContext doit être utilisé à l'intérieur de SearcbBarProvider");
    }
    return context;
  };
  
  export { SearchBarContext, useSearchBarContext, SearchBarProvider };
  