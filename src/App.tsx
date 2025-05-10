
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MobileLayout from "@/components/MobileLayout";

// Pages
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Assessment from "@/pages/Assessment";
import MoodTracker from "@/pages/MoodTracker";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import DailyTask from "@/pages/DailyTask";
import MoodCalendar from "@/pages/MoodCalendar";
import AssessmentHistory from "@/pages/AssessmentHistory";
import Welcome from "@/pages/Welcome";
import AssessmentResult from "@/pages/AssessmentResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Onboarding */}
                <Route
                  path="/welcome"
                  element={
                    <ProtectedRoute>
                      <Welcome />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Routes - All using MobileLayout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <Home />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <Assessment />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment-result"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <AssessmentResult />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mood"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <MoodTracker />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mood/calendar"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <MoodCalendar />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <Resources />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <Profile />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/daily-task"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <DailyTask />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment-history"
                  element={
                    <ProtectedRoute>
                      <MobileLayout>
                        <AssessmentHistory />
                      </MobileLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Route */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
