
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import * as bip39 from "bip39";

// Adding bip39 dependency
<lov-add-dependency>bip39@3.1.0</lov-add-dependency>

type CoinType = "Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin";

export type Wallet = {
  id: string;
  userId: string;
  name: string;
  address: string;
  type: CoinType;
  balance: number;
  isDefault: boolean;
  createdAt: string;
};

export type Transaction = {
  id: string;
  fromWalletId: string;
  toWalletId?: string;
  toAddress?: string;
  amount: number;
  coinType: CoinType;
  status: "pending" | "completed" | "failed";
  fee: number;
  timestamp: string;
  type: "send" | "receive" | "convert";
};

type WalletContextType = {
  wallets: Wallet[];
  transactions: Transaction[];
  recoveryPhrase: string | null;
  setRecoveryPhrase: (phrase: string | null) => void;
  generateWallet: (name: string, type: CoinType) => Promise<Wallet>;
  getWalletById: (id: string) => Wallet | undefined;
  sendCoins: (fromWalletId: string, toAddress: string, amount: number) => Promise<Transaction>;
  convertCoins: (fromWalletId: string, toType: CoinType, amount: number) => Promise<Transaction>;
  getTransactionById: (id: string) => Transaction | undefined;
  getWalletTransactions: (walletId: string) => Transaction[];
  createRecoveryPhrase: () => string;
  restoreWallets: (recoveryPhrase: string) => Promise<Wallet[]>;
  addExternalWallet: (name: string, address: string, type: CoinType) => Promise<Wallet>;
  setDefaultWallet: (walletId: string) => void;
  getDefaultWallet: (type?: CoinType) => Wallet | undefined;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// Exchange rates between coins (simplified for demo)
const exchangeRates: Record<CoinType, Record<CoinType, number>> = {
  Bitcoin: {
    Bitcoin: 1,
    Ethereum: 15.2,
    Solana: 440,
    Litecoin: 220,
    Dogecoin: 12500
  },
  Ethereum: {
    Bitcoin: 0.066,
    Ethereum: 1,
    Solana: 29,
    Litecoin: 14.5,
    Dogecoin: 823
  },
  Solana: {
    Bitcoin: 0.0023,
    Ethereum: 0.035,
    Solana: 1,
    Litecoin: 0.5,
    Dogecoin: 28.5
  },
  Litecoin: {
    Bitcoin: 0.0046,
    Ethereum: 0.069,
    Solana: 2,
    Litecoin: 1,
    Dogecoin: 57
  },
  Dogecoin: {
    Bitcoin: 0.00008,
    Ethereum: 0.0012,
    Solana: 0.035,
    Litecoin: 0.0175,
    Dogecoin: 1
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);

  // Load wallets and transactions from localStorage
  useEffect(() => {
    if (user) {
      try {
        const savedWallets = localStorage.getItem(`wallets_${user.id}`);
        if (savedWallets) {
          setWallets(JSON.parse(savedWallets));
        }

        const savedTransactions = localStorage.getItem(`transactions_${user.id}`);
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error("Failed to load wallet data:", error);
      }
    } else {
      // Clear wallets if no user is logged in
      setWallets([]);
      setTransactions([]);
    }
  }, [user]);

  // Save wallets and transactions to localStorage whenever they change
  useEffect(() => {
    if (user && wallets.length > 0) {
      localStorage.setItem(`wallets_${user.id}`, JSON.stringify(wallets));
    }
  }, [user, wallets]);

  useEffect(() => {
    if (user && transactions.length > 0) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [user, transactions]);

  // Generate a recovery phrase using BIP39
  const createRecoveryPhrase = (): string => {
    const phrase = bip39.generateMnemonic(256); // 24 words
    return phrase;
  };

  // Restore wallets from a recovery phrase
  const restoreWallets = async (phrase: string): Promise<Wallet[]> => {
    if (!user) {
      throw new Error("User must be logged in to restore wallets");
    }

    // For demo purposes, we're just validating that the phrase is valid BIP39
    if (!bip39.validateMnemonic(phrase)) {
      throw new Error("Invalid recovery phrase");
    }

    // In a real app, we would derive addresses from the seed phrase
    // Here we're just generating mock wallets for demonstration
    const mockWallets: Wallet[] = [
      createMockWallet("Bitcoin Wallet", "Bitcoin", true),
      createMockWallet("Ethereum Wallet", "Ethereum", false),
      createMockWallet("Solana Wallet", "Solana", false)
    ];

    setWallets(mockWallets);
    localStorage.setItem(`wallets_${user.id}`, JSON.stringify(mockWallets));
    
    toast({
      title: "Wallets Restored",
      description: `Successfully restored ${mockWallets.length} wallets.`
    });

    return mockWallets;
  };

  // Helper to create a mock wallet
  const createMockWallet = (name: string, type: CoinType, isDefault: boolean): Wallet => {
    if (!user) {
      throw new Error("User must be logged in to create a wallet");
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      name,
      address: `0x${Math.random().toString(36).substring(2, 40)}`,
      type,
      balance: Math.random() * (type === "Bitcoin" ? 2 : type === "Ethereum" ? 10 : 100),
      isDefault,
      createdAt: new Date().toISOString()
    };
  };

  // Generate a new wallet
  const generateWallet = async (name: string, type: CoinType): Promise<Wallet> => {
    if (!user) {
      throw new Error("User must be logged in to create a wallet");
    }

    // Check if a default wallet should be set
    const isDefault = wallets.filter(w => w.type === type).length === 0;

    // Create wallet
    const newWallet: Wallet = createMockWallet(name, type, isDefault);

    setWallets(prev => {
      const updated = [...prev, newWallet];
      return updated;
    });

    toast({
      title: "Wallet Created",
      description: `Your new ${type} wallet has been created.`
    });

    return newWallet;
  };

  // Add an external wallet (existing address)
  const addExternalWallet = async (name: string, address: string, type: CoinType): Promise<Wallet> => {
    if (!user) {
      throw new Error("User must be logged in to add a wallet");
    }

    // Check if a default wallet should be set
    const isDefault = wallets.filter(w => w.type === type).length === 0;

    // Create wallet with external address
    const newWallet: Wallet = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      name,
      address,
      type,
      balance: 0, // External wallets start with 0 balance since we can't know the real balance
      isDefault,
      createdAt: new Date().toISOString()
    };

    setWallets(prev => {
      const updated = [...prev, newWallet];
      return updated;
    });

    toast({
      title: "Wallet Added",
      description: `External ${type} wallet has been added.`
    });

    return newWallet;
  };

  // Set a wallet as the default for its type
  const setDefaultWallet = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) {
      toast({
        title: "Error",
        description: "Wallet not found.",
        variant: "destructive"
      });
      return;
    }

    setWallets(prev => {
      return prev.map(w => {
        if (w.type === wallet.type) {
          return {
            ...w,
            isDefault: w.id === walletId
          };
        }
        return w;
      });
    });

    toast({
      title: "Default Wallet Updated",
      description: `${wallet.name} is now your default ${wallet.type} wallet.`
    });
  };

  // Get the default wallet for a specific coin type or any type
  const getDefaultWallet = (type?: CoinType): Wallet | undefined => {
    if (type) {
      return wallets.find(w => w.type === type && w.isDefault);
    }
    // If no type specified, return any default wallet
    return wallets.find(w => w.isDefault);
  };

  // Get a wallet by ID
  const getWalletById = (id: string): Wallet | undefined => {
    return wallets.find(wallet => wallet.id === id);
  };

  // Send coins from one wallet to another address
  const sendCoins = async (fromWalletId: string, toAddress: string, amount: number): Promise<Transaction> => {
    const fromWallet = getWalletById(fromWalletId);
    
    if (!fromWallet) {
      throw new Error("Source wallet not found");
    }
    
    if (fromWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Calculate fee (simplified for demo)
    const fee = amount * 0.01;
    const totalAmount = amount + fee;

    if (fromWallet.balance < totalAmount) {
      throw new Error(`Insufficient balance to cover amount plus fee of ${fee.toFixed(5)} ${fromWallet.type}`);
    }

    // Create transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      fromWalletId,
      toAddress,
      amount,
      coinType: fromWallet.type,
      status: "completed", // Instant completion for demo
      fee,
      timestamp: new Date().toISOString(),
      type: "send"
    };

    // Update balances
    setWallets(prev => {
      return prev.map(wallet => {
        if (wallet.id === fromWalletId) {
          return {
            ...wallet,
            balance: wallet.balance - totalAmount
          };
        }
        return wallet;
      });
    });

    // Add transaction to history
    setTransactions(prev => {
      const updated = [...prev, transaction];
      return updated;
    });

    toast({
      title: "Transaction Complete",
      description: `Sent ${amount.toFixed(5)} ${fromWallet.type} to ${toAddress.substring(0, 10)}...`
    });

    return transaction;
  };

  // Convert coins from one type to another
  const convertCoins = async (fromWalletId: string, toType: CoinType, amount: number): Promise<Transaction> => {
    const fromWallet = getWalletById(fromWalletId);
    
    if (!fromWallet) {
      throw new Error("Source wallet not found");
    }
    
    if (fromWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Find or create destination wallet
    let toWallet = wallets.find(w => w.type === toType && w.isDefault);
    
    if (!toWallet) {
      // Create a new destination wallet if none exists
      toWallet = await generateWallet(`${toType} Wallet`, toType);
    }

    // Calculate conversion rate and fee
    const rate = exchangeRates[fromWallet.type][toType];
    const convertedAmount = amount * rate;
    const fee = amount * 0.02; // 2% conversion fee

    if (fromWallet.balance < (amount + fee)) {
      throw new Error(`Insufficient balance to cover amount plus fee of ${fee.toFixed(5)} ${fromWallet.type}`);
    }

    // Create transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      fromWalletId,
      toWalletId: toWallet.id,
      amount,
      coinType: fromWallet.type,
      status: "completed", // Instant completion for demo
      fee,
      timestamp: new Date().toISOString(),
      type: "convert"
    };

    // Update balances
    setWallets(prev => {
      return prev.map(wallet => {
        if (wallet.id === fromWalletId) {
          return {
            ...wallet,
            balance: wallet.balance - (amount + fee)
          };
        }
        if (wallet.id === toWallet?.id) {
          return {
            ...wallet,
            balance: wallet.balance + convertedAmount
          };
        }
        return wallet;
      });
    });

    // Add transaction to history
    setTransactions(prev => {
      const updated = [...prev, transaction];
      return updated;
    });

    toast({
      title: "Conversion Complete",
      description: `Converted ${amount.toFixed(5)} ${fromWallet.type} to ${convertedAmount.toFixed(5)} ${toType}`
    });

    return transaction;
  };

  // Get a transaction by ID
  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === id);
  };

  // Get all transactions for a specific wallet
  const getWalletTransactions = (walletId: string): Transaction[] => {
    return transactions.filter(
      transaction => 
        transaction.fromWalletId === walletId || 
        transaction.toWalletId === walletId
    );
  };

  return (
    <WalletContext.Provider value={{
      wallets,
      transactions,
      recoveryPhrase,
      setRecoveryPhrase,
      generateWallet,
      getWalletById,
      sendCoins,
      convertCoins,
      getTransactionById,
      getWalletTransactions,
      createRecoveryPhrase,
      restoreWallets,
      addExternalWallet,
      setDefaultWallet,
      getDefaultWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};
