import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { isProfileComplete } from "../auth/RequireProfileComplete"
import CarForm from "../cars/CarForm"

const TABS = ["Informations", "Mon véhicule", "Compte"]

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/

// ─── Helpers ────────────────────────────────────────────────────────────────

function Field({ label, required, children }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    )
}

function Input({ ...props }) {
    return (
        <input
            {...props}
            className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
        />
    )
}

function Select({ children, ...props }) {
    return (
        <select
            {...props}
            className="select w-full bg-white/10 border border-white/20 text-white focus:border-emerald-500 focus:outline-none rounded-xl"
        >
            {children}
        </select>
    )
}

// ─── Onglet Informations ─────────────────────────────────────────────────────

function TabInfos({ token, user: authUser, setUserData, requireCompletion }) {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: "", lastName: "", dateOfBirth: "",
        phoneNumber: "", lang: "fr", iban: "", profilePicture: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})
    const [showIban, setShowIban] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setForm({
                    firstName: data.firstName ?? "",
                    lastName: data.lastName ?? "",
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
                    phoneNumber: data.phoneNumber ?? "",
                    lang: data.lang ?? "fr",
                    iban: data.iban ?? "",
                    profilePicture: data.profilePicture ?? "",
                })
                setLoading(false)
            })
    }, [token])

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setErrors({})
        setSuccess(false)

        const body = { ...form }
        if (!body.dateOfBirth) delete body.dateOfBirth
        if (!body.iban) delete body.iban
        if (!body.profilePicture) delete body.profilePicture

        const res = await fetch("http://localhost:8000/api/users/me", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/merge-patch+json",
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            setErrors(data.violations
                ? Object.fromEntries(data.violations.map(v => [v.propertyPath, v.message]))
                : { global: "Une erreur est survenue." }
            )
        } else {
            setUserData(data)
            setSuccess(true)
            if (isProfileComplete(data)) {
                setTimeout(() => navigate("/landing"), 800)
            } else {
                setTimeout(() => setSuccess(false), 3000)
            }
        }
        setSaving(false)
    }

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">

            {requireCompletion && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-amber-400 text-lg">⚠</span>
                    <div>
                        <p className="text-amber-300 font-medium text-sm">Profil incomplet</p>
                        <p className="text-amber-200/70 text-xs mt-0.5">
                            Veuillez renseigner les champs obligatoires (<span className="text-red-400">*</span>) pour accéder à l'application.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Field label="Prénom" required>
                    <Input
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="Jean"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
                </Field>
                <Field label="Nom" required>
                    <Input
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Dupont"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
                </Field>
            </div>

            <Field label="Date de naissance" required>
                <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                />
                {errors.dateOfBirth && <p className="text-red-400 text-xs">{errors.dateOfBirth}</p>}
            </Field>

            <Field label="Téléphone" required>
                <Input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                    placeholder="+33 6 00 00 00 00"
                />
                {errors.phoneNumber && <p className="text-red-400 text-xs">{errors.phoneNumber}</p>}
            </Field>

            <Field label="IBAN">
                <div className="relative">
                    <input
                        type={showIban ? "text" : "password"}
                        value={form.iban}
                        onChange={e => setForm(f => ({ ...f, iban: e.target.value }))}
                        placeholder="FR76 1234 5678 9012 3456 7890 189"
                        className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowIban(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-xs"
                        title={showIban ? "Masquer" : "Afficher"}
                    >
                        {showIban ? "🙈" : "👁"}
                    </button>
                </div>
                {errors.iban && <p className="text-red-400 text-xs">{errors.iban}</p>}
            </Field>

            <Field label="Langue">
                <Select
                    value={form.lang}
                    onChange={e => setForm(f => ({ ...f, lang: e.target.value }))}
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </Select>
            </Field>

            <Field label="URL photo de profil">
                <Input
                    value={form.profilePicture}
                    onChange={e => setForm(f => ({ ...f, profilePicture: e.target.value }))}
                    placeholder="https://…"
                />
            </Field>

            {errors.global && <p className="text-red-400 text-sm">{errors.global}</p>}

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
                >
                    {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
                {success && <span className="text-emerald-400 text-sm">✓ Modifications sauvegardées</span>}
            </div>
        </form>
    )
}

// ─── Onglet Véhicule ─────────────────────────────────────────────────────────

function TabVehicule({ token }) {
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

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    return (
        <div className="space-y-4 max-w-lg">
            {cars.map(car => (
                <div key={car.id}>
                    {editingId === car.id ? (
                        <CarForm token={token} editingCar={car} onSaved={handleSaved} onCancel={() => setEditingId(null)} />
                    ) : (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-white font-medium">
                                        {car.brand ? `${car.brand} ` : ""}{car.model}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {car.licensePlate} · {car.seats} places
                                        {car.engine ? ` · ${car.engine}` : ""}
                                    </p>
                                    {car.insurance && (
                                        <p className="text-xs text-gray-500 mt-0.5">Assurance : {car.insurance}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditingId(car.id)}
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
                        </div>
                    )}
                </div>
            ))}

            {cars.length === 0 && !adding && (
                <p className="text-sm text-gray-400">Aucun véhicule enregistré.</p>
            )}

            {adding ? (
                <CarForm token={token} editingCar={null} onSaved={handleSaved} onCancel={() => setAdding(false)} />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="btn btn-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl"
                >
                    + Ajouter un véhicule
                </button>
            )}
        </div>
    )
}

// ─── Onglet Compte ───────────────────────────────────────────────────────────

function ChangePasswordForm({ token }) {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", newPasswordConfirm: "" })
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})
        setSuccess(false)

        const localErrors = {}
        if (!PASSWORD_REGEX.test(form.newPassword)) {
            localErrors.newPassword = "Le mot de passe doit contenir au moins 7 caractères, 1 chiffre et 1 caractère spécial."
        }
        if (form.newPassword !== form.newPasswordConfirm) {
            localErrors.newPasswordConfirm = "Les mots de passe ne correspondent pas."
        }
        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors)
            return
        }

        setSaving(true)
        const res = await fetch("http://localhost:8000/api/users/me/password", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            }),
        })

        if (res.ok) {
            setSuccess(true)
            setForm({ currentPassword: "", newPassword: "", newPasswordConfirm: "" })
            setTimeout(() => setSuccess(false), 3000)
        } else {
            const data = await res.json().catch(() => ({}))
            setErrors({ global: data.message ?? data["hydra:description"] ?? "Une erreur est survenue." })
        }
        setSaving(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-white font-semibold">Changer de mot de passe</h3>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mot de passe actuel</label>
                <input
                    type="password"
                    value={form.currentPassword}
                    onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nouveau mot de passe</label>
                <input
                    type="password"
                    value={form.newPassword}
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                />
                <p className="text-gray-500 text-xs">Minimum 7 caractères, dont 1 chiffre et 1 caractère spécial.</p>
                {errors.newPassword && <p className="text-red-400 text-xs">{errors.newPassword}</p>}
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
                <input
                    type="password"
                    value={form.newPasswordConfirm}
                    onChange={e => setForm(f => ({ ...f, newPasswordConfirm: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                />
                {errors.newPasswordConfirm && <p className="text-red-400 text-xs">{errors.newPasswordConfirm}</p>}
            </div>
            {errors.global && <p className="text-red-400 text-sm">{errors.global}</p>}
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
                >
                    {saving ? "Enregistrement…" : "Modifier le mot de passe"}
                </button>
                {success && <span className="text-emerald-400 text-sm">✓ Mot de passe mis à jour</span>}
            </div>
        </form>
    )
}

function TabCompte({ token, logout }) {
    const navigate = useNavigate()
    const [confirm, setConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        setDeleting(true)
        await fetch("http://localhost:8000/api/users/me", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        logout()
        navigate("/")
    }

    return (
        <div className="space-y-8 max-w-lg">
            <ChangePasswordForm token={token} />

            <div className="border-t border-white/10 pt-8 space-y-4">
                <h3 className="text-white font-semibold">Adresse email</h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-400">La modification de l'email se fait via le support EcoRide.</p>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
                <h3 className="text-red-400 font-semibold">Supprimer mon compte</h3>
                <p className="text-sm text-gray-400">
                    Cette action est irréversible. Vos données personnelles seront anonymisées conformément au RGPD.
                    Votre historique de trajets sera conservé sous forme anonyme.
                </p>

                {!confirm ? (
                    <button
                        onClick={() => setConfirm(true)}
                        className="btn btn-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl"
                    >
                        Supprimer mon compte
                    </button>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-red-300 font-medium">Êtes-vous sûr ? Cette action est définitive.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-xl"
                            >
                                {deleting ? "Suppression…" : "Oui, supprimer"}
                            </button>
                            <button
                                onClick={() => setConfirm(false)}
                                className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function Profile() {
    const [activeTab, setActiveTab] = useState(0)
    const { user, token, setUserData, logout } = useAuth()
    const location = useLocation()
    const requireCompletion = !isProfileComplete(user)

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

            {/* En-tête */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-bold shrink-0">
                    {user?.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt="Photo de profil"
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = "none" }}
                        />
                    ) : (
                        user?.firstName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400">{user?.email}</span>
                        {user?.score != null && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5">
                                ★ {Number(user.score).toFixed(1)}
                            </span>
                        )}
                        {user?.emailVerified && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                                Email vérifié
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
                {TABS.map((tab, i) => {
                    const blocked = requireCompletion && i !== 0
                    return (
                        <button
                            key={tab}
                            onClick={() => !blocked && setActiveTab(i)}
                            disabled={blocked}
                            title={blocked ? "Complétez d'abord vos informations obligatoires" : undefined}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                activeTab === i
                                    ? "bg-emerald-500 text-white shadow"
                                    : blocked
                                        ? "text-gray-600 cursor-not-allowed"
                                        : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    )
                })}
            </div>

            {requireCompletion && (
                <p className="text-xs text-gray-500">
                    <span className="text-red-400">*</span> Champ obligatoire
                </p>
            )}

            {/* Contenu de l'onglet actif */}
            <div>
                {activeTab === 0 && <TabInfos token={token} user={user} setUserData={setUserData} requireCompletion={requireCompletion} />}
                {activeTab === 1 && <TabVehicule token={token} />}
                {activeTab === 2 && <TabCompte token={token} logout={logout} />}
            </div>
        </div>
    )
}
