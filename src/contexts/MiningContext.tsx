
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type CoinType = "Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin";

type MiningTask = {
  id: string;
  userId: string;
  status: "idle" | "running" | "paused" | "completed" | "failed";
  hashrate: number;
  startTime: string;
  endTime?: string;
  progress: number;
  algorithm: "SHA-256" | "Ethash" | "Scrypt" | "Solana-PoH" | "Equihash";
  coinType: CoinType;
  targetReward: number;
  actualReward?: number;
};

type UserRole = "admin" | "client";

type MiningContextType = {
  userTasks: MiningTask[];
  allTasks: MiningTask[] | null; // For admin use
  startMining: (algorithm: "SHA-256" | "Ethash" | "Scrypt" | "Solana-PoH" | "Equihash", coinType: CoinType, targetReward: number) => Promise<MiningTask>;
  pauseMining: (taskId: string) => void;
  resumeMining: (taskId: string) => void;
  stopMining: (taskId: string) => void;
  getTaskById: (taskId: string) => MiningTask | undefined;
  getActiveTask: () => MiningTask | undefined;
  getSystemHashrate: () => number;
  getSystemTasks: () => { active: number; completed: number; failed: number };
  getCoinAlgorithm: (coinType: CoinType) => "SHA-256" | "Ethash" | "Scrypt" | "Solana-PoH" | "Equihash";
};

// Define algorithm mapping for each coin
const coinAlgorithmMap: Record<CoinType, "SHA-256" | "Ethash" | "Scrypt" | "Solana-PoH" | "Equihash"> = {
  "Bitcoin": "SHA-256",
  "Ethereum": "Ethash",
  "Solana": "Solana-PoH",
  "Litecoin": "Scrypt",
  "Dogecoin": "Scrypt"
};

const MiningContext = createContext<MiningContextType | null>(null);

export const useMining = () => {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error("useMining must be used within a MiningProvider");
  }
  return context;
};

