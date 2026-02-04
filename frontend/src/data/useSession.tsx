import { useContext } from 'react';

import { type SessionContextType, SessionCtx } from '@data';

export const useSession = (): SessionContextType => {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};
