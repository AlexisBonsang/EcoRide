import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import CarForm from "../cars/CarForm"

export default function MyCars() {
    const { token } = useAuth()
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [adding, setAdding] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setCars(data.cars ?? [])
                setLoading(false)
            })
    }, [token])

    function handleSaved(saved) {
        setCars(prev => {
            const exists = prev.find(c => c.id === saved.id)
            return exists ? prev.map(c => c.id === saved.id ? saved : c) : [...prev, saved]
        })
        setEditingId(null)
        setAdding(false)
    }

    async function handleDelete(id) {
        setDeletingId(id)
        const res = await fetch(`http://localhost:8000/api/users/me/car/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok || res.status === 204) {
            setCars(prev => prev.filter(c => c.id !== id))
        }
        setDeletingId(null)
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mes véhicules</h1>
                    <p className="text-sm text-gray-400 mt-1">Gérez vos véhicules pour proposer des trajets.</p>
                </div>
                {!adding && (
                    <button
                        onClick={() => { setAdding(true); setEditingId(null) }}
                        className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
                    >
                        + Ajouter
                    </button>
                )}
            </div>

            {adding && (
                <CarForm token={token} editingCar={null} onSaved={handleSaved} onCancel={() => setAdding(false)} />
            )}

            {loading ? (
                <p className="text-gray-400 text-sm">Chargement…</p>
            ) : cars.length === 0 && !adding ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400">Aucun véhicule enregistré.</p>
                    <button
                        onClick={() => setAdding(true)}
                        className="mt-4 btn btn-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl"
                    >
                        Ajouter mon premier véhicule
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {cars.map(car => (
                        <div key={car.id}>
                            {editingId === car.id ? (
                                <CarForm token={token} editingCar={car} onSaved={handleSaved} onCancel={() => setEditingId(null)} />
                            ) : (
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-white font-semibold">
                                            {car.brand ? `${car.brand} ` : ""}{car.model}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                            <span className="px-2 py-0.5 rounded-full bg-white/10">{car.licensePlate}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-white/10">{car.seats} places</span>
                                            {car.engine && <span className="px-2 py-0.5 rounded-full bg-white/10">{car.engine}</span>}
                                        </div>
                                        {car.insurance && (
                                            <p className="text-xs text-gray-500">Assurance : {car.insurance}</p>
                                        )}
                                        {car.purchaseDate && (
                                            <p className="text-xs text-gray-500">
                                                Acheté le {new Date(car.purchaseDate).toLocaleDateString("fr-FR")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => { setEditingId(car.id); setAdding(false) }}
                                            className="btn btn-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car.id)}
                                            disabled={deletingId === car.id}
                                            className="btn btn-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg"
                                        >
                                            {deletingId === car.id ? "…" : "Supprimer"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
