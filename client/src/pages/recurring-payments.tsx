import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { FileText, X } from "lucide-react";

export default function RecurringPayments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: payments, error } = useQuery({
    queryKey: ["/api/recurring-payments"],
    retry: false,
  });

  const cancelPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      await apiRequest("PATCH", `/api/recurring-payments/${paymentId}/status`, { status: "cancelled" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recurring-payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Subscription status updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update subscription status.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [error, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter payments
  const filteredPayments = Array.isArray(payments) ? payments.filter((payment: any) => {
    const categoryMatch = categoryFilter === "all" || payment.category === categoryFilter;
    const frequencyMatch = frequencyFilter === "all" || payment.frequency === frequencyFilter;
    const statusMatch = statusFilter === "all" || payment.status === statusFilter;
    return categoryMatch && frequencyMatch && statusMatch;
  }) : [];

  const handleCancelPayment = (paymentId: string) => {
    cancelPaymentMutation.mutate(paymentId);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Recurring Payments</h2>
        <p className="text-claude-gray-600">Manage your detected subscriptions and recurring charges.</p>
      </div>

      {/* Filters */}
      <Card className="bg-white rounded-xl border border-claude-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
              <SelectTrigger className="w-[180px]" data-testid="filter-frequency">
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscription List */}
      <Card className="bg-white rounded-xl border border-claude-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-claude-gray-900">Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPayments.length > 0 ? (
            <div className="divide-y divide-claude-gray-200">
              {filteredPayments.map((payment: any) => (
                <div key={payment.id} className="p-6 hover:bg-claude-gray-50 transition-colors" data-testid={`payment-${payment.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-claude-gray-900">{payment.merchantName}</h4>
                        <p className="text-claude-gray-600">{payment.category} • {payment.frequency}</p>
                        {payment.nextPaymentDate && (
                          <p className="text-sm text-claude-gray-500">
                            Next payment: {new Date(payment.nextPaymentDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-claude-gray-900">${payment.amount}</p>
                        <p className="text-sm text-claude-gray-600">per {payment.frequency}</p>
                      </div>
                      <Badge 
                        variant={payment.status === 'active' ? 'default' : 'secondary'}
                        className={payment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {payment.status === 'active' ? 'Active' : 'Cancelled'}
                      </Badge>
                      {payment.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelPayment(payment.id)}
                          disabled={cancelPaymentMutation.isPending}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          data-testid={`button-cancel-${payment.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-claude-gray-500">No subscriptions found with the current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
