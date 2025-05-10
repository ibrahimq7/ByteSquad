
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, BookOpen, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Mood', path: '/mood', icon: Calendar },
    { name: 'Assessment', path: '/assessment', icon: BarChart },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content - with extra bottom padding for nav bar */}
      <main className="flex-1 pb-20">
        <div className="h-full animate-enter-from-bottom">
          {children}
        </div>
      </main>

      {/* Fixed bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-2 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-md transition-all",
              isActive(item.path)
                ? "text-primary"
                : "text-gray-500"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5",
              isActive(item.path) && "animate-bounce-once"
            )} />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;
