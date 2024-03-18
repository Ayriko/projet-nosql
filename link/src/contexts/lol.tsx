import React, {
    createContext, type Dispatch, type SetStateAction, useContext, useState,
  } from 'react';

  
  interface SearchBarContextProps {

    players: string[];
    setPlayers: Dispatch<SetStateAction<string[]>>;

  }
  
  const SearchBarContext = createContext<SearchBarContextProps | undefined>(undefined);
  
  function SearchBarProvider({ children }: { children: React.ReactNode }) {

    const [players, setPlayers] = useState<string[]>([]);

  
    return (
      <SearchBarContext.Provider value={{
        players,
        setPlayers,
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
  