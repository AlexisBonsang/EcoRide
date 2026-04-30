import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminVehicles() {
    const { token } = useAuth()
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/cars", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setVehicles(data["hydra:member"] ?? data)
                setLoading(false)
            })
    }, [token])

    async function handleDelete(id) {
        if (!confirm("Supprimer ce véhicule ?")) return
        setDeletingId(id)
        const res = await fetch(`http://localhost:8000/api/admin/cars/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok || res.status === 204) {
            setVehicles(v => v.filter(car => car.id !== id))
        }
        setDeletingId(null)
    }

    const filtered = vehicles.filter(v =>
        v.model?.toLowerCase().includes(search.toLowerCase()) ||
        v.brand?.toLowerCase().includes(search.toLowerCase()) ||
        v.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
        v.owner?.email?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Rechercher par modèle, marque, immatriculation ou propriétaire…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input w-full max-w-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none rounded-xl"
            />

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Véhicule</th>
                            <th className="px-4 py-3 text-left">Immatriculation</th>
                            <th className="px-4 py-3 text-left">Places</th>
                            <th className="px-4 py-3 text-left">Motorisation</th>
                            <th className="px-4 py-3 text-left">Propriétaire</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map(v => (
                            <tr key={v.id} className="bg-white/2 hover:bg-white/5 transition">
                                <td className="px-4 py-3">
                                    <div className="text-white font-medium">
                                        {v.brand ? `${v.brand} ` : ""}{v.model}
                                    </div>
                                    {v.purchaseDate && (
                                        <div className="text-gray-500 text-xs">
                                            Acheté le {new Date(v.purchaseDate).toLocaleDateString("fr-FR")}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-300">{v.licensePlate}</td>
                                <td className="px-4 py-3 text-gray-300">{v.seats}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{v.engine ?? "—"}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">
                                    {v.owner?.email ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleDelete(v.id)}
                                        disabled={deletingId === v.id}
                                        className="btn btn-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg"
                                    >
                                        {deletingId === v.id ? "…" : "Supprimer"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">Aucun véhicule trouvé.</p>
                )}
            </div>
        </div>
    )
}
