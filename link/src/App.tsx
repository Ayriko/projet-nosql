import './App.css';
import { RouterProvider } from 'react-router-dom';
import React from 'react';
import router from './config/Router';
import { SearchBarProvider } from './contexts/SearchBarContext';
import { UserProvider } from './contexts/UserContext';


function App(): React.JSX.Element {
    return (
        <UserProvider>
            <SearchBarProvider>
                <RouterProvider router={router} />
            </SearchBarProvider>
        </UserProvider>
    );
}

export default App;