import {HiUsers, HiHome, HiLogout} from "react-icons/hi";
import {useAuth} from "../provider/authProvider.tsx";
import {Link, useNavigate} from "react-router-dom";

export default function LeftBar() {
    const {handleSignOut} = useAuth()
    const navigate = useNavigate();

    return (
        <>
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <div className="side-bar-item group">
                            <HiHome size="32" />

                            <Link to="/home" className="ms-3 w-full">Home</Link>
                        </div>
                    </li>

                    <li>
                        <div className="side-bar-item group">
                            <HiUsers size="32" />
                            <Link to="/profile" className="ms-3 w-full">User</Link>
                        </div>
                    </li>

                    <li>
                        <div className="side-bar-item group">
                            <HiLogout size="32" />

                            <Link to="/login"
                                className="ms-3 w-full"
                                onClick={async () => {
                                    await handleSignOut();
                                    // navigate("/login")
                                }}
                            >Sign out</Link>
                        </div>
                    </li>

                </ul>
            </div>
        </>
    )
}