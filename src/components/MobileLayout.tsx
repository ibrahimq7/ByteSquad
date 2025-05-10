
import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart, BookOpen, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { useTheme } from '@/context/ThemeContext';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Mood', path: '/mood', icon: Calendar },
    { name: 'Test', path: '/assessment', icon: BarChart },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  // Handle the post-login flow
  useEffect(() => {
    // If user just logged in and hasn't completed onboarding, redirect to welcome
    const isOnboarded = localStorage.getItem('isOnboarded');
    
    if (currentUser && !isOnboarded && location.pathname !== '/welcome') {
      navigate('/welcome');
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <div className={cn("min-h-screen flex flex-col", 
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900')}>
      {/* Main content - with extra bottom padding for nav bar */}
      <main className="flex-1 pb-20">
        <div className="h-full animate-enter-from-bottom">
          {children}
        </div>
      </main>

      {/* Fixed bottom navigation bar */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 px-2 z-50 shadow-lg",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      )}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-md transition-all",
              isActive(item.path)
                ? theme === 'dark' ? "text-primary" : "text-primary"
                : theme === 'dark' ? "text-gray-400" : "text-gray-500"
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
