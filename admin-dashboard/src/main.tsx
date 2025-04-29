import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertProvider } from './context/AlertContext.tsx'
import { Toaster } from 'sonner' // shadcn-compatible toaster

const qc = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
      <AlertProvider>
        <App />
        <Toaster richColors closeButton position="top-right" />
      </AlertProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)

export const queryClient = new QueryClient();
