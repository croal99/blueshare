import axios from "axios";
import toast from "react-hot-toast";

export const baseURL = "/api";

export const getBaseURL = () => {
    return baseURL;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const instance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

export class AppError extends Error {
    constructor(message: string | undefined, public code: any, error: any) {
        super(message);
        this.code = code;
        this.message = message;

        this.message +=
            error && !this.message.includes(error) ? ` (${error})` : "";
        this.stack = new Error().stack;
        toast.error(this.message)
    }
}

instance.interceptors.request.use(
    function (request: any) {
        const token = localStorage.getItem('token')

        if (token) {
            request.headers["Authorization"] = "Bearer " + token;
        }

        return request
    }
)

instance.interceptors.response.use(
    function (response: any) {
        response.rawData = response.data;
        response.data = response.data.data;

        if (
            response.rawData.code !== undefined &&
            response.rawData.code !== 0 &&
            response.rawData.code !== 200
        ) {
            // Login expired
            throw new AppError(
                response.rawData.message,
                response.rawData.code,
                response.rawData.error
            );
        }
        return response;
    },
    function (error) {
        // window.location.href = "/login";
        toast.error(error.message)

        return Promise.reject(error);
    }
);

export default instance;
