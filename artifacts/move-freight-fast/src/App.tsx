import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { RootLayout } from '@/components/layout/RootLayout';
import { Home } from '@/pages/home';
import { About } from '@/pages/about';
import { Services } from '@/pages/services';
import { Contact } from '@/pages/contact';
import { Track } from '@/pages/track';
import { CreateShipment } from '@/pages/create-shipment';
import { Admin } from '@/pages/admin';
import { Receipt } from '@/pages/receipt';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Receipt page — standalone, no navbar/footer */}
      <Route path="/receipt/:trackingId" component={Receipt} />

      {/* All other pages — wrapped in site layout */}
      <Route>
        <RootLayout>
          <RoutedErrorBoundary>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/contact" component={Contact} />
              <Route path="/track" component={Track} />
              <Route path="/ship" component={CreateShipment} />
              <Route path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </RoutedErrorBoundary>
        </RootLayout>
      </Route>
    </Switch>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
