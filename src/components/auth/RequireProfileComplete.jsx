import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function isProfileComplete(user) {
    return !!(user?.firstName && user?.lastName && user?.dateOfBirth && user?.phoneNumber)
}

export default function RequireProfileComplete({ children }) {
    const { user } = useAuth()
    const location = useLocation()

    if (location.pathname === "/profile") return children

    if (!isProfileComplete(user)) {
        return <Navigate to="/profile" replace state={{ requireCompletion: true }} />
    }

    return children
}
