import { useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        if (password !== passwordConfirm) {
            setError("Les mots de passe ne correspondent pas.")
            return
        }

        setLoading(true)

        const res = await fetch("http://localhost:8000/auth/password-reset/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error ?? "Une erreur est survenue.")
        } else {
            setSuccess(true)
            setTimeout(() => navigate("/login"), 3000)
        }

        setLoading(false)
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">
                    <div className="card-body p-8 text-center space-y-4">
                        <p className="text-red-400">Lien invalide ou manquant.</p>
                        <Link to="/forgot-password" className="text-emerald-400 hover:underline text-sm">
                            Demander un nouveau lien
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">
                <div className="card-body p-8 space-y-6">

                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Nouveau mot de passe</h1>
                        <p className="text-sm text-gray-400">Choisissez un mot de passe sécurisé.</p>
                    </div>

                    {success ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                                <p className="text-emerald-300 text-sm">
                                    Mot de passe réinitialisé ! Vous allez être redirigé vers la connexion…
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                                />
                                <p className="text-xs text-gray-500">Min. 7 caractères, 1 chiffre, 1 caractère spécial</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordConfirm}
                                    onChange={e => setPasswordConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? "Enregistrement…" : "Réinitialiser le mot de passe"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
