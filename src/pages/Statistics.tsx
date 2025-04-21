
import React, { useState } from "react";
import { useMining } from "@/contexts/MiningContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Coins, TrendingUp, Clock } from "lucide-react";

const Statistics = () => {
  const { userTasks } = useMining();
  const [selectedView, setSelectedView] = useState("daily");

  // Prepare chart data
  const prepareChartData = () => {
    // Group by coin type
    const coinData = userTasks.reduce((acc, task) => {
      const coin = task.coinType || "Unknown";
      if (!acc[coin]) {
        acc[coin] = 0;
      }
      acc[coin] += task.actualReward || 0;
      return acc;
    }, {} as Record<string, number>);

    // Format for chart
    return Object.keys(coinData).map(coin => ({
      name: coin,
      value: parseFloat(coinData[coin].toFixed(5))
    }));
  };

  // Prepare hashrate data
  const prepareHashrateData = () => {
    const completedTasks = userTasks
      .filter(task => task.status === "completed")
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return completedTasks.map(task => ({
      name: new Date(task.startTime).toLocaleDateString(),
      hashrate: parseFloat(task.hashrate.toFixed(2)),
      algorithm: task.algorithm,
      coin: task.coinType
    }));
  };

  // Calculate statistics
  const totalEarned = userTasks
    .filter(task => task.status === "completed")
    .reduce((sum, task) => sum + (task.actualReward || 0), 0);
  
  const avgHashrate = userTasks.length 
    ? userTasks.reduce((sum, task) => sum + task.hashrate, 0) / userTasks.length 
    : 0;
  
  const totalMiningTime = userTasks
    .filter(task => task.endTime)
    .reduce((sum, task) => {
      const start = new Date(task.startTime).getTime();
      const end = new Date(task.endTime || new Date()).getTime();
      return sum + (end - start);
    }, 0);
  
  // Convert time to hours
  const totalHours = (totalMiningTime / (1000 * 60 * 60)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mining Statistics</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarned.toFixed(5)}</div>
            <p className="text-xs text-muted-foreground">
              Across all completed mining tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hashrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHashrate.toFixed(2)} H/s</div>
            <p className="text-xs text-muted-foreground">
              Across all mining tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mining Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} hours</div>
            <p className="text-xs text-muted-foreground">
              Time spent mining across all tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-[400px]">
          <TabsTrigger value="earnings">Earnings by Coin</TabsTrigger>
          <TabsTrigger value="hashrate">Hashrate History</TabsTrigger>
        </TabsList>
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} coins`, 'Earned']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Earned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hashrate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hashrate History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareHashrateData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} H/s`, 'Hashrate']} />
                    <Legend />
                    <Bar dataKey="hashrate" fill="#82ca9d" name="Hashrate (H/s)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
