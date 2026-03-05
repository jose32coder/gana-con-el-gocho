"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Rifas", href: "/admin/rifas", icon: "🎟️" },
    { name: "Ganadores", href: "/admin/ganadores", icon: "🏆" },
    { name: "Boletos", href: "/admin/boletos", icon: "💎" },
    { name: "Finanzas", href: "/admin/finanzas", icon: "📊" },
    { name: "Ajustes", href: "/admin/ajustes", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-emerald-500 text-black p-1 rounded-lg text-xs">
            OS
          </span>
          ADMIN
        </h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-xl transition-all active:scale-90"
        >
          <span className="text-2xl">{isSidebarOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div className="flex">
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 lg:sticky lg:translate-x-0 lg:h-screen
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-8">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <span className="bg-emerald-500 text-black p-1 rounded-lg text-sm">
                OS
              </span>
              ADMIN PANEL
            </h2>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all text-left"
            >
              <span className="text-xl">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 w-full overflow-hidden">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
