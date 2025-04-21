
import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Plus, Send, Exchange, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const Wallets = () => {
  const { wallets, generateWallet, addExternalWallet, sendCoins, convertCoins } = useWallet();
  const { toast } = useToast();
  
  // Dialog state
  const [isNewWalletOpen, setIsNewWalletOpen] = useState(false);
  const [isExternalWalletOpen, setIsExternalWalletOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  
  // Form states
  const [newWalletType, setNewWalletType] = useState<"Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin">("Bitcoin");
  const [newWalletName, setNewWalletName] = useState("");
  const [externalWalletName, setExternalWalletName] = useState("");
  const [externalWalletAddress, setExternalWalletAddress] = useState("");
  const [externalWalletType, setExternalWalletType] = useState<"Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin">("Bitcoin");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [convertAmount, setConvertAmount] = useState("");
  const [convertFromWalletId, setConvertFromWalletId] = useState("");
  const [convertToType, setConvertToType] = useState<"Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin">("Bitcoin");

  // Handle wallet creation
  const handleCreateWallet = async () => {
    try {
      await generateWallet(newWalletName, newWalletType);
      setNewWalletName("");
      setIsNewWalletOpen(false);
    } catch (error) {
      toast({
        title: "Error creating wallet",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Handle external wallet addition
  const handleAddExternalWallet = async () => {
    try {
      await addExternalWallet(externalWalletName, externalWalletAddress, externalWalletType);
      setExternalWalletName("");
      setExternalWalletAddress("");
      setIsExternalWalletOpen(false);
    } catch (error) {
      toast({
        title: "Error adding wallet",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Handle sending coins
  const handleSendCoins = async () => {
    try {
      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      await sendCoins(selectedWalletId, sendAddress, amount);
      setSendAmount("");
      setSendAddress("");
      setIsSendOpen(false);
    } catch (error) {
      toast({
        title: "Error sending coins",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Handle converting coins
  const handleConvertCoins = async () => {
    try {
      const amount = parseFloat(convertAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      await convertCoins(convertFromWalletId, convertToType, amount);
      setConvertAmount("");
      setIsConvertOpen(false);
    } catch (error) {
      toast({
        title: "Error converting coins",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Group wallets by type
  const walletsByType: Record<string, typeof wallets> = {};
  wallets.forEach(wallet => {
    if (!walletsByType[wallet.type]) {
      walletsByType[wallet.type] = [];
    }
    walletsByType[wallet.type].push(wallet);
  });

  const totalBalance = Object.entries(walletsByType).map(([type, typeWallets]) => {
    const total = typeWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    return { type, total };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Wallets</h1>
        <div className="flex gap-2">
          <Dialog open={isNewWalletOpen} onOpenChange={setIsNewWalletOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Wallet</DialogTitle>
                <DialogDescription>
                  Generate a new wallet for your crypto assets
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-name">Wallet Name</Label>
                  <Input
                    id="wallet-name"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="My Bitcoin Wallet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet-type">Wallet Type</Label>
                  <Select
                    value={newWalletType}
                    onValueChange={(value) => 
                      setNewWalletType(value as "Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin")
                    }
                  >
                    <SelectTrigger id="wallet-type">
                      <SelectValue placeholder="Select coin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                      <SelectItem value="Litecoin">Litecoin</SelectItem>
                      <SelectItem value="Dogecoin">Dogecoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewWalletOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateWallet}
                  disabled={!newWalletName}
                >
                  Create Wallet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isExternalWalletOpen} onOpenChange={setIsExternalWalletOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wallet className="mr-2 h-4 w-4" />
                Add External
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add External Wallet</DialogTitle>
                <DialogDescription>
                  Add an existing wallet address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="external-wallet-name">Wallet Name</Label>
                  <Input
                    id="external-wallet-name"
                    value={externalWalletName}
                    onChange={(e) => setExternalWalletName(e.target.value)}
                    placeholder="My External Wallet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="external-wallet-address">Wallet Address</Label>
                  <Input
                    id="external-wallet-address"
                    value={externalWalletAddress}
                    onChange={(e) => setExternalWalletAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="external-wallet-type">Wallet Type</Label>
                  <Select
                    value={externalWalletType}
                    onValueChange={(value) => 
                      setExternalWalletType(value as "Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin")
                    }
                  >
                    <SelectTrigger id="external-wallet-type">
                      <SelectValue placeholder="Select coin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                      <SelectItem value="Litecoin">Litecoin</SelectItem>
                      <SelectItem value="Dogecoin">Dogecoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsExternalWalletOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddExternalWallet}
                  disabled={!externalWalletName || !externalWalletAddress}
                >
                  Add Wallet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {wallets.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Wallets Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Create your first wallet to start managing your crypto assets
              </p>
              <Button asChild className="mt-4">
                <Link to="/wallet-setup">
                  Create Wallet with Recovery Phrase
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>Overview of your crypto assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
                {totalBalance.map(({ type, total }) => (
                  <div key={type} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{type}</p>
                    <p className="text-2xl font-bold">{total.toFixed(5)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Coins</DialogTitle>
                    <DialogDescription>
                      Transfer coins to another wallet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-wallet">From Wallet</Label>
                      <Select
                        value={selectedWalletId}
                        onValueChange={setSelectedWalletId}
                      >
                        <SelectTrigger id="from-wallet">
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {wallets.map(wallet => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              {wallet.name} ({wallet.balance.toFixed(5)} {wallet.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-address">To Address</Label>
                      <Input
                        id="to-address"
                        value={sendAddress}
                        onChange={(e) => setSendAddress(e.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSendOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSendCoins}
                      disabled={!selectedWalletId || !sendAddress || !sendAmount}
                    >
                      Send Coins
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Exchange className="mr-2 h-4 w-4" />
                    Convert
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convert Coins</DialogTitle>
                    <DialogDescription>
                      Exchange one cryptocurrency for another
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="convert-from-wallet">From Wallet</Label>
                      <Select
                        value={convertFromWalletId}
                        onValueChange={setConvertFromWalletId}
                      >
                        <SelectTrigger id="convert-from-wallet">
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {wallets.map(wallet => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              {wallet.name} ({wallet.balance.toFixed(5)} {wallet.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="convert-to-type">To Coin Type</Label>
                      <Select
                        value={convertToType}
                        onValueChange={(value) => 
                          setConvertToType(value as "Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin")
                        }
                      >
                        <SelectTrigger id="convert-to-type">
                          <SelectValue placeholder="Select coin type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                          <SelectItem value="Ethereum">Ethereum</SelectItem>
                          <SelectItem value="Solana">Solana</SelectItem>
                          <SelectItem value="Litecoin">Litecoin</SelectItem>
                          <SelectItem value="Dogecoin">Dogecoin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="convert-amount">Amount</Label>
                      <Input
                        id="convert-amount"
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsConvertOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleConvertCoins}
                      disabled={!convertFromWalletId || !convertToType || !convertAmount}
                    >
                      Convert Coins
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Bitcoin">Bitcoin</TabsTrigger>
              <TabsTrigger value="Ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="Solana">Solana</TabsTrigger>
              <TabsTrigger value="Litecoin">Litecoin</TabsTrigger>
              <TabsTrigger value="Dogecoin">Dogecoin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wallets.map(wallet => (
                  <WalletCard key={wallet.id} wallet={wallet} />
                ))}
              </div>
            </TabsContent>

            {Object.keys(walletsByType).map(type => (
              <TabsContent key={type} value={type} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {walletsByType[type].map(wallet => (
                    <WalletCard key={wallet.id} wallet={wallet} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

// Wallet Card Component
const WalletCard = ({ wallet }: { wallet: any }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex justify-between items-center">
        <span className="flex items-center">
          <Coins className="mr-2 h-4 w-4" />
          {wallet.name}
        </span>
        {wallet.isDefault && (
          <Badge variant="outline">Default</Badge>
        )}
      </CardTitle>
      <CardDescription className="font-mono text-xs truncate">
        {wallet.address}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="font-medium">{wallet.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="font-medium">{wallet.balance.toFixed(5)} {wallet.type}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button asChild variant="outline" className="w-full">
        <Link to={`/wallets/${wallet.id}`}>
          <Wallet className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

export default Wallets;
