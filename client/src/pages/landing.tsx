import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function Landing() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Company Info */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-md">
          <div className="flex items-center mb-8" data-testid="logo-section">
            <div className="w-12 h-12 bg-claude-gray-700 rounded-lg flex items-center justify-center mr-4">
              <Brain className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-claude-gray-800">RecurringAI</h1>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-claude-gray-900 mb-6 leading-tight">
            Discover hidden subscriptions with AI-powered analysis
          </h2>
          <p className="text-claude-gray-600 text-lg leading-relaxed">
            Never forget about recurring payments again. Our intelligent system analyzes your bank statements to identify forgotten subscriptions and sends monthly reminders.
          </p>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="flex-1 bg-claude-gray-50 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <Card className="bg-white rounded-xl shadow-sm border border-claude-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-claude-gray-900">
                {isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-claude-gray-700 text-sm font-medium">Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-claude-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label className="text-claude-gray-700 text-sm font-medium">Password</Label>
                  <Input 
                    type="password" 
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    className="w-full px-4 py-3 border border-claude-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    data-testid="input-password"
                  />
                </div>
                {isSignUp && (
                  <div>
                    <Label className="text-claude-gray-700 text-sm font-medium">Confirm Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border border-claude-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      data-testid="input-confirm-password"
                    />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-claude-gray-700 text-white py-3 rounded-lg font-medium hover:bg-claude-gray-800 transition-colors"
                data-testid="button-submit"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
              
              <div className="text-center">
                <p className="text-claude-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors p-0"
                  data-testid="link-toggle-auth"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
