import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { isProfileComplete } from "../auth/RequireProfileComplete"

const TABS = ["Informations", "Mon véhicule", "Compte"]

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
                <Input
                    value={form.iban}
                    onChange={e => setForm(f => ({ ...f, iban: e.target.value }))}
                    placeholder="FR76 1234 5678 9012 3456 7890 189"
                />
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
                    placeholder="https://..."
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
    const [car, setCar] = useState(null)
    const [form, setForm] = useState({
        model: "", brand: "", licensePlate: "",
        seats: 1, engine: "", insurance: "", purchaseDate: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                const existing = data.cars?.[0] ?? null
                setCar(existing)
                if (existing) {
                    setForm({
                        model: existing.model ?? "",
                        brand: existing.brand ?? "",
                        licensePlate: existing.licensePlate ?? "",
                        seats: existing.seats ?? 1,
                        engine: existing.engine ?? "",
                        insurance: existing.insurance ?? "",
                        purchaseDate: existing.purchaseDate ? existing.purchaseDate.slice(0, 10) : "",
                    })
                }
                setLoading(false)
            })
    }, [token])

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setErrors({})
        setSuccess(false)

        const body = { ...form, seats: parseInt(form.seats) }
        if (!body.purchaseDate) delete body.purchaseDate
        if (!body.engine) delete body.engine
        if (!body.insurance) delete body.insurance

        const url = car
            ? `http://localhost:8000/api/users/me/car/${car.id}`
            : "http://localhost:8000/api/users/me/car"
        const method = car ? "PUT" : "POST"

        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            setErrors(data.violations
                ? Object.fromEntries(data.violations.map(v => [v.propertyPath, v.message]))
                : { global: data["hydra:description"] ?? "Une erreur est survenue." }
            )
        } else {
            setCar(data)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        }
        setSaving(false)
    }

    if (loading) return <p className="text-gray-400 text-sm">Chargement…</p>

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <p className="text-sm text-gray-400">
                {car ? "Modifiez les informations de votre véhicule." : "Ajoutez votre véhicule pour proposer des trajets."}
            </p>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Marque">
                    <Input
                        value={form.brand}
                        onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                        placeholder="Renault"
                    />
                    {errors.brand && <p className="text-red-400 text-xs">{errors.brand}</p>}
                </Field>
                <Field label="Modèle *">
                    <Input
                        required
                        value={form.model}
                        onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                        placeholder="Clio"
                    />
                    {errors.model && <p className="text-red-400 text-xs">{errors.model}</p>}
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Immatriculation *">
                    <Input
                        required
                        value={form.licensePlate}
                        onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))}
                        placeholder="AB-123-CD"
                    />
                    {errors.licensePlate && <p className="text-red-400 text-xs">{errors.licensePlate}</p>}
                </Field>
                <Field label="Nombre de places *">
                    <Input
                        required
                        type="number"
                        min={1}
                        max={9}
                        value={form.seats}
                        onChange={e => setForm(f => ({ ...f, seats: e.target.value }))}
                    />
                    {errors.seats && <p className="text-red-400 text-xs">{errors.seats}</p>}
                </Field>
            </div>

            <Field label="Motorisation">
                <Input
                    value={form.engine}
                    onChange={e => setForm(f => ({ ...f, engine: e.target.value }))}
                    placeholder="Essence, Électrique, Hybride…"
                />
            </Field>

            <Field label="Assurance">
                <Input
                    value={form.insurance}
                    onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))}
                    placeholder="Numéro ou compagnie d'assurance"
                />
            </Field>

            <Field label="Date d'achat">
                <Input
                    type="date"
                    value={form.purchaseDate}
                    onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                />
            </Field>

            {errors.global && <p className="text-red-400 text-sm">{errors.global}</p>}

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl"
                >
                    {saving ? "Enregistrement…" : car ? "Mettre à jour" : "Ajouter le véhicule"}
                </button>
                {success && <span className="text-emerald-400 text-sm">✓ Véhicule enregistré</span>}
            </div>
        </form>
    )
}

// ─── Onglet Compte ───────────────────────────────────────────────────────────

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
            {/* Email non modifiable ici */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Adresse email</p>
                <p className="text-white text-sm">La modification de l'email se fait via les paramètres de sécurité.</p>
            </div>

            {/* Suppression du compte */}
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
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-bold">
                    {user?.firstName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
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
