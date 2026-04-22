'use client';

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { Profile } from '@/types/auth';
import { ReactNode, useEffect, useRef } from 'react';

export default function AuthStoreProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    useAuthStore.setState({ profile });
    isInitialized.current = true;
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      useAuthStore.getState().setUser(user);
      // We don't overwrite profile here if it is already handled synchronously on server SSR
    });
  }, []);

  return <>{children}</>;
}
