import {RouterProvider, createBrowserRouter, useNavigate, redirect} from "react-router-dom";
import {Button} from "flowbite-react";
import {useAuth} from "@/provider/authProvider";
import Layout from "@/layout/layout.tsx";
import LoginForm from "@components/login/loginForm.tsx";
import Home from "@components/home/home.tsx";
import UserProfile from "@components/home/userProfile.tsx";

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
                    index: true,
                    element: <div>User Home</div>,
                },
                {
                    path: "/home",
                    element: <Home />,
                },
                {
                    path: "/profile",
                    element: <UserProfile />,
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

