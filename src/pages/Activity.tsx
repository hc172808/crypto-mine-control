
import React from "react";
import { useMining } from "@/contexts/MiningContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity as ActivityIcon, Play, Pause, CheckCircle2, XCircle } from "lucide-react";

const Activity = () => {
  const { userTasks } = useMining();

  // Generate fake activity logs based on user tasks
  const generateActivityLogs = () => {
    const logs = [];
    
    userTasks.forEach(task => {
      // Start log
      logs.push({
        id: `start-${task.id}`,
        action: "started",
        taskId: task.id,
        coinType: task.coinType,
        timestamp: task.startTime,
        status: "success"
      });
      
      // Generate random pauses (for some tasks)
      if (Math.random() > 0.7 && task.status !== "failed") {
        const pauseTime = new Date(new Date(task.startTime).getTime() + Math.random() * 1000 * 60 * 60);
        logs.push({
          id: `pause-${task.id}-${pauseTime.getTime()}`,
          action: "paused",
          taskId: task.id,
          coinType: task.coinType,
          timestamp: pauseTime.toISOString(),
          status: "warning"
        });
        
        // Resume after pause
        const resumeTime = new Date(pauseTime.getTime() + Math.random() * 1000 * 60 * 30);
        logs.push({
          id: `resume-${task.id}-${resumeTime.getTime()}`,
          action: "resumed",
          taskId: task.id,
          coinType: task.coinType,
          timestamp: resumeTime.toISOString(),
          status: "info"
        });
      }
      
      // End log (if completed or failed)
      if (task.status === "completed" || task.status === "failed") {
        logs.push({
          id: `end-${task.id}`,
          action: task.status === "completed" ? "completed" : "failed",
          taskId: task.id,
          coinType: task.coinType,
          timestamp: task.endTime || new Date().toISOString(),
          status: task.status === "completed" ? "success" : "error",
          reward: task.actualReward
        });
      }
    });
    
    // Sort by timestamp (newest first)
    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const activityLogs = generateActivityLogs();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "started":
        return <Play className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      case "resumed":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/20 text-success hover:bg-success/30";
      case "warning":
        return "bg-warning/20 text-warning hover:bg-warning/30";
      case "error":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30";
      case "info":
        return "bg-primary/20 text-primary hover:bg-primary/30";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mining Activity</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ActivityIcon className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start space-x-4 border-b pb-4 last:border-0"
                >
                  <div className={`p-2 rounded-full ${getStatusColor(log.status)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        Mining task 
                        <Badge variant="outline" className="ml-2">
                          {log.coinType}
                        </Badge> 
                        {log.action === "completed" && log.reward && (
                          <span className="text-success ml-2">
                            +{log.reward.toFixed(5)} earned
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Task {log.taskId.substring(0, 5)} was {log.action}
                    </p>
                  </div>
                </div>
              ))}
              
              {activityLogs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No activity recorded yet. Start mining to see your activity logs.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
