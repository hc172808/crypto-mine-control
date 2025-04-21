
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMining } from "@/contexts/MiningContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Navigate } from "react-router-dom";
import { Database, TrendingUp, Activity, Server, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { allTasks, getSystemHashrate, getSystemTasks } = useMining();
  const navigate = useNavigate();
  
  // Only admin can access this page
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  const systemHashrate = getSystemHashrate();
  const taskCounts = getSystemTasks();
  
  // Calculate earnings and stats
  const totalEarnings = allTasks ? 
    allTasks
      .filter(task => task.status === "completed" && task.actualReward)
      .reduce((sum, task) => sum + (task.actualReward || 0), 0) : 0;
  
  // Get user counts
  const uniqueUserIds = allTasks ? 
    [...new Set(allTasks.map(task => task.userId))] : [];
  
  // Active users are those with running or paused tasks
  const activeUserIds = allTasks ?
    [...new Set(
      allTasks
        .filter(task => task.status === "running" || task.status === "paused")
        .map(task => task.userId)
    )] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Administrator</p>
          <p className="font-medium">{user?.username}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Hashrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHashrate.toFixed(2)} H/s</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {taskCounts.active} active mining tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUserIds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {uniqueUserIds.length} total users
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Usage</span>
                <span>{Math.round((activeUserIds.length / Math.max(uniqueUserIds.length, 1)) * 100)}%</span>
              </div>
              <Progress value={(activeUserIds.length / Math.max(uniqueUserIds.length, 1)) * 100} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed tasks ({taskCounts.failed} failed)
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Success Rate</span>
                <span>
                  {Math.round((taskCounts.completed / Math.max(taskCounts.completed + taskCounts.failed, 1)) * 100)}%
                </span>
              </div>
              <Progress 
                value={(taskCounts.completed / Math.max(taskCounts.completed + taskCounts.failed, 1)) * 100} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(5)} Coins</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {taskCounts.completed} completed tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {allTasks && allTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8">Active Mining Tasks</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Algorithm
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Hashrate
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Progress
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Target
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {allTasks
                  .filter(task => task.status === "running" || task.status === "paused")
                  .sort((a, b) => b.hashrate - a.hashrate)
                  .map(task => (
                    <tr key={task.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground">
                        {task.userId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        {task.algorithm}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        {task.hashrate.toFixed(2)} H/s
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{Math.round(task.progress)}%</span>
                          </div>
                          <Progress value={task.progress} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        {task.targetReward.toFixed(5)} Coins
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={
                          `text-xs px-2 py-1 rounded-full ${
                            task.status === "running" 
                              ? "bg-success/20 text-success" 
                              : "bg-warning/20 text-warning"
                          }`
                        }>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
