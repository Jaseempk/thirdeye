import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { connectWallet } from "@/lib/web3";
import { Wallet } from "lucide-react";

export function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setConnected(true);
      setAddress(window.ethereum.selectedAddress);
    }
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setConnected(true);
      setAddress(window.ethereum?.selectedAddress || "");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {connected ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
          <Wallet className="w-4 h-4" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      ) : (
        <Button onClick={handleConnect} className="font-mono">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
