import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RecurringPayments from "@/pages/recurring-payments";
import ExpenditureBreakdown from "@/pages/expenditure-breakdown";
import Uploads from "@/pages/uploads";
import Reminders from "@/pages/reminders";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Dashboard />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/dashboard">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Dashboard />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/recurring-payments">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <RecurringPayments />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/expenditure-breakdown">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <ExpenditureBreakdown />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/uploads">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Uploads />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/reminders">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Reminders />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/about">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <About />
                </main>
              </div>
            </div>
          </Route>
          <Route path="/faq">
            <div className="min-h-screen bg-claude-gray-50">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <FAQ />
                </main>
              </div>
            </div>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
