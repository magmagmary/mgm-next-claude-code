'use server';

import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await getAuth().api.signOut({ headers: await headers() });
  redirect('/login');
}
