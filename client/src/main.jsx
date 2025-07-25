import { StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Routes.jsx';
import AuthProvider, { AuthContext } from './context/AuthProvider.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './context/SocketContext.jsx';

const queryClient = new QueryClient();

// Wrapper component to inject userEmail into SocketProvider
const WithSocket = ({ children }) => {
  const { backendUser } = useContext(AuthContext); // get Firebase user from context
  const userEmail = backendUser?.email;

  return <SocketProvider userEmail={userEmail}>{children}</SocketProvider>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WithSocket>
            <RouterProvider router={router} />
          </WithSocket>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
