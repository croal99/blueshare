import {RouterProvider, createBrowserRouter, useNavigate, redirect} from "react-router-dom";
import {useAuth} from "../provider/authProvider";
import {ProtectedRoute} from "./ProtectedRoute";
import LoginGoogle from "../login/loginGoogle.tsx";
import LoginForm from "../login/loginForm.tsx";
import {Button} from "flowbite-react";
import Api from "../utils/api.ts";
// import Login from "../pages/Login";
// import Logout from "../pages/Logout";

const Routes = () => {
    const {token} = useAuth();

    // 路由配置
    const routesForPublic = [
        {
            path: "/service",
            element: <div>Service Page</div>,
        },
        {
            path: "/about-us",
            element: <div>About Us</div>,
        },
    ];

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute/>,
            children: [
                {
                    path: "/",
                    element: <TestForm/>,
                },
                {
                    path: "/profile",
                    element: <div>User Profile</div>,
                },
                // {
                //     path: "/logout",
                //     element: <Logout />,
                // },
            ],
        },
        // {
        //     path: "/login",
        //     element: <LoginForm/>,
        // },
    ];
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <LoginForm/>,
        },
        {
            path: "/login",
            element: <LoginForm/>,
        },
    ];

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router}/>;

};

function TestForm() {
    const { handleSignOut, getUserInfo} = useAuth();
    const navigate = useNavigate();

    const handleUserInfo = () => {
        getUserInfo().then()
    }

    return (
        <>
            <Button onClick={handleUserInfo}>UserInfo</Button>
            <Button
                onClick={async ()=>{
                    await handleSignOut();
                    navigate("/login")
                }}
            >
                SignOut
            </Button>
        </>
    )
}


export default Routes;

