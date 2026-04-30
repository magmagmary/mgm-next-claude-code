import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';
  if (!pathname.startsWith('/p/')) {
    const session = await getAuth().api.getSession({ headers: hdrs });
    if (!session) redirect('/login');
  }
  return <>{children}</>;
}
