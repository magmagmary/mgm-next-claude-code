import { notFound } from 'next/navigation';
import { getNoteByPublicSlug } from '@/lib/notes';
import TipTapViewer from '@/app/components/TipTapViewer';

export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteByPublicSlug(slug);
  if (!note) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <a href="/" className="text-lg font-bold tracking-tight">
            magmag
          </a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {note.title}
        </h1>
        <div className="bg-white border border-gray-200 rounded-lg">
          <TipTapViewer contentJson={note.contentJson} />
        </div>
        <p className="mt-6 text-xs text-gray-400 text-center">
          Shared via magmag &mdash; read only
        </p>
      </main>
    </div>
  );
}
