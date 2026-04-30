import { useNavigate } from "react-router-dom"

export default function ComingSoon() {
    const navigate = useNavigate()

    return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="text-6xl">🚧</div>
            <h1 className="text-3xl font-bold text-white">Page en cours de développement</h1>
            <p className="text-gray-400">
                Cette fonctionnalité sera disponible prochainement.
            </p>
            <button
                onClick={() => navigate(-1)}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
            >
                Retour
            </button>
        </div>
    )
}
