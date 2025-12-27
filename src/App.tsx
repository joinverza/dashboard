import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MockDataProvider } from "@/contexts/MockDataContext";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import Layout from "@/components/layout/Layout";
import { PageLoader } from "@/components/shared/loaders/PageLoader";

// Lazy load pages for code splitting
const UserDashboard = lazy(() => import("@/features/user/pages/Dashboard"));
const VerifierDashboard = lazy(() => import("@/features/verifier/pages/Dashboard"));
const EnterpriseDashboard = lazy(() => import("@/features/enterprise/pages/Dashboard"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/Dashboard"));

const MessagePage = lazy(() => import("@/pages/Message"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const PlaceholderPage = lazy(() => import("@/pages/PlaceholderPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));

const MarketplacePage = lazy(() => import("@/pages/Marketplace"));
const WalletPage = lazy(() => import("@/pages/Wallet"));
const CredentialsPage = lazy(() => import("@/pages/Credentials"));
const VerifierProfilePage = lazy(() => import("@/pages/VerifierProfile"));

function Router() {
  const { user } = useAuth();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        
        {/* User Dashboard Routes */}
        {(user?.role === 'user' || !user) && (
          <>
            <Route path="/app" component={UserDashboard} />
            <Route path="/app/credentials" component={CredentialsPage} />
            <Route path="/app/marketplace" component={MarketplacePage} />
            <Route path="/app/verifier-profile/:id" component={VerifierProfilePage} />
            {/* Keeping store route for backward compatibility or direct access */}
            <Route path="/app/store" component={MarketplacePage} />
            <Route path="/app/analytics">
              <PlaceholderPage
                title="Analytics"
                description="View detailed analytics and insights"
              />
            </Route>
            <Route path="/app/wallet" component={WalletPage} />
            <Route path="/app/invoice">
              <PlaceholderPage
                title="Invoice"
                description="Create and manage invoices"
              />
            </Route>
            <Route path="/app/category">
              <PlaceholderPage
                title="Category"
                description="Organize your products into categories"
              />
            </Route>
            <Route path="/app/message" component={MessagePage} />
            <Route path="/app/settings" component={SettingsPage} />
          </>
        )}

        {/* Verifier Routes */}
        {user?.role === 'verifier' && (
          <>
            <Route path="/verifier" component={VerifierDashboard} />
            <Route path="/verifier/*" component={VerifierDashboard} />
          </>
        )}
        
        {/* Enterprise Routes */}
        {user?.role === 'enterprise' && (
          <>
            <Route path="/enterprise" component={EnterpriseDashboard} />
            <Route path="/enterprise/*" component={EnterpriseDashboard} />
          </>
        )}
        
        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/*" component={AdminDashboard} />
          </>
        )}

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MockDataProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Layout>
                <Router />
              </Layout>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </MockDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
