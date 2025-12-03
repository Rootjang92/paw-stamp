export default function StatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">Statistics</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Stamps</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Places Visited</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Distance</h3>
            <p className="text-3xl font-bold">0 km</p>
          </div>
        </div>
      </main>
    </div>
  );
}
