import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Send, ArrowLeftRight, Copy, ArrowLeft, Shield } from "lucide-react";

const WalletDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wallets, transactions, getWalletById, getWalletTransactions, sendCoins, convertCoins, setDefaultWallet } = useWallet();
  const { toast } = useToast();
  
  const wallet = getWalletById(id || "");
  const walletTransactions = id ? getWalletTransactions(id) : [];
  
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [convertAmount, setConvertAmount] = useState("");
  const [convertToType, setConvertToType] = useState<"Bitcoin" | "Ethereum" | "Solana" | "Litecoin" | "Dogecoin">("Bitcoin");

  const handleCopyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const handleSendCoins = async () => {
    try {
      if (!wallet || !id) return;
      
      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      await sendCoins(id, sendAddress, amount);
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

  const handleConvertCoins = async () => {
    try {
      if (!wallet || !id) return;
      
      const amount = parseFloat(convertAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      await convertCoins(id, convertToType, amount);
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

  const handleSetDefault = () => {
    if (wallet && !wallet.isDefault) {
      setDefaultWallet(wallet.id);
    }
  };

  if (!wallet) {
    return (
      <div className="space-y-6 text-center py-12">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Not Found</h1>
        <p className="text-muted-foreground">The wallet you're looking for does not exist.</p>
        <Button asChild>
          <Link to="/wallets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wallets
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/wallets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{wallet.name}</h1>
        {wallet.isDefault && (
          <Badge variant="outline" className="ml-2">Default</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>
                {wallet.type} Wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Address</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={wallet.address} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Balance</Label>
                <p className="text-2xl font-bold">{wallet.balance.toFixed(5)} {wallet.type}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Created</Label>
                <p>{new Date(wallet.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send {wallet.type}</DialogTitle>
                    <DialogDescription>
                      Transfer {wallet.type} to another wallet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="from">From</Label>
                      <Input id="from" value={wallet.name} disabled />
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
                      <Label htmlFor="amount">Amount ({wallet.type})</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Available: {wallet.balance.toFixed(5)} {wallet.type}
                      </p>
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
                      disabled={!sendAddress || !sendAmount}
                    >
                      Send {wallet.type}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1">
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Convert
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convert {wallet.type}</DialogTitle>
                    <DialogDescription>
                      Exchange {wallet.type} for another cryptocurrency
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-wallet">From</Label>
                      <Input id="from-wallet" value={wallet.name} disabled />
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
                      <Label htmlFor="convert-amount">Amount ({wallet.type})</Label>
                      <Input
                        id="convert-amount"
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Available: {wallet.balance.toFixed(5)} {wallet.type}
                      </p>
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
                      disabled={!convertToType || !convertAmount}
                    >
                      Convert {wallet.type}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          {!wallet.isDefault && (
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleSetDefault}
            >
              <Shield className="mr-2 h-4 w-4" />
              Set as Default {wallet.type} Wallet
            </Button>
          )}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent activity for this wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {walletTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {walletTransactions.map(transaction => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {transaction.type === "send" ? (
                          <Send className="h-8 w-8 p-1.5 rounded-full bg-red-100 text-red-600" />
                        ) : transaction.type === "receive" ? (
                          <Wallet className="h-8 w-8 p-1.5 rounded-full bg-green-100 text-green-600" />
                        ) : (
                          <ArrowLeftRight className="h-8 w-8 p-1.5 rounded-full bg-blue-100 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {transaction.type === "send" 
                              ? "Sent to" 
                              : transaction.type === "receive" 
                              ? "Received from" 
                              : "Converted to"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type === "send" 
                              ? transaction.toAddress?.substring(0, 16) + "..." 
                              : transaction.type === "receive" 
                              ? "External Wallet"
                              : wallets.find(w => w.id === transaction.toWalletId)?.type || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === "send" ? "text-red-600" : "text-green-600"}`}>
                          {transaction.type === "send" ? "-" : "+"}{transaction.amount.toFixed(5)} {transaction.coinType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Fee: {transaction.fee.toFixed(5)} {transaction.coinType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;
