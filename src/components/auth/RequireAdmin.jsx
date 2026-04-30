import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function RequireAdmin({ children }) {
    const { user } = useAuth()
    if (!user?.roles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/landing" replace />
    }
    return children
}
