import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { requireSession } from '@/lib/session';
import { getNoteById } from '@/lib/notes';
import EditNoteForm from './EditNoteForm';

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const note = getNoteById(session.user.id, id);
  if (!note) notFound();

  const hdrs = await headers();
  const host = hdrs.get('host') ?? 'localhost:3000';
  const origin = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <a href="/dashboard" className="text-lg font-bold tracking-tight">
            magmag
          </a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <EditNoteForm note={note} origin={origin} />
      </main>
    </div>
  );
}
