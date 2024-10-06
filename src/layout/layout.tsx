import TopBar from "./topbar.tsx";
import LeftBar from "./leftbar.tsx";
import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import {useAuth} from "@/provider/authProvider.tsx";
import {useEffect, useState} from "react";
import {IUserInfo} from "@/types/IUserInfo.ts";

export default function Layout() {
    const [profile, setProfile] = useState<IUserInfo>();
    const {getUserInfo, handleSignOut} = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo().then(res => {
            // console.log('userinfo', res)
            setProfile(res)
        }).catch(err => {
            console.log('error', err)
            navigate("/login", {replace: true});
        })
    }, [])

    return (
        <>
            <nav className="top-bar" aria-label="Topbar">
                <TopBar
                    profile={profile}
                />
            </nav>

            <aside className="side-bar" aria-label="Sidebar">
                <LeftBar/>
            </aside>

            <div className="p-4 sm:ml-64">
                <Outlet context={[profile]} />
            </div>
        </>
    )
}