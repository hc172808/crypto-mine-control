
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMining } from "@/contexts/MiningContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MiningTaskCard } from "@/components/mining/MiningTaskCard";
import { Server, Activity, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { userTasks, getActiveTask } = useMining();
  const navigate = useNavigate();
  const activeTask = getActiveTask();

  // Get the most recent tasks (up to 3)
  const recentTasks = [...userTasks]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-medium">{user?.username}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mining</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTask ? "1 Task Running" : "No Active Tasks"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTask 
                ? `${activeTask.algorithm} @ ${activeTask.hashrate.toFixed(2)} H/s` 
                : "Start a new mining task to begin earning"}
            </p>
            <Button 
              onClick={() => navigate("/mining")} 
              variant="outline" 
              className="w-full mt-4"
            >
              {activeTask ? "Manage Tasks" : "Start Mining"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTasks
                .filter(task => task.status === "completed" && task.actualReward)
                .reduce((sum, task) => sum + (task.actualReward || 0), 0)
                .toFixed(5)} Coins
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {userTasks.filter(task => task.status === "completed").length} completed tasks
            </p>
            <Button 
              onClick={() => navigate("/statistics")} 
              variant="outline" 
              className="w-full mt-4"
            >
              View Statistics
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mining Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTasks.length} Tasks
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {userTasks.filter(task => task.status === "running" || task.status === "paused").length} active, {" "}
              {userTasks.filter(task => task.status === "completed").length} completed, {" "}
              {userTasks.filter(task => task.status === "failed").length} failed
            </p>
            <Button 
              onClick={() => navigate("/activity")} 
              variant="outline" 
              className="w-full mt-4"
            >
              View Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {recentTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8">Recent Mining Tasks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentTasks.map(task => (
              <MiningTaskCard key={task.id} taskId={task.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
