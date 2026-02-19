"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, ClipboardList } from "lucide-react";
import BusinessCardScanner from "./BusinessCardScanner";
import SurveyModal, { SurveyAnswers } from "./SurveyModal";

interface ContactFormProps {
    fairId?: string;
}

export default function ContactForm({ fairId = "default-fair" }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        company: "",
        title: "",
        consent: false,
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleScanSuccess = (data: { name?: string; surname?: string; email?: string; company?: string; title?: string }) => {
        setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            surname: data.surname || prev.surname,
            email: data.email || prev.email,
            company: data.company || prev.company,
            title: data.title || prev.title
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.consent) {
            setErrorMessage("Lütfen e-posta paylaşımını onaylayın.");
            return;
        }

        setStatus("submitting");
        setErrorMessage("");

        try {
            const response = await fetch(`/api/fairs/${fairId}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, surveyAnswers }),
            });

            if (!response.ok) throw new Error("Bir hata oluştu.");

            setStatus("success");
            setStatus("success");
            setFormData({ name: "", surname: "", email: "", company: "", title: "", consent: false });
            setSurveyAnswers(null);
        } catch (error) {
            setStatus("error");
            setErrorMessage("Kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Teşekkürler!</h2>
                <p className="text-zinc-400 mb-6">Bilgileriniz başarıyla kaydedildi.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-white transition-colors"
                >
                    Yeni Kayıt Ekle
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Hoş Geldiniz
                </h1>
                <p className="text-zinc-400 mt-2">Lütfen iletişim bilgilerinizi bizimle paylaşın.</p>
            </div>

            <BusinessCardScanner onScanSuccess={handleScanSuccess} />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500">veya formu doldurun</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-zinc-300">Ad</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-zinc-600"
                            placeholder="Adınız"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="surname" className="text-sm font-medium text-zinc-300">Soyad</label>
                        <input
                            id="surname"
                            name="surname"
                            type="text"
                            required
                            value={formData.surname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-zinc-600"
                            placeholder="Soyadınız"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium text-zinc-300">Şirket <span className="text-zinc-500 font-normal">(İsteğe bağlı)</span></label>
                        <input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-zinc-600"
                            placeholder="Şirket Adı"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-zinc-300">Ünvan <span className="text-zinc-500 font-normal">(İsteğe bağlı)</span></label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-zinc-600"
                            placeholder="Ünvanınız"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">E-posta</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-zinc-600"
                        placeholder="ornek@sirket.com"
                    />
                </div>

                <div className="py-2">
                    <button
                        type="button"
                        onClick={() => setIsSurveyOpen(true)}
                        className={`w-full py-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${surveyAnswers
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : "border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5 text-zinc-400 hover:text-blue-400"
                            }`}
                    >
                        {surveyAnswers ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Anket Tamamlandı</span>
                            </>
                        ) : (
                            <>
                                <ClipboardList className="w-5 h-5" />
                                <span className="font-medium">Ankete katılmak istiyorum</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-zinc-600 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                            <CheckCircle className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors select-none leading-tight">
                            E-posta adresimin paylaşılmasını ve bana ulaşılmasını kabul ediyorum.
                        </span>
                    </label>
                </div>

                {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-2.5 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {status === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {status === "submitting" ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </form>

            <SurveyModal
                isOpen={isSurveyOpen}
                onClose={() => setIsSurveyOpen(false)}
                onComplete={(answers) => {
                    setSurveyAnswers(answers);
                    setIsSurveyOpen(false);
                }}
            />
        </div>
    );
}
