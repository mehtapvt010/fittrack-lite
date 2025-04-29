import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMismatches, resolveMismatch } from '../api/mismatches';
import { toast } from 'sonner';               // shadcn-compatible toaster
import React from 'react';

const AlertCtx = createContext({ unread: 0 });

export const AlertProvider = ({ children }: React.PropsWithChildren) => {
  const qc = useQueryClient();
  const { data: mismatches = [] } = useQuery({
    queryKey: ['mismatches'],
    queryFn: fetchMismatches,
    refetchInterval: 10_000, // live refresh every 10 s
  });

  // pop toast on first appearance of new mismatch
  React.useEffect(() => {
    if (mismatches.length) {
      toast.warning(`Macro mismatch detected for ${mismatches[0].date}`, {
        action: {
          label: 'View',
          onClick: () => window.location.href = '/dashboard?tab=meals',
        },
      });
    }
  }, [mismatches.length]);

  return (
    <AlertCtx.Provider value={{ unread: mismatches.length }}>
      {children}
    </AlertCtx.Provider>
  );
};

export const useAlerts = () => useContext(AlertCtx);
