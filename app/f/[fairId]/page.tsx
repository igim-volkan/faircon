import ContactForm from "@/app/components/ContactForm";

export default async function FairPage({ params }: { params: Promise<{ fairId: string }> }) {
    const { fairId } = await params;
    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-md">
                <ContactForm fairId={fairId} />
            </div>

            <div className="absolute bottom-4 text-zinc-600 text-xs text-center w-full">
                Protected by Fair Contact Collector
            </div>
        </main>
    );
}
