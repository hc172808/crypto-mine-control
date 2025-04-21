
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Server, LogIn, UserPlus, TrendingUp, Database, Activity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-background to-accent px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
                Mining Control
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
                Your complete mobile solution for mining management. Start, monitor, and optimize your mining tasks from anywhere.
              </p>
              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  size="lg"
                  className="px-8"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  variant="outline" 
                  size="lg"
                  className="px-8"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <Server className="mx-auto h-64 w-64 text-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Powerful Mining Management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform gives you the tools you need to manage your mining operations efficiently from your mobile device.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Remote Mining Control</h3>
              <p className="mt-2 text-muted-foreground">
                Start, pause, or stop mining tasks remotely from your mobile device.
              </p>
            </div>

            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-time Statistics</h3>
              <p className="mt-2 text-muted-foreground">
                Monitor hashrates, earnings, and mining efficiency in real time.
              </p>
            </div>

            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Performance Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                Track your mining performance over time with detailed analytics.
              </p>
            </div>

            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Secure Authentication</h3>
              <p className="mt-2 text-muted-foreground">
                Protect your mining operations with secure login and role-based access.
              </p>
            </div>

            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Admin Dashboard</h3>
              <p className="mt-2 text-muted-foreground">
                Administrators can manage users and monitor all mining operations.
              </p>
            </div>

            <div className="bg-card shadow-sm rounded-xl p-6 border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">User Management</h3>
              <p className="mt-2 text-muted-foreground">
                Add, remove, or modify user permissions and settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ready to start mining?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Create your account today and gain full control over your mining operations.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              onClick={() => navigate("/register")} 
              size="lg"
              className="px-8"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline" 
              size="lg"
              className="px-8"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Mining Control</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Mining Control. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
