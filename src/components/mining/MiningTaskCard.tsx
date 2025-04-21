
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMining } from "@/contexts/MiningContext";
import { Play, Pause, Settings, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type MiningTaskCardProps = {
  taskId: string;
};

export function MiningTaskCard({ taskId }: MiningTaskCardProps) {
  const { getTaskById, pauseMining, resumeMining, stopMining } = useMining();
  const task = getTaskById(taskId);

  if (!task) {
    return null;
  }

  const isRunning = task.status === "running";
  const isPaused = task.status === "paused";
  const isActive = isRunning || isPaused;
  const isCompleted = task.status === "completed";
  const isFailed = task.status === "failed";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Coins className="mr-2 h-4 w-4" />
            {task.coinType}
          </span>
          <Badge className={
            `${
              isRunning 
                ? "bg-success/20 text-success" 
                : isPaused 
                ? "bg-warning/20 text-warning" 
                : isCompleted 
                ? "bg-primary/20 text-primary" 
                : "bg-destructive/20 text-destructive"
            }`
          }>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Algorithm</span>
            <span className="font-medium">{task.algorithm}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Hash Rate</span>
            <span className="font-medium">{task.hashrate.toFixed(2)} H/s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Target Reward</span>
            <span className="font-medium">{task.targetReward.toFixed(5)} {task.coinType}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Start Time</span>
            <span className="font-medium">{new Date(task.startTime).toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">
              {isCompleted || isFailed ? "End Time" : "Estimated"}
            </span>
            <span className="font-medium">
              {task.endTime 
                ? new Date(task.endTime).toLocaleString() 
                : "Calculating..."}
            </span>
          </div>
          {isCompleted && task.actualReward && (
            <div className="flex flex-col col-span-2">
              <span className="text-muted-foreground">Actual Reward</span>
              <span className="font-medium text-lg text-primary">
                {task.actualReward.toFixed(5)} {task.coinType}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(task.progress)}%</span>
          </div>
          <Progress value={task.progress} />
        </div>
      </CardContent>
      
      {isActive && (
        <CardFooter className="gap-2">
          {isRunning ? (
            <Button 
              className="flex-1"
              variant="outline" 
              onClick={() => pauseMining(task.id)}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button 
              className="flex-1"
              variant="outline" 
              onClick={() => resumeMining(task.id)}
            >
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
          <Button 
            className="flex-1"
            variant="destructive" 
            onClick={() => stopMining(task.id)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
