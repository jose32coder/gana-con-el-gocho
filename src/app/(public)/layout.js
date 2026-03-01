import { Clover } from "lucide-react";
import Link from "next/link";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      {/* Navbar Minimalista */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl flex gap-1 items-center font-black text-zinc-900 dark:text-white tracking-tighter"
          >
            <Clover
              className="text-emerald-500 fill-emerald-500/20"
              size={24}
              strokeWidth={3}
            />
            GANA CON<span className="text-emerald-500">EL GOCHO</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/verificar"
              className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Verificar Ticket
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-zinc-400 font-medium">
            © {new Date().getFullYear()} Gana con el Gocho. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
