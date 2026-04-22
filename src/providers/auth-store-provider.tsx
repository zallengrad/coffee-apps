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
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      useAuthStore.getState().setUser(user);

      // Re-fetch profile from profiles table to get latest avatar_url
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbProfile) {
        useAuthStore.getState().setProfile(dbProfile as Profile);
      }
    });
  }, []);

  return <>{children}</>;
}
