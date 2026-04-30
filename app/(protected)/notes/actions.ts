'use server';

import { requireSession } from '@/lib/session';
import { createNote, updateNote, setNotePublic } from '@/lib/notes';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createNoteAction(formData: FormData) {
  const session = await requireSession();
  const title = (formData.get('title') as string).trim() || 'Untitled note';
  const contentJson = formData.get('content_json') as string;

  const note = createNote(session.user.id, { title, contentJson });
  redirect(`/notes/${note.id}`);
}

export async function updateNoteAction(formData: FormData) {
  const session = await requireSession();
  const noteId = formData.get('note_id') as string;
  const title = (formData.get('title') as string).trim() || 'Untitled note';
  const contentJson = formData.get('content_json') as string;
  updateNote(session.user.id, noteId, { title, contentJson });
  revalidatePath(`/notes/${noteId}`);
}

export async function toggleSharingAction(formData: FormData) {
  const session = await requireSession();
  const noteId = formData.get('note_id') as string;
  const isPublic = formData.get('is_public') === '1';
  setNotePublic(session.user.id, noteId, isPublic);
  revalidatePath(`/notes/${noteId}`);
}
