import { useState } from "react"
import AdminUsers from "./AdminUsers"
import AdminVehicles from "./AdminVehicles"
import AdminPayments from "./AdminPayments"
import AdminReclamations from "./AdminReclamations"
import AdminCommission from "./AdminCommission"

const TABS = [
    { label: "Utilisateurs", icon: "👥" },
    { label: "Véhicules", icon: "🚗" },
    { label: "Paiements", icon: "💳" },
    { label: "Réclamations", icon: "📋" },
    { label: "Commission", icon: "⚙️" },
]

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Panel Administration</h1>
                <p className="text-sm text-gray-400 mt-1">Gestion de la plateforme EcoRide</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {TABS.map((tab, i) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(i)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                            activeTab === i
                                ? "bg-amber-500 text-white shadow"
                                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 0 && <AdminUsers />}
                {activeTab === 1 && <AdminVehicles />}
                {activeTab === 2 && <AdminPayments />}
                {activeTab === 3 && <AdminReclamations />}
                {activeTab === 4 && <AdminCommission />}
            </div>
        </div>
    )
}
