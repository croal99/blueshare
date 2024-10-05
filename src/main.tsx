import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LayoutForm1 from "./example/layoutForm1.tsx";
import LayoutForm2 from "./example/layoutForm2.tsx";
import LoginForm from "./login/loginForm.tsx";
import {
    createBrowserRouter, redirect,
    RouterProvider,
} from "react-router-dom";
import DropMenu from "./example/dropmenu.tsx";
import LayoutForm3 from "./example/layoutForm3.tsx";
import FlexForm1 from "./example/flexForm1.tsx";
import Layout from "./layout/layout.tsx";
import LoginGoogle from "./login/loginGoogle.tsx";
import AuthProvider from "./provider/authProvider.tsx";
import Routes from "./routes";


createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <AuthProvider>
            <Routes />
        </AuthProvider>
    // </StrictMode>,
)
