import './App.css';
import { RouterProvider } from 'react-router-dom';
import React from 'react';
import router from './config/Router';
import { SearchBarProvider } from './contexts/SearchBarContext';


function App(): React.JSX.Element {
    return (
        <SearchBarProvider>
            <RouterProvider router={router} />
        </SearchBarProvider>
    );
}

export default App;