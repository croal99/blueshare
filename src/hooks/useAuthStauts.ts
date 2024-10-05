import Api from "../utils/api.ts";

interface IAuthProvider {
    isAuthenticated: boolean;
    username: null | string;
    signin(username, password: string): Promise<boolean>;
    signinGoogle(code: string): Promise<boolean>;
    signout(): Promise<void>;
}

const KEY_USER = "user";

export const apiAuthProvider: IAuthProvider = {
    isAuthenticated: false,
    username: null,

    async signin(username: string, password: string) {
        // await new Promise((r) => setTimeout(r, 500)); // fake delay
        return false
    },

    async signinGoogle(code: string) {
        // await new Promise((r) => setTimeout(r, 500)); // fake delay
        const res = await Api.post("login", {
            type: "google",
            code,
        })
        // console.log('login google', res)


        return false
    },

    async signout() {
        // await new Promise((r) => setTimeout(r, 500)); // fake delay
        apiAuthProvider.isAuthenticated = false;
        apiAuthProvider.username = "";
    },
};

