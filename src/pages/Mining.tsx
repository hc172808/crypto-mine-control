
import React, { useState } from "react";
import { useMining } from "@/contexts/MiningContext";
import { MiningTaskCard } from "@/components/mining/MiningTaskCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Mining = () => {
  const { userTasks, startMining, getCoinAlgorithm } = useMining();
  const [isStarting, setIsStarting] = useState(false);
  const [coinType, setCoinType] = useState<"Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin">("Bitcoin");
  const [targetReward, setTargetReward] = useState("0.05");
  
  // Group tasks by status
  const activeTasks = userTasks.filter(task => 
    task.status === "running" || task.status === "paused"
  );
  
  const completedTasks = userTasks.filter(task => 
    task.status === "completed" || task.status === "failed"
  );

  const handleStartMining = async () => {
    setIsStarting(true);
    try {
      const algorithm = getCoinAlgorithm(coinType);
      await startMining(algorithm, coinType, parseFloat(targetReward));
      toast({
        title: "Mining started",
        description: `Started mining ${coinType} with ${algorithm} algorithm.`
      });
    } catch (error) {
      console.error("Failed to start mining:", error);
      toast({
        title: "Failed to start mining",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mining Tasks</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start New Mining Task</CardTitle>
          <CardDescription>
            Configure your mining parameters and start earning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Coin to Mine</Label>
              <Select
                value={coinType}
                onValueChange={(value) => setCoinType(value as any)}
              >
                <SelectTrigger id="coin">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="Ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="Solana">Solana (SOL)</SelectItem>
                  <SelectItem value="Litecoin">Litecoin (LTC)</SelectItem>
                  <SelectItem value="Dogecoin">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Algorithm: {getCoinAlgorithm(coinType)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Reward</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                min="0.01"
                value={targetReward}
                onChange={(e) => setTargetReward(e.target.value)}
                placeholder="0.05"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartMining} 
            disabled={isStarting || activeTasks.length > 0}
            className="w-full flex items-center"
          >
            {isStarting ? (
              <>
                <Server className="mr-2 h-4 w-4 animate-pulse" />
                Starting Mining...
              </>
            ) : activeTasks.length > 0 ? (
              <>
                <Server className="mr-2 h-4 w-4" />
                Complete Active Task First
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Start Mining {coinType}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {activeTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Tasks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTasks.map(task => (
              <MiningTaskCard key={task.id} taskId={task.id} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Tasks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .slice(0, 6) // Show only the 6 most recent completed tasks
              .map(task => (
                <MiningTaskCard key={task.id} taskId={task.id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mining;
