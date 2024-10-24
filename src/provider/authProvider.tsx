import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Api from "@/utils/api.ts";
import {IGoogleUserInfo, IUserInfo} from "@/types/IUserInfo.ts";

const AuthContext = createContext(null);

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

        // console.log('sign in', res, res.data, res.data?.token)
        setToken(res.rawData.token)

        return true
    }

    const handleSignOut = async () => {
        setToken(false)
    }

    const getUserInfo = async () => {
        const res = await Api.get("user/profile")
        // const googleUserInfo = res.data as IGoogleUserInfo;
        // const userInfo : IUserInfo = {
        //     id: googleUserInfo.id,
        //     name: googleUserInfo.name,
        //     nickname: googleUserInfo.given_name,
        //     email: googleUserInfo.email,
        //     picture: googleUserInfo.picture,
        // }
        // console.log('get user info', (res.data as IGoogleUserInfo))

        return res.data as IUserInfo;
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