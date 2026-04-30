'use server';

import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  try {
    await getAuth().api.signInEmail({ body: { email, password } });
  } catch (e) {
    return { error: (e as Error).message ?? 'Invalid credentials' };
  }
  redirect('/dashboard');
}

export async function signupAction(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  try {
    await getAuth().api.signUpEmail({
      body: { email, password, name: email.split('@')[0] },
    });

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Sign up successful');
  } catch (e) {
    return { error: (e as Error).message ?? 'Sign up failed' };
  }
  redirect('/dashboard');
}
