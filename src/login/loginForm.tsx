import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "@/provider/authProvider.tsx";
import {useEffect} from "react";
import LoginUser from "./loginUser.tsx";
import LoginGoogle from "./loginGoogle.tsx";
import {apiAuthProvider} from "../hooks/useAuthStauts.ts";
import {Button} from "flowbite-react";
import toast, {Toaster} from "react-hot-toast";

const loginType = 1;

export default function LoginForm() {
    const navigate = useNavigate();
    const [parmas] = useSearchParams()
    const code = parmas.get('code')

    const {handleSignIn} = useAuth()


    useEffect(() => {
        if (parmas.get('type') === 'google') {
            handleSignIn(code).then(() => {
                navigate("/")
                // console.log('oath google')
            })
        }

    }, []);

    if (loginType === 10) {
        return (
            <>
                <Toaster/>

                <Button
                    onClick={() => {
                        handleSignIn(code).then(res => {
                            // navigate("/")
                            console.log('oath google', res)
                        }).catch(err => {
                            // console.log(err)
                        })
                    }}
                >
                    Sign In
                </Button>
            </>
        )
    }

    return (
        <>
            <Toaster/>
            <LoginGoogle
                code={code}
            />
        </>
    )

}