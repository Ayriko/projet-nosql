import React, {
    createContext, type Dispatch, type SetStateAction, useContext, useState, useEffect,
  } from 'react';
import UserType from '../models/user';

  
  interface UserContextProps {
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
  }
  
  const UserContext = createContext<UserContextProps | undefined>(undefined);
  
  function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<UserType>({} as UserType);
    useEffect(() => {
        
    }, []);

  
    return (
      <UserContext.Provider value={{
        user,
        setUser,
      }}
      >
        {children}
      </UserContext.Provider>
    );
  }
  
  const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUserContext doit être utilisé à l'intérieur de UserProvider");
    }
    return context;
  };
  
  export { UserContext, useUserContext, UserProvider };
  