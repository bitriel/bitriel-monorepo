import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1 text-sm text-slate-300 shadow-lg shadow-slate-950/40">
          Tailwind CSS + Vite + React
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Build modern product surfaces at lightspeed.
        </h1>
        <p className="text-lg text-slate-300">
          Tailwind is now wired up. Edit <code className="rounded bg-slate-900 px-1.5 py-0.5">src/App.tsx</code>{' '}
          to start crafting components with utility classes.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10 p-8 shadow-xl shadow-black/40">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="transition-transform hover:-translate-y-1">
            <img src={viteLogo} className="h-16" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="transition-transform hover:-translate-y-1"
          >
            <img src={reactLogo} className="h-16" alt="React logo" />
          </a>
        </div>

        <button
          type="button"
          className="rounded-full bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          onClick={() => setCount((value) => value + 1)}
        >
          Count is {count}
        </button>
        <p className="text-sm text-slate-400">Hot Module Reloading is ready. Keep iterating.</p>
      </div>
    </div>
  )
}

export default App
