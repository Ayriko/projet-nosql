import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage.tsx';
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import Profil from "../pages/Profil.tsx";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/profil',
        element: <Profil />,
    },
]);
export default Router;