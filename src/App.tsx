import { Switch, Route, Redirect } from "wouter";
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
const NotificationsPage = lazy(() => import("@/pages/Notifications"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const HelpCenterPage = lazy(() => import("@/pages/HelpCenter"));
const PlaceholderPage = lazy(() => import("@/pages/PlaceholderPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const LoginPage = lazy(() => import("@/pages/Login"));
const SignupPage = lazy(() => import("@/pages/Signup"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPassword"));

const MarketplacePage = lazy(() => import("@/pages/Marketplace"));
const WalletPage = lazy(() => import("@/pages/Wallet"));
const DepositPage = lazy(() => import("@/pages/Deposit"));
const WithdrawPage = lazy(() => import("@/pages/Withdraw"));
const TransactionDetailPage = lazy(() => import("@/pages/TransactionDetail"));
const TransactionStatusPage = lazy(() => import("@/pages/TransactionStatus"));
const CredentialsPage = lazy(() => import("@/pages/Credentials"));
const UploadCredentialPage = lazy(() => import("@/pages/UploadCredential"));
const CredentialDetailPage = lazy(() => import("@/pages/CredentialDetail"));
const VerificationStatusPage = lazy(() => import("@/pages/VerificationStatus"));
const RequestVerificationPage = lazy(() => import("@/pages/RequestVerification"));
const VerifierProfilePage = lazy(() => import("@/pages/VerifierProfile"));
const PaymentConfirmationPage = lazy(() => import("@/pages/PaymentConfirmation"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfService"));
const OnboardingPage = lazy(() => import("@/pages/Onboarding"));

function Router() {
  const { user } = useAuth();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsOfServicePage} />
        <Route path="/onboarding" component={OnboardingPage} />
        
        {/* User Dashboard Routes */}
        {user?.role === 'user' && (
          <>
            <Route path="/app" component={UserDashboard} />
            <Route path="/app/credentials" component={CredentialsPage} />
            <Route path="/app/credentials/:id" component={CredentialDetailPage} />
            <Route path="/app/payment/confirm" component={PaymentConfirmationPage} />
            <Route path="/app/verification-status" component={VerificationStatusPage} />
            <Route path="/app/verification-status/:id" component={VerificationStatusPage} />
            <Route path="/app/upload-credential" component={UploadCredentialPage} />
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
            <Route path="/app/wallet/deposit" component={DepositPage} />
            <Route path="/app/wallet/withdraw" component={WithdrawPage} />
            <Route path="/app/wallet/transactions/:id" component={TransactionDetailPage} />
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
            <Route path="/app/notifications" component={NotificationsPage} />
            <Route path="/app/settings" component={SettingsPage} />
            <Route path="/app/help" component={HelpCenterPage} />
            <Route path="/app/transaction-status/:id" component={TransactionStatusPage} />
            <Route path="/app/request-verification" component={RequestVerificationPage} />
          </>
        )}

        {/* Redirect unauthenticated users trying to access app */}
        <Route path="/app/:rest*">
          <Redirect to="/login" />
        </Route>

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
