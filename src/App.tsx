import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MockDataProvider } from "@/contexts/MockDataContext";
import Layout from "@/components/layout/Layout";
import { PageLoader } from "@/components/shared/loaders/PageLoader";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const MessagePage = lazy(() => import("@/pages/Message"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const PlaceholderPage = lazy(() => import("@/pages/PlaceholderPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/store">
          <PlaceholderPage
            title="Store"
            description="Manage your store products and inventory"
          />
        </Route>
        <Route path="/analytics">
          <PlaceholderPage
            title="Analytics"
            description="View detailed analytics and insights"
          />
        </Route>
        <Route path="/wallet">
          <PlaceholderPage
            title="Wallet"
            description="Manage your wallet and transactions"
          />
        </Route>
        <Route path="/invoice">
          <PlaceholderPage
            title="Invoice"
            description="Create and manage invoices"
          />
        </Route>
        <Route path="/category">
          <PlaceholderPage
            title="Category"
            description="Organize your products into categories"
          />
        </Route>
        <Route path="/message" component={MessagePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
