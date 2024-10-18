import {createRoot} from 'react-dom/client'
import AuthProvider from "@/provider/authProvider.tsx";
import Routes from "@/routes";
import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import './index.css'

createRoot(document.getElementById('root')!).render(
    <Theme
        appearance="light"
        accentColor="amber"
        panelBackground="solid"
        scaling="100%"
        radius="full"
    >
        <AuthProvider>
            <Routes />
        </AuthProvider>
    </Theme>
)
