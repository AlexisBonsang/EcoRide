import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const ROLES_OPTIONS = ["ROLE_USER", "ROLE_ADMIN", "ROLE_MARKETING", "ROLE_DRIVER"]

export default function AdminUsers() {
    const { token } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setUsers(data["hydra:member"] ?? data)
                setLoading(false)
            })
    }, [token])

    async function handleSave(id) {
        setSaving(true)
        const res = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/merge-patch+json",
            },
            body: JSON.stringify(editForm),
        })
        if (res.ok) {
            const updated = await res.json()
            setUsers(u => u.map(user => user.id === id ? updated : user))
            setEditingId(null)
        }
        setSaving(false)
    }

    async function handleDelete(id) {
        if (!confirm("Supprimer cet utilisateur ?")) return
        const res = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok || res.status === 204) {
            setUsers(u => u.filter(user => user.id !== id))
        }
    }

    const filtered = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Rechercher par nom ou email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input w-full max-w-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none rounded-xl"
            />

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Utilisateur</th>
                            <th className="px-4 py-3 text-left">Rôles</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left">Connexion</th>
                            <th className="px-4 py-3 text-left">Score</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map(u => (
                            <tr key={u.id} className="bg-white/2 hover:bg-white/5 transition">
                                <td className="px-4 py-3">
                                    <div className="text-white font-medium">
                                        {u.firstName || u.lastName
                                            ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                                            : "—"}
                                    </div>
                                    <div className="text-gray-400 text-xs">{u.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === u.id ? (
                                        <select
                                            multiple
                                            value={editForm.roles}
                                            onChange={e => setEditForm(f => ({
                                                ...f,
                                                roles: Array.from(e.target.selectedOptions, o => o.value)
                                            }))}
                                            className="bg-white/10 border border-white/20 text-white rounded-lg px-2 py-1 text-xs"
                                        >
                                            {ROLES_OPTIONS.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {u.roles?.filter(r => r !== "ROLE_USER").map(r => (
                                                <span key={r} className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
                                                    {r.replace("ROLE_", "")}
                                                </span>
                                            ))}
                                            {u.roles?.length === 1 && u.roles[0] === "ROLE_USER" && (
                                                <span className="text-xs text-gray-500">USER</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === u.id ? (
                                        <input
                                            type="checkbox"
                                            checked={editForm.isActive}
                                            onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                                            className="checkbox checkbox-sm"
                                        />
                                    ) : (
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                            u.isActive
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                : "bg-red-500/20 text-red-400 border-red-500/30"
                                        }`}>
                                            {u.isActive ? "Actif" : "Inactif"}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs capitalize">
                                    {u.connexionType ?? "standard"}
                                </td>
                                <td className="px-4 py-3 text-gray-300 text-xs">
                                    {u.score != null ? `★ ${Number(u.score).toFixed(1)}` : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === u.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSave(u.id)}
                                                disabled={saving}
                                                className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg"
                                            >
                                                {saving ? "…" : "Sauver"}
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="btn btn-xs bg-white/10 text-white border border-white/20 rounded-lg"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(u.id)
                                                    setEditForm({ roles: u.roles, isActive: u.isActive })
                                                }}
                                                className="btn btn-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="btn btn-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">Aucun utilisateur trouvé.</p>
                )}
            </div>
        </div>
    )
}
