"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

interface SurveyProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (answers: SurveyAnswers) => void;
}

export interface SurveyAnswers {
    q1: string; // Found what looking for? (Evet/Hayır)
    q2: string; // Want detailed info? (Evet/Hayır)
    q3: string; // Rating (1-5)
}

export default function SurveyModal({ isOpen, onClose, onComplete }: SurveyProps) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<SurveyAnswers>({
        q1: "",
        q2: "",
        q3: "",
    });

    if (!isOpen) return null;

    const handleAnswer = (key: keyof SurveyAnswers, value: string) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);

        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2">
                        <span>SORU {step} / 3</span>
                        <span>{Math.round((step / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-300 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <h3 className="text-xl font-bold text-white text-center">
                            Standımızda aradığınızı bulabildiniz mi?
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer("q1", "Evet")}
                                className="py-4 rounded-xl border-2 border-zinc-800 hover:border-green-500 hover:bg-green-500/10 transition-all font-semibold text-zinc-300 hover:text-green-500"
                            >
                                Evet
                            </button>
                            <button
                                onClick={() => handleAnswer("q1", "Hayır")}
                                className="py-4 rounded-xl border-2 border-zinc-800 hover:border-red-500 hover:bg-red-500/10 transition-all font-semibold text-zinc-300 hover:text-red-500"
                            >
                                Hayır
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <h3 className="text-xl font-bold text-white text-center">
                            Ürünlerimiz hakkında detaylı bilgi almak ister misiniz?
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer("q2", "Evet")}
                                className="py-4 rounded-xl border-2 border-zinc-800 hover:border-blue-500 hover:bg-blue-500/10 transition-all font-semibold text-zinc-300 hover:text-blue-500"
                            >
                                Evet
                            </button>
                            <button
                                onClick={() => handleAnswer("q2", "Hayır")}
                                className="py-4 rounded-xl border-2 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all font-semibold text-zinc-300 hover:text-white"
                            >
                                Hayır
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <h3 className="text-xl font-bold text-white text-center">
                            Standımızı nasıl puanlarsınız?
                        </h3>
                        <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleAnswer("q3", rating.toString())}
                                    className="w-12 h-12 rounded-full border-2 border-zinc-800 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all font-bold text-lg text-zinc-300 hover:text-yellow-500 flex items-center justify-center"
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 px-1">
                            <span>Kötü</span>
                            <span>Mükemmel</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
