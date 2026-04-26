import NoteForm from "../NoteForm";

export default function NewNotePage() {
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
        <NoteForm />
      </main>
    </div>
  );
}
