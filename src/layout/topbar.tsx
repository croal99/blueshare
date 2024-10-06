import {Avatar, Button, Dropdown, Navbar} from "flowbite-react";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../provider/authProvider.tsx";
import {IUserInfo} from "../types/IUserInfo.ts";

export default function TopBar() {
    const [profile, setProfile] = useState<IUserInfo>();
    const {getUserInfo, handleSignOut} = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo().then(res => {
            // console.log('userinfo', res)
            setProfile(res)
        })
    }, [])

    return (
        <Navbar fluid className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <Navbar.Brand href="https://www.blueshare.xyz" className="gap-2">
                <svg width="32px" height="32px" viewBox="-92.16 -92.16 1208.32 1208.32" className="icon" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0">
                        <rect x="-92.16" y="-92.16" width="1208.32" height="1208.32" rx="604.16" fill="#ffffff"
                              strokeWidth="0"></rect>
                    </g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M877.387 523.945c-1.663 198.958-163.571 360.868-362.532 362.531-198.991 1.661-360.885-166.07-362.526-362.531-0.697-83.354-130.015-83.42-129.318 0 1.064 127.401 49.851 247.752 136.97 340.531 86.427 92.047 208.144 143.457 333.116 150.77 127.267 7.454 251.374-40.885 347.279-122.774 96.086-82.04 150.659-201.304 164.166-325.296 1.565-14.352 2.04-28.805 2.16-43.23 0.697-83.421-128.618-83.355-129.315-0.001z"
                            fill="#75f024"></path>
                        <path
                            d="M152.329 500.646c1.662-198.965 163.563-360.875 362.526-362.537 83.354-0.697 83.419-130.013 0-129.317-129.524 1.081-252.396 51.567-345.385 141.68C75.465 241.564 24.097 370.538 23.011 500.646c-0.697 83.421 128.62 83.349 129.318 0z"
                            fill="#C45FA0"></path>
                        <path
                            d="M400.998 617.112c-54.167-72.265-46.168-154.096 21.221-212.268 63.03-54.412 156.255-33.802 209.578 32.46 22.13 27.497 68.54 22.901 91.441 0 26.914-26.917 22.073-64.009 0-91.44-89.215-110.859-259.653-132.629-373.618-47.204-118.817 89.062-151.202 262.422-60.284 383.718 21.095 28.142 55.432 42.548 88.465 23.196 27.799-16.282 44.387-60.192 23.197-88.462z"
                            fill="#E5594F"></path>
                        <path
                            d="M628.723 433.281c30.673 40.924 38.604 71.548 34.179 119.265 0.715-5.845 0.408-4.79-0.924 3.173-1.3 6.769-3.259 13.386-5.207 19.983-4.113 13.896-2.982 9.9-9.75 22.736-11.978 22.716-23.474 34.203-45.271 51.746-27.499 22.131-22.904 68.538 0 91.441 26.914 26.913 64.011 22.075 91.439 0 110.85-89.224 132.613-259.649 47.193-373.614-21.092-28.142-55.431-42.546-88.466-23.196-27.799 16.287-44.384 60.193-23.193 88.466z"
                            fill="#F39A2B"></path>
                    </g>
                </svg>
                <span
                    className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
                >
                    Blue Share
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2 gap-2">
                <Dropdown
                    label={<Avatar alt="User settings" img={profile?.picture} rounded/>}
                    arrowIcon={false}
                    inline
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{profile?.name}</span>
                        <span className="block truncate text-sm font-medium">{profile?.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item
                        onClick={async () => {
                            await handleSignOut();
                            navigate("/login")
                        }}
                    >
                        Sign out
                    </Dropdown.Item>
                </Dropdown>

            </div>
        </Navbar>

    )
}