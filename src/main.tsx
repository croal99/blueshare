import {createRoot} from 'react-dom/client'
import AuthProvider from "@/provider/authProvider.tsx";
import Routes from "@/routes";
import {Theme} from "@radix-ui/themes";

import {PetraWallet} from "petra-plugin-wallet-adapter";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";

import "@radix-ui/themes/styles.css";
import './index.css'

const wallets = [new PetraWallet()];

createRoot(document.getElementById('root')!).render(
    <Theme
        appearance="light"
        accentColor="amber"
        panelBackground="solid"
        scaling="100%"
        radius="full"
    >
        <AuthProvider>
            <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
                <Routes/>
            </AptosWalletAdapterProvider>
        </AuthProvider>
    </Theme>
)
