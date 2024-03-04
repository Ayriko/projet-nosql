import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage.tsx';
import SignIn from "../components/SignIn.tsx";
import SignUp from "../components/SignUp.tsx";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    },
    {
        path: '/login',
        element: <SignIn />,
    },
    {
        path: '/register',
        element: <SignUp />,
    },
]);
export default Router;