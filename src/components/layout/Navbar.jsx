import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const NAV_LINKS = [
    { to: "/search", label: "Rechercher" },
    { to: "/my-rides", label: "Mes trajets" },
    { to: "/propose", label: "Proposer un trajet" },
    { to: "/soft-rides", label: "Mobilité douce" },
]

const ADMIN_LINKS = [
    { to: "/admin/users", label: "Utilisateurs" },
    { to: "/admin/bookings", label: "Réservations" },
    { to: "/admin/payments", label: "Paiements" },
    { to: "/admin/reclamations", label: "Réclamations" },
]

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)

    const isAdmin = user?.roles?.includes("ROLE_ADMIN")

    function handleLogout() {
        logout()
        navigate("/login")
    }

    function isActive(path) {
        return location.pathname === path
    }

    return (
        <nav className="relative z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

                {/* Logo */}
                <Link to="/landing" className="text-xl font-bold text-emerald-400 tracking-tight">
                    Eco<span className="text-white">Ride</span>
                </Link>

                {/* Liens desktop */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                isActive(to)
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Menu admin */}
                    {isAdmin && (
                        <div className="relative">
                            <button
                                onClick={() => setAdminOpen(!adminOpen)}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-white/10 transition flex items-center gap-1"
                            >
                                Admin
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {adminOpen && (
                                <div className="absolute top-full left-0 mt-1 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                    {ADMIN_LINKS.map(({ to, label }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            onClick={() => setAdminOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profil + déconnexion desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-semibold text-xs">
                            {user?.firstName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                        </div>
                        <span>{user?.firstName ?? user?.email}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Burger mobile */}
                <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* Menu mobile */}
            {menuOpen && (
                <div className="md:hidden bg-black/60 backdrop-blur-md border-t border-white/10 px-4 py-3 space-y-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                        >
                            {label}
                        </Link>
                    ))}
                    {isAdmin && ADMIN_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-white/10 transition"
                        >
                            Admin — {label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <Link to="/profile" className="text-sm text-gray-300">
                            {user?.firstName ?? user?.email}
                        </Link>
                        <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
