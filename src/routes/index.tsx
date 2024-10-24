import {RouterProvider, createBrowserRouter, useNavigate, createHashRouter} from "react-router-dom";
import {useAuth} from "@/provider/authProvider";
import Layout from "@/layout/layout.tsx";
import LoginForm from "@components/login/loginForm.tsx";
import UserProfile from "@components/home/userProfile.tsx";
import Explorer from "@components/explorer/explorer.tsx";
import View, {loader as viewLoader} from "@/components/view/view.tsx";

const Routes = () => {
    const {token} = useAuth();

    // 路由配置
    const routesForPublic = [
        {
            path: "/",
            element: <LoginForm/>,
        },
        {
            path: "/login",
            element: <LoginForm/>,
        },
        {
            path: "/view/:handle/:id",
            element: <View/>,
            loader: viewLoader,
        },
    ];

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    index: true,
                    element: <Explorer/>,
                },
                {
                    path: "/home",
                    // element: <Home />,
                    element: <Explorer />,
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
    ];

    const router = createBrowserRouter([
    // const router = createHashRouter([
        ...routesForPublic,
        // ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router}/>;

};

export default Routes;

