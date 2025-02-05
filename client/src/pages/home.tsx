import { WalletConnect } from "@/components/WalletConnect";
import { TokenAnalysisForm } from "@/components/TokenAnalysis";
import { AnalysisReport } from "@/components/AnalysisReport";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-mono text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Base Token Analyzer
          </h1>
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <TokenAnalysisForm />
        <AnalysisReport />
      </main>
    </div>
  );
}