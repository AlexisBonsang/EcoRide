import { useState } from "react"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("http://localhost:8000/auth/password-reset/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })

        if (res.status === 429) {
            const data = await res.json()
            setError(data.error)
        } else {
            setSubmitted(true)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">
                <div className="card-body p-8 space-y-6">

                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Mot de passe oublié</h1>
                        <p className="text-sm text-gray-400">
                            {submitted
                                ? "Vérifiez votre boîte mail."
                                : "Entrez votre email pour recevoir un lien de réinitialisation."}
                        </p>
                    </div>

                    {submitted ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                                <p className="text-emerald-300 text-sm">
                                    Si cet email est enregistré, vous recevrez un lien de réinitialisation valable <strong>15 minutes</strong>.
                                </p>
                            </div>
                            <Link to="/login" className="btn w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Adresse email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="exemple@email.com"
                                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? "Envoi…" : "Envoyer le lien"}
                            </button>

                            <p className="text-center text-sm text-gray-400">
                                <Link to="/login" className="text-emerald-400 hover:underline">
                                    Retour à la connexion
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
