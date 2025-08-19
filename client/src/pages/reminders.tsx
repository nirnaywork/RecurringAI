import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

export default function Reminders() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [reminderSettings, setReminderSettings] = useState({
    frequency: "monthly",
    sendTime: "first_day",
    isActive: true
  });

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

  const { data: settings, error: settingsError } = useQuery({
    queryKey: ["/api/reminders"],
    retry: false,
  });

  const { data: history, error: historyError } = useQuery({
    queryKey: ["/api/reminder-history"],
    retry: false,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      await apiRequest("POST", "/api/reminders", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({
        title: "Success",
        description: "Reminder settings saved successfully.",
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
        description: "Failed to save reminder settings.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (settings && typeof settings === 'object') {
      setReminderSettings(settings as any);
    }
  }, [settings]);

  useEffect(() => {
    if ((settingsError && isUnauthorizedError(settingsError)) || 
        (historyError && isUnauthorizedError(historyError))) {
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
  }, [settingsError, historyError, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(reminderSettings);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Email Reminders</h2>
        <p className="text-claude-gray-600">Configure your subscription reminder preferences.</p>
      </div>

      {/* Reminder Settings */}
      <Card className="bg-white rounded-xl border border-claude-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-claude-gray-900">Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-claude-gray-900">Email Reminders</h4>
              <p className="text-sm text-claude-gray-600">Receive monthly emails about your subscriptions</p>
            </div>
            <Switch
              checked={reminderSettings.isActive}
              onCheckedChange={(checked) => 
                setReminderSettings(prev => ({ ...prev, isActive: checked }))
              }
              data-testid="switch-email-reminders"
            />
          </div>

          <div>
            <Label className="block text-claude-gray-700 text-sm font-medium mb-2">Reminder Frequency</Label>
            <Select 
              value={reminderSettings.frequency} 
              onValueChange={(value) => 
                setReminderSettings(prev => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger className="w-full" data-testid="select-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-claude-gray-700 text-sm font-medium mb-2">Send Time</Label>
            <Select 
              value={reminderSettings.sendTime} 
              onValueChange={(value) => 
                setReminderSettings(prev => ({ ...prev, sendTime: value }))
              }
            >
              <SelectTrigger className="w-full" data-testid="select-send-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_day">First day of month</SelectItem>
                <SelectItem value="last_day">Last day of month</SelectItem>
                <SelectItem value="15th">15th of month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending}
            className="bg-claude-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-claude-gray-800 transition-colors"
            data-testid="button-save-settings"
          >
            {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reminders */}
      <Card className="bg-white rounded-xl border border-claude-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-claude-gray-900">Recent Reminders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {Array.isArray(history) && history.length > 0 ? (
            <div className="divide-y divide-claude-gray-200">
              {history.map((reminder: any) => (
                <div key={reminder.id} className="p-6" data-testid={`reminder-${reminder.id}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-claude-gray-900">Monthly Subscription Reminder</h4>
                      <p className="text-sm text-claude-gray-600">
                        Sent {new Date(reminder.sentDate).toLocaleDateString()} at {new Date(reminder.sentDate).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-claude-gray-500 mt-1">
                        Included {reminder.subscriptionCount} active subscriptions worth ${reminder.totalAmount}
                      </p>
                    </div>
                    <Badge 
                      variant={reminder.status === 'delivered' ? 'default' : 'destructive'}
                      className={reminder.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {reminder.status === 'delivered' ? 'Delivered' : reminder.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-claude-gray-500">No reminder history available. Reminders will appear here once sent.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
