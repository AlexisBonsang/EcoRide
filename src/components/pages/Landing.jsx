import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const CARDS = [
    {
        to: "/search",
        icon: "🔍",
        title: "Rechercher un trajet",
        description: "Trouvez un covoiturage près de chez vous.",
        color: "from-emerald-500/20 to-emerald-500/5",
        border: "border-emerald-500/30",
    },
    {
        to: "/propose",
        icon: "🚗",
        title: "Proposer un trajet",
        description: "Partagez votre voiture et réduisez vos frais.",
        color: "from-blue-500/20 to-blue-500/5",
        border: "border-blue-500/30",
    },
    {
        to: "/my-rides",
        icon: "📋",
        title: "Mes trajets",
        description: "Consultez vos réservations et trajets en cours.",
        color: "from-purple-500/20 to-purple-500/5",
        border: "border-purple-500/30",
    },
    {
        to: "/soft-rides",
        icon: "🛴",
        title: "Mobilité douce",
        description: "Louez un vélo ou une trottinette à proximité.",
        color: "from-orange-500/20 to-orange-500/5",
        border: "border-orange-500/30",
    },
    {
        to: "/profile",
        icon: "👤",
        title: "Mon profil",
        description: "Gérez vos informations et votre véhicule.",
        color: "from-pink-500/20 to-pink-500/5",
        border: "border-pink-500/30",
    },
    {
        to: "/subscriptions",
        icon: "⭐",
        title: "Abonnements",
        description: "Passez VIP ou devenez chauffeur partenaire.",
        color: "from-yellow-500/20 to-yellow-500/5",
        border: "border-yellow-500/30",
    },
]

export default function Landing() {
    const { user } = useAuth()

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

            {/* Message de bienvenue */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white">
                    Bonjour, {user?.firstName ?? user?.email} 👋
                </h1>
                <p className="text-gray-400">Que souhaitez-vous faire aujourd'hui ?</p>
            </div>

            {/* Grille de cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CARDS.map(({ to, icon, title, description, color, border }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`group rounded-2xl border ${border} bg-gradient-to-br ${color} p-5 hover:scale-[1.02] transition-transform duration-200 space-y-2`}
                    >
                        <div className="text-3xl">{icon}</div>
                        <h2 className="text-white font-semibold">{title}</h2>
                        <p className="text-sm text-gray-400">{description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
