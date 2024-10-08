import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
    const { token } = useAuth();
    console.log('ProtectedRoute')

    // 判断用户是否有权限
    if (!token) {
        // 如果没有授权，则跳转到登录页面
        return <Link to="/login" />;
    }

    // 如果已经授权，则直接渲染子组件
    return <Outlet />;
};
