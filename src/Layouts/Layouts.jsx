import { useAuth } from "../components/contexts/AuthContext"
import Navbar from "../components/layout/Navbar"

export default function Layout({ children }) {
    const { user } = useAuth()

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
            {user && <Navbar />}

            {/* Contenu */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}