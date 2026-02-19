import ContactForm from "./components/ContactForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <ContactForm />

      <footer className="mt-12 text-zinc-600 text-sm flex flex-col items-center gap-2">
        <p>&copy; 2024 Fair Contact Collector. All rights reserved.</p>
        <Link href="/admin" className="text-zinc-800 hover:text-zinc-500 transition-colors text-xs">
          Panel
        </Link>
      </footer>
    </div>
  );
}
