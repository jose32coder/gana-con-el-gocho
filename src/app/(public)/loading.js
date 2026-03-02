// app/(public)/loading.js
import { Clover } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-12 text-center pt-8 flex flex-col items-center">
          <div className="flex flex-col items-center mb-4">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse mb-2" />
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="h-12 w-64 md:w-96 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mb-3" />
          <div className="h-6 w-48 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
        </header>

        <div className="flex flex-wrap justify-center gap-8 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-sm"
            >
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col h-[450px]">
                <div className="h-56 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="p-5 flex flex-col grow space-y-4">
                  <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                  <div className="mt-auto space-y-4">
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                        <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
