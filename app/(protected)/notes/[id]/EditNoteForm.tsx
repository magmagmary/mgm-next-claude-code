'use client';

import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { updateNoteAction, toggleSharingAction } from '../actions';
import type { Note } from '@/lib/notes';

export default function EditNoteForm({
  note,
  origin,
}: {
  note: Note;
  origin: string;
}) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contentReadyRef = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: JSON.parse(note.contentJson),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] focus:outline-none p-4',
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    if (contentReadyRef.current) {
      contentReadyRef.current = false;
      return;
    }
    e.preventDefault();
    if (!editor || !hiddenRef.current) return;
    hiddenRef.current.value = JSON.stringify(editor.getJSON());
    contentReadyRef.current = true;
    formRef.current?.requestSubmit();
  }

  const publicUrl = `${origin}/p/${note.publicSlug}`;

  return (
    <div>
      <form ref={formRef} action={updateNoteAction} onSubmit={handleSubmit}>
        <input type="hidden" name="note_id" value={note.id} />
        <input
          name="title"
          type="text"
          defaultValue={note.title}
          placeholder="Note title"
          required
          autoFocus
          className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder-gray-300 mb-4"
        />

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50">
            {[
              {
                label: 'B',
                title: 'Bold',
                action: () => editor?.chain().focus().toggleBold().run(),
                active: () => !!editor?.isActive('bold'),
              },
              {
                label: 'I',
                title: 'Italic',
                action: () => editor?.chain().focus().toggleItalic().run(),
                active: () => !!editor?.isActive('italic'),
              },
              {
                label: 'H1',
                title: 'Heading 1',
                action: () =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                active: () => !!editor?.isActive('heading', { level: 1 }),
              },
              {
                label: 'H2',
                title: 'Heading 2',
                action: () =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                active: () => !!editor?.isActive('heading', { level: 2 }),
              },
              {
                label: 'H3',
                title: 'Heading 3',
                action: () =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                active: () => !!editor?.isActive('heading', { level: 3 }),
              },
              {
                label: '•—',
                title: 'Bullet list',
                action: () => editor?.chain().focus().toggleBulletList().run(),
                active: () => !!editor?.isActive('bulletList'),
              },
              {
                label: '<>',
                title: 'Inline code',
                action: () => editor?.chain().focus().toggleCode().run(),
                active: () => !!editor?.isActive('code'),
              },
              {
                label: '```',
                title: 'Code block',
                action: () => editor?.chain().focus().toggleCodeBlock().run(),
                active: () => !!editor?.isActive('codeBlock'),
              },
              {
                label: '—',
                title: 'Horizontal rule',
                action: () => editor?.chain().focus().setHorizontalRule().run(),
                active: () => false,
              },
            ].map(({ label, title, action, active }) => (
              <button
                key={title}
                type="button"
                title={title}
                onClick={action}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  active()
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <EditorContent editor={editor} />
        </div>

        <input ref={hiddenRef} type="hidden" name="content_json" />

        <div className="flex justify-end gap-3 mt-6">
          <a
            href="/dashboard"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </a>
          <button
            type="submit"
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>

      {/* Sharing */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Public sharing
        </h2>
        <form action={toggleSharingAction} className="flex items-center gap-3">
          <input type="hidden" name="note_id" value={note.id} />
          <input
            type="hidden"
            name="is_public"
            value={note.isPublic ? '0' : '1'}
          />
          <button
            type="submit"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              note.isPublic ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            title={note.isPublic ? 'Disable sharing' : 'Enable sharing'}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                note.isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">
            {note.isPublic
              ? 'Anyone with the link can view'
              : 'Only you can see this note'}
          </span>
        </form>

        {note.isPublic && note.publicSlug && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-gray-700 font-mono"
            />
            <CopyButton text={publicUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition-colors shrink-0"
    >
      Copy
    </button>
  );
}
