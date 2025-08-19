import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import ExpenditureChart from "@/components/charts/expenditure-chart";

export default function ExpenditureBreakdown() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [timePeriod, setTimePeriod] = useState("monthly");

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

  // Process data for charts
  const activePayments = Array.isArray(payments) ? payments.filter((p: any) => p.status === 'active') : [];
  
  // Spending trend data
  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Spending',
      data: [120, 135, 142, 138, 145, 142],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  // Category breakdown
  const categoryTotals = activePayments.reduce((acc: any, payment: any) => {
    const category = payment.category || 'Other';
    acc[category] = (acc[category] || 0) + parseFloat(payment.amount);
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 0
    }]
  };

  const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]: [string, any]) => {
    const total = Object.values(categoryTotals).reduce((sum: number, val: any) => sum + val, 0);
    const percentage = total > 0 ? ((amount / total) * 100).toFixed(0) : 0;
    return { category, amount: amount.toFixed(2), percentage };
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Expenditure Breakdown</h2>
        <p className="text-claude-gray-600">Analyze your spending patterns and subscription costs.</p>
      </div>

      {/* Time Period Selection */}
      <Card className="bg-white rounded-xl border border-claude-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant={timePeriod === "monthly" ? "default" : "outline"}
              onClick={() => setTimePeriod("monthly")}
              className={timePeriod === "monthly" ? "bg-claude-gray-700 text-white" : ""}
              data-testid="button-monthly"
            >
              Monthly
            </Button>
            <Button 
              variant={timePeriod === "yearly" ? "default" : "outline"}
              onClick={() => setTimePeriod("yearly")}
              className={timePeriod === "yearly" ? "bg-claude-gray-700 text-white" : ""}
              data-testid="button-yearly"
            >
              Yearly
            </Button>
            <Button 
              variant={timePeriod === "custom" ? "default" : "outline"}
              onClick={() => setTimePeriod("custom")}
              className={timePeriod === "custom" ? "bg-claude-gray-700 text-white" : ""}
              data-testid="button-custom"
            >
              Custom Range
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Spending Chart */}
        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-claude-gray-900">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ExpenditureChart type="line" data={spendingData} />
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-claude-gray-900">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ExpenditureChart type="doughnut" data={categoryData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-white rounded-xl border border-claude-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-claude-gray-900">Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-4 bg-claude-gray-50 rounded-lg" data-testid={`category-${item.category}`}>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5] }}
                    ></div>
                    <span className="font-medium text-claude-gray-900 capitalize">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-claude-gray-900">${item.amount}</span>
                    <span className="text-sm text-claude-gray-600 ml-2">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-claude-gray-500 text-center py-8">No spending data available. Upload bank statements to see your breakdown.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
