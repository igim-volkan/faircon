"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, Loader2, Lock, Plus, ArrowLeft, Building2, Calendar, Users } from "lucide-react";

interface Customer {
    id: string;
    name: string;
    createdAt: string;
}

interface Fair {
    id: string;
    customerId: string;
    name: string;
    slug: string;
    date: string;
    createdAt: string;
}

interface Contact {
    id: string;
    fairId: string;
    name: string;
    surname: string;
    email: string;
    company?: string;
    title?: string;
    consent: boolean;
    date: string;
    surveyAnswers?: {
        q1: string;
        q2: string;
        q3: string;
    };
}

export default function AdminPage() {
    const [view, setView] = useState<"login" | "customers" | "fairs" | "contacts">("login");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [fairs, setFairs] = useState<Fair[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedFair, setSelectedFair] = useState<Fair | null>(null);

    const [loading, setLoading] = useState(false);

    // Form States
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newFairName, setNewFairName] = useState("");
    const [newFairDate, setNewFairDate] = useState("");

    // Login Handler
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin") {
            setView("customers");
            fetchCustomers();
        } else {
            setAuthError(true);
        }
    };

    // Data Fetching
    const fetchCustomers = async () => {
        setLoading(true);
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data);
        setLoading(false);
    };

    const fetchFairs = async (customerId: string) => {
        setLoading(true);
        const res = await fetch(`/api/fairs?customerId=${customerId}`);
        const data = await res.json();
        setFairs(data);
        setLoading(false);
    };

    const fetchContacts = async (fairId: string) => {
        setLoading(true);
        const res = await fetch(`/api/fairs/${fairId}/contacts`);
        const data = await res.json();
        setContacts(data.reverse());
        setLoading(false);
    };

    // Navigation Handlers
    const openCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        fetchFairs(customer.id);
        setView("fairs");
    };

    const openFair = (fair: Fair) => {
        setSelectedFair(fair);
        fetchContacts(fair.id);
        setView("contacts");
    };

    const goBack = () => {
        if (view === "contacts") {
            setView("fairs");
            setSelectedFair(null);
        } else if (view === "fairs") {
            setView("customers");
            setSelectedCustomer(null);
        }
    };

    // Creation Handlers
    const createCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/customers", {
            method: "POST",
            body: JSON.stringify({ name: newCustomerName }),
        });
        setNewCustomerName("");
        fetchCustomers();
    };

    const createFair = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) return;
        await fetch("/api/fairs", {
            method: "POST",
            body: JSON.stringify({
                customerId: selectedCustomer.id,
                name: newFairName,
                date: newFairDate
            }),
        });
        setNewFairName("");
        setNewFairDate("");
        fetchFairs(selectedCustomer.id);
    };

    // CSV Export
    const exportToCSV = () => {
        const headers = ["Name,Surname,Email,Company,Title,Consent,Date,Found What Looked For?,Want Detailed Info?,Rating"];
        const rows = contacts.map(
            (c) =>
                `${c.name},${c.surname},${c.email},${c.company || "-"},${c.title || "-"},${c.consent ? "Yes" : "No"},${c.date},${c.surveyAnswers?.q1 || "-"},${c.surveyAnswers?.q2 || "-"},${c.surveyAnswers?.q3 || "-"}`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `contacts_${selectedFair?.slug}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Render Views
    if (view === "login") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col items-center mb-6">
                        <div className="p-3 bg-zinc-800 rounded-full mb-4">
                            <Lock className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Girişi</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                            placeholder="Şifre"
                            autoFocus
                        />
                        {authError && <div className="text-red-400 text-sm text-center">Hatalı şifre.</div>}
                        <button type="submit" className="w-full py-2 bg-white text-zinc-950 rounded-lg font-semibold">Giriş Yap</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    {view !== "customers" && (
                        <button onClick={goBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-zinc-400" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {view === "customers" && "Müşteriler"}
                            {view === "fairs" && selectedCustomer?.name}
                            {view === "contacts" && selectedFair?.name}
                        </h1>
                        <p className="text-zinc-400">
                            {view === "customers" && "Sisteme kayıtlı müşteriler"}
                            {view === "fairs" && "Müşteriye ait fuarlar"}
                            {view === "contacts" && "Toplanan iletişim bilgileri"}
                        </p>
                    </div>
                </div>
                {view === "contacts" && (
                    <div className="flex gap-4">
                        <a
                            href={`/f/${selectedFair?.id}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Formu Aç
                        </a>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                            <Download className="w-4 h-4" />
                            CSV İndir
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {view === "customers" && (
                <div className="space-y-6">
                    {/* Add Customer Form */}
                    <form onSubmit={createCustomer} className="flex gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <input
                            type="text"
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            placeholder="Yeni Müşteri Adı"
                            className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                            required
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Ekle
                        </button>
                    </form>

                    {/* Customer List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map(customer => (
                            <button
                                key={customer.id}
                                onClick={() => openCustomer(customer)}
                                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Building2 className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-xs text-zinc-600">{new Date(customer.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{customer.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === "fairs" && (
                <div className="space-y-6">
                    {/* Add Fair Form */}
                    <form onSubmit={createFair} className="flex gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <input
                            type="text"
                            value={newFairName}
                            onChange={(e) => setNewFairName(e.target.value)}
                            placeholder="Fuar Adı"
                            className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                            required
                        />
                        <input
                            type="date"
                            value={newFairDate}
                            onChange={(e) => setNewFairDate(e.target.value)}
                            className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                            required
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Ekle
                        </button>
                    </form>

                    {/* Fair List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fairs.map(fair => (
                            <button
                                key={fair.id}
                                onClick={() => openFair(fair)}
                                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Calendar className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-xs text-zinc-600">{new Date(fair.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{fair.name}</h3>
                                <div className="mt-2 text-sm text-zinc-500">
                                    Link: /f/{fair.id}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === "contacts" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-400">
                            <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Ad</th>
                                    <th className="px-6 py-4">Soyad</th>
                                    <th className="px-6 py-4">E-posta</th>
                                    <th className="px-6 py-4">Şirket / Ünvan</th>
                                    <th className="px-6 py-4 text-center">İzin</th>
                                    <th className="px-6 py-4 text-center">Anket</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                                            Bu fuar için henüz kayıt bulunmuyor.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(contact.date).toLocaleString("tr-TR")}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">{contact.name}</td>
                                            <td className="px-6 py-4 font-medium text-white">{contact.surname}</td>
                                            <td className="px-6 py-4 text-blue-400">{contact.email}</td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{contact.company || "-"}</span>
                                                    <span className="text-xs text-zinc-500">{contact.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.consent ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                                    {contact.consent ? "Evet" : "Hayır"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs text-zinc-400">
                                                {contact.surveyAnswers ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span title="Aradığını buldu mu?">🔍 {contact.surveyAnswers.q1}</span>
                                                        <span title="Bilgi istedi mi?">ℹ️ {contact.surveyAnswers.q2}</span>
                                                        <span title="Puan">⭐ {contact.surveyAnswers.q3}</span>
                                                    </div>
                                                ) : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
