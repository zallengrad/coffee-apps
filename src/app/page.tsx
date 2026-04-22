import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get('user_profile')?.value;
  let profile = { name: 'User', role: 'admin' };
  
  if (profileCookie) {
    try {
      profile = JSON.parse(profileCookie);
    } catch (e) {
      // Ignored
    }
  }

  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">Welcome {profile.name}</h1>
      <Link href={`/${profile.role}`}>
        <Button className="bg-teal-500 text-white hover:bg-teal-600">Access Dashboard</Button>
      </Link>
    </div>
  );
}
