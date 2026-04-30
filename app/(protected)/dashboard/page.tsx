import Link from 'next/link';
import { getSession } from '@/lib/session';
import { getNotesByUser } from '@/lib/notes';
import { logoutAction } from './actions';

export default async function DashboardPage() {
  const session = await getSession();
  const notes = getNotesByUser(session!.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">magmag</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{session?.user.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">My notes</h1>
          <Link
            href="/notes/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            New note
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-400 text-sm">No notes yet.</p>
            <Link
              href="/notes/new"
              className="mt-3 text-sm text-gray-900 font-medium hover:underline"
            >
              Create your first note
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-black truncate">
                    {note.title}
                  </span>
                  <span className="text-xs text-gray-400 ml-4 shrink-0">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
