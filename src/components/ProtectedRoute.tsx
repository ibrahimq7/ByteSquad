
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/signin' 
}: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!loading && !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
      });
    }
  }, [loading, currentUser, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Skeleton className="h-12 w-48 mb-4" />
        <Skeleton className="h-32 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-32 w-3/4 max-w-md" />
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
