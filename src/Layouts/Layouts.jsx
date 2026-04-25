import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/contexts/AuthContext"

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return (
        <div className="background relative min-h-screen">
            {/* Image de fond */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/logo.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />

            {/* Navbar */}
            {user && (
                <div className="relative z-20 flex justify-end items-center px-6 py-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            )}

            {/* Contenu */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}