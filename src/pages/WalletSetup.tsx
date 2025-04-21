
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Key, Shield, ArrowRight, Lock, Unlock, Copy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const WalletSetup = () => {
  const navigate = useNavigate();
  const { wallets, createRecoveryPhrase, restoreWallets, setRecoveryPhrase, recoveryPhrase } = useWallet();
  const { toast } = useToast();
  
  const [phrase, setPhrase] = useState<string>("");
  const [confirmationWords, setConfirmationWords] = useState<string[]>([]);
  const [confirmedWords, setConfirmedWords] = useState<string[]>([]);
  const [setupStep, setSetupStep] = useState(1);
  const [restorationPhrase, setRestorationPhrase] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isShowingPhrase, setIsShowingPhrase] = useState(false);
  const [hasBackedUp, setHasBackedUp] = useState(false);

  // Generate recovery phrase on initial load
  useEffect(() => {
    if (!phrase && setupStep === 1) {
      const newPhrase = createRecoveryPhrase();
      setPhrase(newPhrase);
      
      // Select 3 random words from the phrase for verification
      const words = newPhrase.split(" ");
      const randomIndexes = Array.from({ length: 3 }, () => 
        Math.floor(Math.random() * words.length)
      );
      setConfirmationWords(randomIndexes.map(index => words[index]));
    }
  }, [phrase, createRecoveryPhrase, setupStep]);

  // Handle copy recovery phrase
  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(phrase);
    toast({
      title: "Recovery Phrase Copied",
      description: "Your recovery phrase has been copied to clipboard. Keep it safe!"
    });
  };

  // Proceed to confirmation step
  const proceedToConfirmation = () => {
    if (!hasBackedUp) {
      toast({
        title: "Please confirm",
        description: "Please confirm that you have backed up your recovery phrase",
        variant: "destructive"
      });
      return;
    }
    setSetupStep(2);
  };

  // Check if confirmed words are correct
  const checkConfirmedWords = () => {
    const allCorrect = confirmedWords.every((word, index) => 
      word.toLowerCase() === confirmationWords[index].toLowerCase()
    );
    
    if (allCorrect) {
      setRecoveryPhrase(phrase);
      generateWalletsFromPhrase();
    } else {
      toast({
        title: "Verification Failed",
        description: "The words you entered don't match your recovery phrase",
        variant: "destructive"
      });
      setConfirmedWords([]);
    }
  };

  // Generate wallets from the recovery phrase
  const generateWalletsFromPhrase = async () => {
    try {
      toast({
        title: "Creating Wallets",
        description: "Setting up your crypto wallets..."
      });
      
      await restoreWallets(phrase);
      toast({
        title: "Wallets Created",
        description: "Your wallets have been successfully created!"
      });
      
      navigate("/wallets");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Restore from existing recovery phrase
  const handleRestoreWallets = async () => {
    try {
      await restoreWallets(restorationPhrase);
      navigate("/wallets");
    } catch (error) {
      toast({
        title: "Restoration Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Setup</h1>
        <p className="text-muted-foreground mt-2">
          Create a new wallet or recover an existing one
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="create">Create New Wallet</TabsTrigger>
          <TabsTrigger value="restore">Restore from Phrase</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          {setupStep === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Recovery Phrase
                </CardTitle>
                <CardDescription>
                  This is your wallet recovery phrase. Write it down and keep it in a safe place.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Warning: Keep this private!</AlertTitle>
                  <AlertDescription>
                    Anyone with your recovery phrase can access your funds. We will never ask for this phrase.
                    It cannot be recovered if lost.
                  </AlertDescription>
                </Alert>

                <div className="relative">
                  <div 
                    className={`bg-muted p-4 rounded-lg font-mono text-sm relative ${
                      isShowingPhrase ? "" : "blur-sm select-none"
                    }`}
                  >
                    {phrase}
                  </div>
                  {!isShowingPhrase && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        variant="secondary"
                        onClick={() => setIsShowingPhrase(true)}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Reveal Phrase
                      </Button>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCopyPhrase}
                      disabled={!isShowingPhrase}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="backup" 
                    checked={hasBackedUp}
                    onCheckedChange={(checked) => setHasBackedUp(checked as boolean)} 
                  />
                  <label
                    htmlFor="backup"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I have written down or saved my recovery phrase in a secure location
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={proceedToConfirmation} 
                  className="w-full"
                  disabled={!isShowingPhrase || !hasBackedUp}
                >
                  I've Saved My Recovery Phrase
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Recovery Phrase
                </CardTitle>
                <CardDescription>
                  Please confirm that you've saved your recovery phrase by entering the following words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {confirmationWords.map((word, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`word-${index}`}>
                        Word #{phrase.split(" ").findIndex(w => w === word) + 1}
                      </Label>
                      <Input
                        id={`word-${index}`}
                        value={confirmedWords[index] || ""}
                        onChange={(e) => {
                          const newWords = [...confirmedWords];
                          newWords[index] = e.target.value;
                          setConfirmedWords(newWords);
                        }}
                        placeholder="Enter word here"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={checkConfirmedWords} 
                  className="w-full"
                  disabled={confirmedWords.length !== confirmationWords.length || 
                    confirmedWords.some(word => !word)}
                >
                  Verify & Create Wallets
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="restore" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Restore Wallet
              </CardTitle>
              <CardDescription>
                Enter your 24-word recovery phrase to restore your wallets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Secure Environment</AlertTitle>
                <AlertDescription>
                  Make sure you're in a private location with no one watching your screen when entering your recovery phrase.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="recovery-phrase">Recovery Phrase (24 words)</Label>
                <textarea
                  id="recovery-phrase"
                  className="w-full h-32 p-3 rounded-md border resize-none font-mono"
                  value={restorationPhrase}
                  onChange={(e) => setRestorationPhrase(e.target.value)}
                  placeholder="Enter your 24-word recovery phrase, separated by spaces"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  I understand that I am responsible for the security of my recovery phrase and wallet
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleRestoreWallets} 
                className="w-full"
                disabled={!restorationPhrase || !agreedToTerms}
              >
                Restore Wallets
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletSetup;
