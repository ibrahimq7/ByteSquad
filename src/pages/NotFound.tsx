
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NotFound = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    toast({
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist.",
      variant: "destructive",
    });
  }, [location.pathname, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mindease-blue/30 to-white p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-7xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
