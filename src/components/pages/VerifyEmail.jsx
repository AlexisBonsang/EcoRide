import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function VerifyEmail() {
    const { token } = useParams()
    const { user, token: authToken, setUserData } = useAuth()
    const [status, setStatus] = useState("loading")

    useEffect(() => {
        fetch(`http://localhost:8000/auth/email/verify/${token}`)
            .then(async res => {
                if (res.ok) {
                    // Rafraîchir les données user si connecté
                    if (authToken) {
                        const userRes = await fetch("http://localhost:8000/api/users/me", {
                            headers: { Authorization: `Bearer ${authToken}` },
                        })
                        if (userRes.ok) setUserData(await userRes.json())
                    }
                    setStatus("success")
                } else {
                    setStatus("error")
                }
            })
            .catch(() => setStatus("error"))
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">
                <div className="card-body p-8 text-center space-y-6">

                    {status === "loading" && (
                        <>
                            <div className="text-4xl">⏳</div>
                            <p className="text-white font-semibold">Vérification en cours…</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="text-4xl">✅</div>
                            <div className="space-y-1">
                                <h1 className="text-xl font-bold text-white">Email vérifié !</h1>
                                <p className="text-sm text-gray-400">Votre adresse email a bien été confirmée.</p>
                            </div>
                            <Link
                                to={user ? "/landing" : "/login"}
                                className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
                            >
                                {user ? "Accéder à l'application" : "Se connecter"}
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="text-4xl">❌</div>
                            <div className="space-y-1">
                                <h1 className="text-xl font-bold text-white">Lien invalide</h1>
                                <p className="text-sm text-gray-400">
                                    Ce lien est invalide ou a déjà été utilisé.
                                </p>
                            </div>
                            <Link
                                to={user ? "/landing" : "/login"}
                                className="btn w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                            >
                                {user ? "Retour à l'application" : "Retour à la connexion"}
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}
