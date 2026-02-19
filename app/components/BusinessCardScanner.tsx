"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import Tesseract from "tesseract.js";

interface BusinessCardScannerProps {
    onScanSuccess: (data: { name?: string; surname?: string; email?: string }) => void;
}

export default function BusinessCardScanner({ onScanSuccess }: BusinessCardScannerProps) {
    const [scanning, setScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        try {
            const result = await Tesseract.recognize(file, "tur", {
                logger: (m) => console.log(m), // Log progress
            });

            const text = result.data.text;
            const extractedData = parseCardText(text);
            if (extractedData) {
                onScanSuccess(extractedData);
            } else {
                alert("Kartvizit taranırken bilgi çıkarılamadı. Lütfen tekrar deneyin veya elle girin.");
            }
        } catch (error) {
            console.error("OCR Error:", error);
            alert("Kartvizit taranırken bir hata oluştu.");
        } finally {
            setScanning(false);
        }
    };

    const parseCardText = (text: string) => {
        // Simple heuristics for email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const emails = text.match(emailRegex);

        // Heuristics for Name (very basic, looks for capitalized words)
        // In a real app, this would be much more complex or use an ML model
        // For now, let's just grab the first line as potential name if it's not the email
        const lines = text.split("\n").filter((line) => line.trim().length > 0);
        let name = "";
        let surname = "";

        if (lines.length > 0) {
            const firstLine = lines[0].trim().split(" ");
            if (firstLine.length > 1) {
                name = firstLine[0];
                surname = firstLine.slice(1).join(" ");
            } else {
                name = firstLine[0];
            }
        }

        return {
            email: emails ? emails[0] : undefined,
            name: name,
            surname: surname
        };
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
            <input
                type="file"
                accept="image/*"
                capture="environment" // Open camera on mobile
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {scanning ? (
                <div className="flex flex-col items-center text-zinc-400">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                    <span className="text-sm">Kartvizit Taranıyor...</span>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center text-zinc-400 hover:text-white transition-colors gap-2"
                >
                    <div className="p-3 bg-zinc-800 rounded-full">
                        <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Kartvizit Tara</span>
                    <span className="text-xs text-zinc-600">Kamerayı açmak veya fotoğraf yüklemek için dokunun</span>
                </button>
            )}
        </div>
    );
}
