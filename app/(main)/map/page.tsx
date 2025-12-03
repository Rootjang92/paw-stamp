export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">Map</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="h-full min-h-[500px] bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400">Map view will be displayed here</p>
        </div>
      </main>
    </div>
  );
}
