
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart, Book, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Assessment', path: '/assessment', icon: BarChart },
    { name: 'Mood Tracker', path: '/mood', icon: BarChart },
    { name: 'Resources', path: '/resources', icon: Book },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">MindEase</span>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-0">
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">MindEase</span>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetTrigger>
                  </div>
                </div>
                
                <div className="flex-1 px-6 py-4">
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center py-3 px-3 rounded-md transition-colors",
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="px-6 py-4 border-t mt-auto">
                  {currentUser && (
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {currentUser.displayName?.[0] || 'U'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{currentUser.displayName || 'User'}</p>
                          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full flex items-center justify-center"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {currentUser && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-1 px-3 rounded-md",
              isActive(item.path)
                ? "text-primary font-medium"
                : "text-gray-500"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
