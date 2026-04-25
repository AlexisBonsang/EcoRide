import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function OAuthCallback() {
    const navigate = useNavigate()
    const { setAuth } = useAuth()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        const refreshToken = params.get("refresh_token")

        if (!token) {
            navigate("/login")
            return
        }

        fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((user) => {
                setAuth(user, token, refreshToken)
                navigate("/landing")
            })
            .catch(() => navigate("/login"))
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-white">Connexion en cours…</p>
        </div>
    )
}

export default OAuthCallback
