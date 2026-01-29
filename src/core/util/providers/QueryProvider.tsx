import { useMemo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

let queryClientSingleton: QueryClient | null = null;

const getQueryClient = () => {
  if (!queryClientSingleton) {
    queryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 12 * 60 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchOnMount: false,
        },
        mutations: {
          retry: 0,
        },
      },
    });

    queryClientSingleton.getQueryCache().subscribe((event) => {
      if (event?.type === 'removed' && event.query.queryKey[0] === 'images') {
        const blobUrl = event.query.state.data;
        if (blobUrl && typeof blobUrl === 'string' && blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blobUrl);
        }
      }
    });
  }

  return queryClientSingleton;
};

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = useMemo(() => getQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export { getQueryClient as queryClient };
