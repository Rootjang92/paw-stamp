export default function StatsPage() {
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h3 className="mb-2 text-lg font-semibold">Total Stamps</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h3 className="mb-2 text-lg font-semibold">Places Visited</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h3 className="mb-2 text-lg font-semibold">Total Distance</h3>
          <p className="text-3xl font-bold">0 km</p>
        </div>
      </div>
    </main>
  );
}
