import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminCommission() {
    const { token } = useAuth()
    const [value, setValue] = useState("")
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError("")
        setSuccess(false)

        const rate = parseFloat(value)

        if (isNaN(rate) || rate < 0 || rate > 1) {
            setError("La valeur doit être comprise entre 0 et 1 (ex : 0.10 pour 10 %).")
            setSaving(false)
            return
        }

        const res = await fetch("http://localhost:8000/api/admin/setting/commission", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: rate }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error ?? "Une erreur est survenue.")
        } else {
            setSuccess(true)
            setValue("")
            setTimeout(() => setSuccess(false), 3000)
        }

        setSaving(false)
    }

    return (
        <div className="max-w-md space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-white font-semibold">Taux de commission EcoRide</h3>
                <p className="text-sm text-gray-400">
                    Définissez le pourcentage prélevé par EcoRide sur chaque transaction de covoiturage.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Nouveau taux (entre 0 et 1)
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            required
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="0.10"
                            className="input w-40 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none rounded-xl"
                        />
                        {value && !isNaN(parseFloat(value)) && (
                            <span className="text-amber-400 font-semibold text-lg">
                                = {(parseFloat(value) * 100).toFixed(0)} %
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">Exemple : 0.10 = 10 %, 0.05 = 5 %</p>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl"
                    >
                        {saving ? "Enregistrement…" : "Appliquer"}
                    </button>
                    {success && <span className="text-emerald-400 text-sm">✓ Taux mis à jour</span>}
                </div>
            </form>
        </div>
    )
}
