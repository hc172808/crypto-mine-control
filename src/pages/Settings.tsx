
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Settings as SettingsIcon, Bell, Shield, Moon, Sun, Smartphone, Languages } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: {
      miningCompleted: true,
      miningFailed: true,
      newUpdates: false,
      promotions: false
    },
    appearance: {
      theme: "system", // system, light, dark
      compactMode: false,
      animationsEnabled: true
    },
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: "30min" // 15min, 30min, 1hour, 4hours
    },
    mining: {
      autoStart: false,
      powerSaving: true,
      autoStopOnBattery: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would update settings via an API call
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mining-completed" className="flex-1">
                Mining task completed
              </Label>
              <Switch 
                id="mining-completed" 
                checked={settings.notifications.miningCompleted}
                onCheckedChange={(checked) => 
                  handleSettingChange("notifications", "miningCompleted", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mining-failed" className="flex-1">
                Mining task failed
              </Label>
              <Switch 
                id="mining-failed" 
                checked={settings.notifications.miningFailed}
                onCheckedChange={(checked) => 
                  handleSettingChange("notifications", "miningFailed", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-updates" className="flex-1">
                New updates available
              </Label>
              <Switch 
                id="new-updates" 
                checked={settings.notifications.newUpdates}
                onCheckedChange={(checked) => 
                  handleSettingChange("notifications", "newUpdates", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="flex-1">
                Promotions and tips
              </Label>
              <Switch 
                id="promotions" 
                checked={settings.notifications.promotions}
                onCheckedChange={(checked) => 
                  handleSettingChange("notifications", "promotions", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.appearance.theme}
                onValueChange={(value) => 
                  handleSettingChange("appearance", "theme", value)
                }
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="flex-1">
                Compact mode
              </Label>
              <Switch 
                id="compact-mode" 
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) => 
                  handleSettingChange("appearance", "compactMode", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="flex-1">
                Enable animations
              </Label>
              <Switch 
                id="animations" 
                checked={settings.appearance.animationsEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("appearance", "animationsEnabled", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Manage your account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor" className="flex-1">
                Two-factor authentication
              </Label>
              <Switch 
                id="two-factor" 
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("security", "twoFactorEnabled", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="login-notifications" className="flex-1">
                Login notifications
              </Label>
              <Switch 
                id="login-notifications" 
                checked={settings.security.loginNotifications}
                onCheckedChange={(checked) => 
                  handleSettingChange("security", "loginNotifications", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session timeout</Label>
              <Select 
                value={settings.security.sessionTimeout}
                onValueChange={(value) => 
                  handleSettingChange("security", "sessionTimeout", value)
                }
              >
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                  <SelectItem value="4hours">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mining Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Mining Preferences</span>
            </CardTitle>
            <CardDescription>
              Configure how mining tasks behave on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start" className="flex-1">
                Auto-start mining on login
              </Label>
              <Switch 
                id="auto-start" 
                checked={settings.mining.autoStart}
                onCheckedChange={(checked) => 
                  handleSettingChange("mining", "autoStart", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="power-saving" className="flex-1">
                Power saving mode
              </Label>
              <Switch 
                id="power-saving" 
                checked={settings.mining.powerSaving}
                onCheckedChange={(checked) => 
                  handleSettingChange("mining", "powerSaving", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-stop-battery" className="flex-1">
                Auto-stop when on battery
              </Label>
              <Switch 
                id="auto-stop-battery" 
                checked={settings.mining.autoStopOnBattery}
                onCheckedChange={(checked) => 
                  handleSettingChange("mining", "autoStopOnBattery", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
