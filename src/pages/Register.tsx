
import React from "react";
import { Navigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Mining Control</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to start mining
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
