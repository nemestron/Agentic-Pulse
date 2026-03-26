export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="max-w-3xl w-full space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--primary))]">
            Agentic Pulse
          </h1>
          <p className="text-xl opacity-90">
            Development Environment Verified.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Frontend Architecture</h2>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Next.js 14 App Router</li>
              <li>React 18 Server Components</li>
              <li>TypeScript 5.4 Strict Mode</li>
              <li>Tailwind CSS 3.4</li>
            </ul>
          </div>

          <div className="p-6 border rounded-xl bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Design Constraints</h2>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Premium Minimalist Palette</li>
              <li className="font-medium">Strictly No Blue/Purple</li>
              <li>System-Native Dark Mode Active</li>
              <li>CSS Variable Theming</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
