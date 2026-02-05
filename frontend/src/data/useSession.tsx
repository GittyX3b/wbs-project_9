import { useContext } from 'react';

import { SessionCtx } from '@data';
import { type SessionContextType } from '@types';

export const useSession = (): SessionContextType => {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};
