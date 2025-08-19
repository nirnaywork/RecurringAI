import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, Bell, Shield, EyeOff, Trash2 } from "lucide-react";

export default function About() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">About RecurringAI</h2>
        <p className="text-claude-gray-600">Learn more about our mission and how we help you manage subscriptions.</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-claude-gray-900 mb-4">Our Mission</h3>
            <p className="text-claude-gray-700 leading-relaxed mb-4">
              RecurringAI was created to solve a common problem: forgotten subscriptions that drain your bank account every month. 
              With the average person having 12+ active subscriptions, it's easy to lose track of recurring payments.
            </p>
            <p className="text-claude-gray-700 leading-relaxed">
              Our AI-powered platform analyzes your bank statements to identify patterns and detect recurring charges, 
              helping you regain control of your finances and save money by eliminating unwanted subscriptions.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-claude-gray-900 mb-4">How Our AI Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center" data-testid="step-upload">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-blue-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-claude-gray-900 mb-2">1. Upload Statements</h4>
                <p className="text-claude-gray-600">Upload your bank statements in PDF, JPG, or PNG format</p>
              </div>
              <div className="text-center" data-testid="step-analysis">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-green-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-claude-gray-900 mb-2">2. AI Analysis</h4>
                <p className="text-claude-gray-600">Our AI identifies patterns in merchant names, amounts, and frequencies</p>
              </div>
              <div className="text-center" data-testid="step-reminders">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="text-purple-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-claude-gray-900 mb-2">3. Get Reminders</h4>
                <p className="text-claude-gray-600">Receive monthly email reminders about your subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-claude-gray-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-claude-gray-900 mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex items-start" data-testid="security-local-storage">
                <Shield className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-claude-gray-900">Local Data Storage</h4>
                  <p className="text-claude-gray-600">All your data is stored locally on secure servers with encryption</p>
                </div>
              </div>
              <div className="flex items-start" data-testid="security-pattern-analysis">
                <EyeOff className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-claude-gray-900">Pattern Analysis Only</h4>
                  <p className="text-claude-gray-600">We analyze transaction patterns, not sensitive account details</p>
                </div>
              </div>
              <div className="flex items-start" data-testid="security-data-control">
                <Trash2 className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-claude-gray-900">Data Control</h4>
                  <p className="text-claude-gray-600">You can delete your data at any time from your account</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
