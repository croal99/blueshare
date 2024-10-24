import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {Button} from "flowbite-react";
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "@/provider/authProvider.tsx";
import LoginGoogle from "./loginGoogle.tsx";

const loginType = 2;

export default function LoginForm() {
    const navigate = useNavigate();
    const [parmas] = useSearchParams()
    const code = parmas.get('code')
    console.log('code', code, parmas)

    const {handleSignIn} = useAuth()


    useEffect(() => {
        if (parmas.get('type') === 'google') {
            handleSignIn(code).then(() => {
                navigate("/")
                // console.log('oath google')
            }).catch(err => {
                console.log('sign in error', err)
                navigate("/")
            })
        }

    }, []);

    if (loginType === 1) {
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