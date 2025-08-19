import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Bell, LogOut } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="bg-white border-b border-claude-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center" data-testid="header-logo">
          <div className="w-8 h-8 bg-claude-gray-700 rounded-lg flex items-center justify-center mr-3">
            <Brain className="text-white text-sm" />
          </div>
          <h1 className="text-xl font-semibold text-claude-gray-900">RecurringAI</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 text-claude-gray-500 hover:text-claude-gray-700 transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={(user as any)?.profileImageUrl || ""} />
              <AvatarFallback className="bg-claude-gray-300">
                {(user as any)?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-claude-gray-700 font-medium" data-testid="text-user-email">
              {(user as any)?.email || "user@example.com"}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-claude-gray-500 hover:text-claude-gray-700 transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
