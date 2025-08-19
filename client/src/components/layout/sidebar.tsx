import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Repeat, 
  PieChart, 
  Upload, 
  Mail, 
  Info, 
  HelpCircle 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Recurring Payments", href: "/recurring-payments", icon: Repeat },
  { name: "Expenditure Breakdown", href: "/expenditure-breakdown", icon: PieChart },
  { name: "Your Uploads", href: "/uploads", icon: Upload },
  { name: "Reminders", href: "/reminders", icon: Mail },
  { name: "About Us", href: "/about", icon: Info },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-white border-r border-claude-gray-200 min-h-screen">
      <div className="p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-claude-gray-700 rounded-lg hover:bg-claude-gray-50 transition-colors",
                      isActive && "bg-claude-gray-100"
                    )}
                    data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
