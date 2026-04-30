import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const STATUS_STYLES = {
    PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    RESOLVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

export default function AdminReclamations() {
    const { token } = useAuth()
    const [reclamations, setReclamations] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("ALL")
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/reclaims", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setReclamations(data["hydra:member"] ?? data)
                setLoading(false)
            })
    }, [token])

    async function handleResolve(id) {
        setUpdating(id)
        const res = await fetch(`http://localhost:8000/api/admin/reclaims/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "RESOLVED" }),
        })
        if (res.ok) {
            const updated = await res.json()
            setReclamations(r => r.map(rec => rec.id === id ? updated : rec))
        }
        setUpdating(null)
    }

    const filtered = filter === "ALL" ? reclamations : reclamations.filter(r => r.status === filter)

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    const pending = reclamations.filter(r => r.status === "PENDING").length

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {pending > 0 && (
                    <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium">
                        {pending} en attente
                    </div>
                )}
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    {["ALL", "PENDING", "RESOLVED"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                                filter === f ? "bg-amber-500 text-white" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {f === "ALL" ? "Toutes" : f === "PENDING" ? "En attente" : "Résolues"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">#{r.id} — {r.reclaimType ?? r.type ?? "Réclamation"}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[r.status]}`}>
                                        {r.status === "PENDING" ? "En attente" : "Résolue"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Par {r.user?.email ?? "—"} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : ""}
                                </p>
                            </div>
                            {r.status === "PENDING" && (
                                <button
                                    onClick={() => handleResolve(r.id)}
                                    disabled={updating === r.id}
                                    className="btn btn-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg shrink-0"
                                >
                                    {updating === r.id ? "…" : "Marquer résolue"}
                                </button>
                            )}
                        </div>
                        {r.description && (
                            <p className="text-sm text-gray-300 bg-white/5 rounded-lg px-3 py-2">{r.description}</p>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">Aucune réclamation.</p>
                )}
            </div>
        </div>
    )
}
