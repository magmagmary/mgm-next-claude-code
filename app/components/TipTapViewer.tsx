'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TipTapViewer({ contentJson }: { contentJson: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: JSON.parse(contentJson),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4',
      },
    },
  });

  return <EditorContent editor={editor} />;
}
