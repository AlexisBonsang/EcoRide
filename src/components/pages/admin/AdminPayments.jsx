import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const TYPE_LABELS = { CARRIDE: "Covoiturage", SOFTRIDE: "Mobilité douce", SUBSCRIPTION: "Abonnement" }
const STATUS_STYLES = {
    COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

export default function AdminPayments() {
    const { token } = useAuth()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/payments", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setPayments(data["hydra:member"] ?? data)
                setLoading(false)
            })
    }, [token])

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    const total = payments.filter(p => p.status === "COMPLETED").reduce((s, p) => s + (p.amount ?? 0), 0)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-xs text-gray-400">Total encaissé</p>
                    <p className="text-xl font-bold text-white">{(total / 100).toFixed(2)} €</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-xs text-gray-400">Transactions</p>
                    <p className="text-xl font-bold text-white">{payments.length}</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Utilisateur</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Montant</th>
                            <th className="px-4 py-3 text-left">Commission</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payments.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition">
                                <td className="px-4 py-3 text-gray-400 text-xs">#{p.id}</td>
                                <td className="px-4 py-3 text-gray-300 text-xs">{p.user?.email ?? "—"}</td>
                                <td className="px-4 py-3 text-gray-300">{TYPE_LABELS[p.type] ?? p.type}</td>
                                <td className="px-4 py-3 text-white font-medium">
                                    {p.amount != null ? `${(p.amount / 100).toFixed(2)} €` : "—"}
                                </td>
                                <td className="px-4 py-3 text-gray-400">
                                    {p.feeAmount != null ? `${(p.feeAmount / 100).toFixed(2)} €` : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[p.status] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">
                                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("fr-FR") : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">Aucun paiement.</p>
                )}
            </div>
        </div>
    )
}
