import { Sidebar } from "./sidebar"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 