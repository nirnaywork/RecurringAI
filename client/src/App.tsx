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
import React, { useState } from "react";
import EmailAuth from "./components/EmailAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading or not authenticated, show only the Landing page.
  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If authenticated, show the full application layout with routes.
  return (
    <div className="flex flex-col min-h-screen bg-claude-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/recurring-payments" component={RecurringPayments} />
            <Route path="/expenditure-breakdown" component={ExpenditureBreakdown} />
            <Route path="/uploads" component={Uploads} />
            <Route path="/reminders" component={Reminders} />
            <Route path="/about" component={About} />
            <Route path="/faq" component={FAQ} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null); // This state isn't used by the Router, but it's here for your EmailAuth component.

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/*
          Your original code had this logic inside the Router,
          but it's better to manage the authentication state at the top level.
          We'll use a placeholder for now to handle the Replit Auth flow.
        */}
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}