import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthStoreProvider from '@/providers/auth-store-provider';
import { cookies } from 'next/headers';
import ReactQueryProvider from '@/providers/react-query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  let profile = JSON.parse(cookiesStore.get('user_profile')?.value ?? '{}');

  if (!profile.role) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (dbProfile) {
        profile = dbProfile;
      } else {
        // Fallback: use Supabase auth user_metadata
        profile = {
          id: user.id,
          name: user.user_metadata?.name ?? user.email ?? '',
          role: user.user_metadata?.role ?? 'admin',
          avatar_url: user.user_metadata?.avatar_url ?? '',
        };
      }
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthStoreProvider profile={profile}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
