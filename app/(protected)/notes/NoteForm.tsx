"use client";

import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createNoteAction } from "./actions";

export default function NoteForm() {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contentReadyRef = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[320px] focus:outline-none p-4",
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    if (contentReadyRef.current) {
      contentReadyRef.current = false;
      return; // second call — let the form submit to the server action
    }
    e.preventDefault();
    if (!editor || !hiddenRef.current) return;
    hiddenRef.current.value = JSON.stringify(editor.getJSON());
    contentReadyRef.current = true;
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={createNoteAction} onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Note title"
        required
        autoFocus
        className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder-gray-300 mb-4"
      />

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50">
          {[
            { label: "B", title: "Bold", action: () => editor?.chain().focus().toggleBold().run(), active: () => !!editor?.isActive("bold") },
            { label: "I", title: "Italic", action: () => editor?.chain().focus().toggleItalic().run(), active: () => !!editor?.isActive("italic") },
            { label: "H1", title: "Heading 1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: () => !!editor?.isActive("heading", { level: 1 }) },
            { label: "H2", title: "Heading 2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => !!editor?.isActive("heading", { level: 2 }) },
            { label: "H3", title: "Heading 3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: () => !!editor?.isActive("heading", { level: 3 }) },
            { label: "•—", title: "Bullet list", action: () => editor?.chain().focus().toggleBulletList().run(), active: () => !!editor?.isActive("bulletList") },
            { label: "<>", title: "Inline code", action: () => editor?.chain().focus().toggleCode().run(), active: () => !!editor?.isActive("code") },
            { label: "```", title: "Code block", action: () => editor?.chain().focus().toggleCodeBlock().run(), active: () => !!editor?.isActive("codeBlock") },
            { label: "—", title: "Horizontal rule", action: () => editor?.chain().focus().setHorizontalRule().run(), active: () => false },
          ].map(({ label, title, action, active }) => (
            <button
              key={title}
              type="button"
              title={title}
              onClick={action}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                active()
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-200"
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
          Cancel
        </a>
        <button
          type="submit"
          className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Save note
        </button>
      </div>
    </form>
  );
}
