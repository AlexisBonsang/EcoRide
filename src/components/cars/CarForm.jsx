import { useState } from "react"

const EMPTY_FORM = {
    model: "", brand: "", licensePlate: "",
    seats: 1, engine: "", insurance: "", purchaseDate: "",
}

export function carToForm(car) {
    return {
        model: car.model ?? "",
        brand: car.brand ?? "",
        licensePlate: car.licensePlate ?? "",
        seats: car.seats ?? 1,
        engine: car.engine ?? "",
        insurance: car.insurance ?? "",
        purchaseDate: car.purchaseDate ? car.purchaseDate.slice(0, 10) : "",
    }
}

function Field({ label, required, children }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    )
}

function Input(props) {
    return (
        <input
            {...props}
            className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
        />
    )
}

export default function CarForm({ token, editingCar, onSaved, onCancel }) {
    const [form, setForm] = useState(editingCar ? carToForm(editingCar) : EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setErrors({})

        const body = { ...form, seats: parseInt(form.seats) }
        if (!body.purchaseDate) delete body.purchaseDate
        if (!body.engine) delete body.engine
        if (!body.insurance) delete body.insurance

        const url = editingCar
            ? `http://localhost:8000/api/users/me/car/${editingCar.id}`
            : "http://localhost:8000/api/users/me/car"

        const res = await fetch(url, {
            method: editingCar ? "PUT" : "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            setErrors(data.violations
                ? Object.fromEntries(data.violations.map(v => [v.propertyPath, v.message]))
                : { global: data["hydra:description"] ?? "Une erreur est survenue." }
            )
        } else {
            onSaved(data)
        }
        setSaving(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white font-semibold">
                {editingCar ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Marque">
                    <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Renault" />
                    {errors.brand && <p className="text-red-400 text-xs">{errors.brand}</p>}
                </Field>
                <Field label="Modèle" required>
                    <Input required value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="Clio" />
                    {errors.model && <p className="text-red-400 text-xs">{errors.model}</p>}
                </Field>
                <Field label="Immatriculation" required>
                    <Input required value={form.licensePlate} onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))} placeholder="AB-123-CD" />
                    {errors.licensePlate && <p className="text-red-400 text-xs">{errors.licensePlate}</p>}
                </Field>
                <Field label="Nombre de places" required>
                    <Input required type="number" min={1} max={9} value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} />
                    {errors.seats && <p className="text-red-400 text-xs">{errors.seats}</p>}
                </Field>
                <Field label="Motorisation">
                    <Input value={form.engine} onChange={e => setForm(f => ({ ...f, engine: e.target.value }))} placeholder="Essence, Électrique, Hybride…" />
                </Field>
                <Field label="Date d'achat">
                    <Input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} />
                </Field>
            </div>

            <Field label="Assurance">
                <Input value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} placeholder="Compagnie ou numéro de contrat" />
            </Field>

            {errors.global && <p className="text-red-400 text-sm">{errors.global}</p>}

            <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl">
                    {saving ? "Enregistrement…" : editingCar ? "Mettre à jour" : "Ajouter"}
                </button>
                <button type="button" onClick={onCancel} className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                    Annuler
                </button>
            </div>
        </form>
    )
}
