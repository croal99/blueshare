import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Api from "../utils/api.ts";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token', token);
        } else {
            // delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token')
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            setToken,
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const {token, setToken} = useContext(AuthContext)

    const handleSignIn = async (code: string) => {
        // await new Promise((r) => setTimeout(r, 500)); // fake delay
        const res = await Api.post("login", {
            type: "google",
            code,
        })

        setToken(res.rawData?.token)

        return true
    }

    const handleSignOut = async () => {
        setToken(false)
    }

    const getUserInfo = async () => {
        const res = await Api.get("user/profile")
        console.log('get user info', res)
        return
    }

    return {
        token,
        setToken,
        handleSignIn,
        handleSignOut,
        getUserInfo,
    };
};

export default AuthProvider;