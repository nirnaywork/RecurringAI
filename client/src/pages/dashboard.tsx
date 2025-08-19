import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Repeat, 
  DollarSign, 
  Calendar, 
  PiggyBank,
  Upload,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: stats, error: statsError } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: recentPayments, error: paymentsError } = useQuery({
    queryKey: ["/api/recurring-payments"],
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError)) {
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
  }, [statsError, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const recentThree = Array.isArray(recentPayments) ? recentPayments.slice(0, 3) : [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Welcome back!</h2>
        <p className="text-claude-gray-600">Here's your subscription overview for this month.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-claude-gray-600 text-sm font-medium">Total Subscriptions</p>
                <p className="text-2xl font-bold text-claude-gray-900" data-testid="stat-total-subscriptions">
                  {(stats as any)?.totalSubscriptions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Repeat className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-claude-gray-600 text-sm font-medium">Monthly Cost</p>
                <p className="text-2xl font-bold text-claude-gray-900" data-testid="stat-monthly-cost">
                  ${(stats as any)?.monthlyCost || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-claude-gray-600 text-sm font-medium">Yearly Cost</p>
                <p className="text-2xl font-bold text-claude-gray-900" data-testid="stat-yearly-cost">
                  ${(stats as any)?.yearlyCost || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-claude-gray-600 text-sm font-medium">Potential Savings</p>
                <p className="text-2xl font-bold text-emerald-600" data-testid="stat-potential-savings">
                  ${(stats as any)?.potentialSavings || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-claude-gray-900">Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentThree.length > 0 ? (
              <div className="space-y-4">
                {recentThree.map((subscription: any) => (
                  <div key={subscription.id} className="flex items-center justify-between" data-testid={`subscription-${subscription.id}`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-claude-gray-900">{subscription.merchantName}</p>
                        <p className="text-sm text-claude-gray-600">{subscription.frequency} • {subscription.category}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-claude-gray-900">${subscription.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-claude-gray-500 text-center py-8">No subscriptions detected yet. Upload bank statements to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-claude-gray-900">Quick Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-claude-gray-300 rounded-lg p-6 text-center">
              <Upload className="text-3xl text-claude-gray-400 mb-4 mx-auto" />
              <h4 className="text-lg font-medium text-claude-gray-900 mb-2">Upload Bank Statements</h4>
              <p className="text-claude-gray-600 mb-4">Drop your PDF, JPG, or PNG files here to analyze recurring payments</p>
              <Button 
                onClick={() => window.location.href = '/uploads'}
                className="bg-claude-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-claude-gray-800 transition-colors"
                data-testid="button-quick-upload"
              >
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
