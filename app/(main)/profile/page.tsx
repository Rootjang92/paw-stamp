export default function ProfilePage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
            <div>
              <h2 className="text-xl font-semibold">Username</h2>
              <p className="text-zinc-600 dark:text-zinc-400">user@example.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <p className="text-zinc-600 dark:text-zinc-400">User bio will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