export const MiningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userTasks, setUserTasks] = useState<MiningTask[]>([]);
  const [allTasks, setAllTasks] = useState<MiningTask[] | null>(null);
  
  // Load saved tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        // Load user-specific tasks
        if (user) {
          const savedUserTasks = localStorage.getItem(`miningTasks_${user.id}`);
          if (savedUserTasks) {
            setUserTasks(JSON.parse(savedUserTasks));
          }
        }
        
        // Load all tasks for admin
        if (user?.role === "admin") {
          const savedAllTasks = localStorage.getItem("miningTasks_all");
          if (savedAllTasks) {
            setAllTasks(JSON.parse(savedAllTasks));
          }
        }
      } catch (error) {
        console.error("Failed to load mining tasks:", error);
      }
    };
    
    loadTasks();
  }, [user]);
  
  // Update tasks periodically to simulate mining progress
  useEffect(() => {
    if (!userTasks.length) return;
    
    const updateInterval = setInterval(() => {
      setUserTasks(prev => {
        const updated = prev.map(task => {
          if (task.status === "running") {
            const newProgress = Math.min(task.progress + Math.random() * 2, 100);
            const isCompleted = newProgress >= 100;
            
            return {
              ...task,
              progress: newProgress,
              status: isCompleted ? "completed" as const : "running" as const,
              hashrate: task.hashrate + (Math.random() * 5 - 2.5), // Slight fluctuation
              endTime: isCompleted ? new Date().toISOString() : undefined,
              actualReward: isCompleted ? task.targetReward * (0.8 + Math.random() * 0.4) : undefined
            } as MiningTask;
          }
          return task;
        });
        
        // Save updated tasks
        if (user) {
          localStorage.setItem(`miningTasks_${user.id}`, JSON.stringify(updated));
        }
        
        return updated;
      });
    }, 3000);
    
    return () => clearInterval(updateInterval);
  }, [userTasks, user]);
  
  // Sync all tasks for admin view
  useEffect(() => {
    if (user?.role === "admin") {
      // Simulate fetching all users' tasks
      const mockAllTasks: MiningTask[] = [
        ...userTasks,
        // Add some mock tasks from other users with various coins
        {
          id: "mock1",
          userId: "user1",
          status: "running",
          hashrate: 245.6,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          progress: 78,
          algorithm: "SHA-256",
          coinType: "Bitcoin",
          targetReward: 0.05
        },
        {
          id: "mock2",
          userId: "user2",
          status: "completed",
          hashrate: 187.3,
          startTime: new Date(Date.now() - 7200000).toISOString(),
          endTime: new Date(Date.now() - 1800000).toISOString(),
          progress: 100,
          algorithm: "Ethash",
          coinType: "Ethereum",
          targetReward: 0.08,
          actualReward: 0.074
        },
        {
          id: "mock3",
          userId: "user3",
          status: "failed",
          hashrate: 0,
          startTime: new Date(Date.now() - 5400000).toISOString(),
          endTime: new Date(Date.now() - 4800000).toISOString(),
          progress: 23,
          algorithm: "Scrypt",
          coinType: "Dogecoin",
          targetReward: 0.03
        },
        {
          id: "mock4",
          userId: "user4",
          status: "running",
          hashrate: 320.8,
          startTime: new Date(Date.now() - 1200000).toISOString(),
          progress: 35,
          algorithm: "Solana-PoH",
          coinType: "Solana",
          targetReward: 0.12
        }
      ];
      
      setAllTasks(mockAllTasks);
      localStorage.setItem("miningTasks_all", JSON.stringify(mockAllTasks));
    }
  }, [userTasks, user?.role]);
  
  const getCoinAlgorithm = (coinType: CoinType) => {
    return coinAlgorithmMap[coinType];
  };
  
  const startMining = async (algorithm: "SHA-256" | "Ethash" | "Scrypt" | "Solana-PoH" | "Equihash", coinType: CoinType, targetReward: number): Promise<MiningTask> => {
    if (!user) {
      throw new Error("User must be logged in to start mining");
    }
    
    // Check if user has permission to mine based on role
    if (user.role !== "admin" && user.role !== "client") {
      throw new Error("User does not have permission to start mining tasks");
    }
    
    // Simulate starting a mining task
    const newTask: MiningTask = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      status: "running",
      hashrate: 150 + Math.random() * 100,
      startTime: new Date().toISOString(),
      progress: 0,
      algorithm,
      coinType,
      targetReward
    };
    
    setUserTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem(`miningTasks_${user.id}`, JSON.stringify(updated));
      return updated;
    });
    
    return newTask;
  };
  
  const pauseMining = (taskId: string) => {
    setUserTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId && task.status === "running" 
          ? { ...task, status: "paused" as const } 
          : task
      );
      
      if (user) {
        localStorage.setItem(`miningTasks_${user.id}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  };
  
  const resumeMining = (taskId: string) => {
    setUserTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId && task.status === "paused" 
          ? { ...task, status: "running" as const } 
          : task
      );
      
      if (user) {
        localStorage.setItem(`miningTasks_${user.id}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  };
  
  const stopMining = (taskId: string) => {
    setUserTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId && (task.status === "running" || task.status === "paused")
          ? { 
              ...task, 
              status: "completed" as const, 
              endTime: new Date().toISOString(),
              actualReward: task.progress / 100 * task.targetReward
            } 
          : task
      );
      
      if (user) {
        localStorage.setItem(`miningTasks_${user.id}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  };
  
  const getTaskById = (taskId: string) => {
    return userTasks.find(task => task.id === taskId);
  };
  
  const getActiveTask = () => {
    return userTasks.find(task => task.status === "running" || task.status === "paused");
  };
  
  const getSystemHashrate = () => {
    // Calculate total hashrate across all tasks (admin view)
    if (!allTasks) return 0;
    
    return allTasks
      .filter(task => task.status === "running")
      .reduce((sum, task) => sum + task.hashrate, 0);
  };
  
  const getSystemTasks = () => {
    if (!allTasks) {
      return { active: 0, completed: 0, failed: 0 };
    }
    
    return {
      active: allTasks.filter(task => task.status === "running" || task.status === "paused").length,
      completed: allTasks.filter(task => task.status === "completed").length,
      failed: allTasks.filter(task => task.status === "failed").length
    };
  };
  
  return (
    <MiningContext.Provider value={{
      userTasks,
      allTasks,
      startMining,
      pauseMining,
      resumeMining,
      stopMining,
      getTaskById,
      getActiveTask,
      getSystemHashrate,
      getSystemTasks,
      getCoinAlgorithm
    }}>
      {children}
    </MiningContext.Provider>
  );
};
