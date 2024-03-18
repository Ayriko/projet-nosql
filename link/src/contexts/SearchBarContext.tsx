import React, {
    createContext, type Dispatch, type SetStateAction, useContext, useState,
  } from 'react';

  
  interface SearchBarContextProps {

    searchBarResult: string[];
    setSearchBarResult: Dispatch<SetStateAction<string[]>>;

  }
  
  const SearchBarContext = createContext<SearchBarContextProps | undefined>(undefined);
  
  function SearchBarProvider({ children }: { children: React.ReactNode }) {

    const [searchBarResult, setSearchBarResult] = useState<string[]>([]);
  
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
  