
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMining } from "@/contexts/MiningContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Wallet } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { userTasks } = useMining();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    walletAddress: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" // Example wallet address
  });

  const completedTasks = userTasks.filter(task => task.status === "completed");
  const totalEarned = completedTasks.reduce((sum, task) => sum + (task.actualReward || 0), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the profile via an API call
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.id || "user"}.png`} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <div className="flex justify-center mt-2">
                <Badge className="flex items-center gap-1 capitalize">
                  <Shield className="h-3 w-3" />
                  {user?.role || "user"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                <p>Tasks completed: {completedTasks.length}</p>
                <p>Total earned: {totalEarned.toFixed(5)} coins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className="flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet Address</span>
                </Label>
                <Input 
                  id="walletAddress" 
                  name="walletAddress" 
                  value={formData.walletAddress} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" disabled={!isEditing} />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!isEditing}
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
