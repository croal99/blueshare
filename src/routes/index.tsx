import {RouterProvider, createBrowserRouter, useNavigate, redirect} from "react-router-dom";
import {useAuth} from "../provider/authProvider";
import {ProtectedRoute} from "./ProtectedRoute";
import LoginForm from "../login/loginForm.tsx";
import {Button} from "flowbite-react";
import Layout from "../layout/layout.tsx";

const Routes = () => {
    const {token} = useAuth();

    // 路由配置
    const routesForPublic = [
        {
            path: "/login",
            element: <LoginForm/>,
        },
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
            element: <Layout/>,
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

