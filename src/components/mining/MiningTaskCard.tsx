
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, PauseCircle, StopCircle, Settings } from "lucide-react";

interface MiningTaskCardProps {
  task: {
    id: string;
    title: string;
    coin: string;
    status: "running" | "paused" | "stopped";
    hashrate: number;
    estimatedRewards: number;
    progress: number;
  };
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
  onSettings: (id: string) => void;
}

export const MiningTaskCard = ({
  task,
  onStart,
  onPause,
  onStop,
  onSettings,
}: MiningTaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500 text-white";
      case "paused":
        return "bg-yellow-500 text-white";
      case "stopped":
        return "bg-gray-500 text-white";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
          <Badge variant="default">
            {task.coin}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Hashrate:</span>
          <span>{task.hashrate} H/s</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Est. Rewards:</span>
          <span>
            {task.estimatedRewards} {task.coin}/day
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          {task.status === "running" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(task.id)}
              className="flex-1"
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStart(task.id)}
              className="flex-1"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStop(task.id)}
            className="flex-1"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Stop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettings(task.id)}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Config
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
