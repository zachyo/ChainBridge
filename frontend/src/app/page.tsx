import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import {
  ArrowRightLeft,
  ShieldCheck,
  Zap,
  Coins,
  ArrowRight,
  ChevronRight,
  Lock,
} from "lucide-react";

export const experimental_ppr = true;

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — product-first swap preview */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 z-0 bg-hero-grid opacity-[0.03] dark:opacity-[0.07]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Left — headline + CTAs */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-lg">
              <Badge variant="info" className="mb-6 animate-fade-in py-1 pl-1 pr-3">
                <span className="mr-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Alpha
                </span>
                ChainBridge v0.1 is live on Testnet
              </Badge>

              <h1 className="animate-slide-up text-balance text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">
                Cross-Chain Swaps,{" "}
                <span className="text-gradient">No Intermediaries.</span>
              </h1>

              <p className="mt-6 max-w-lg animate-fade-in text-base leading-relaxed text-text-secondary [animation-delay:200ms]">
                Trustless, atomic swaps powered by HTLCs. Trade assets between Stellar, Bitcoin,
                and Ethereum with zero counterparty risk.
              </p>

              <div className="mt-8 flex animate-fade-in flex-wrap items-center gap-3 [animation-delay:400ms]">
                <Link href="/swap" prefetch={true}>
                  <Button size="lg" className="rounded-2xl px-8 shadow-glow-md">
                    Start Swapping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about" prefetch={true}>
                  <Button variant="secondary" size="lg" className="rounded-2xl px-8">
                    How it Works
                  </Button>
                </Link>
              </div>

              {/* Ecosystem Stats */}
              <div className="mt-10 grid w-full grid-cols-2 gap-3 animate-fade-in [animation-delay:600ms] sm:grid-cols-4 lg:grid-cols-2">
                <Stat label="Total Volume" value="$2.4M+" />
                <Stat label="Avg. Speed" value="~1.5m" />
                <Stat label="Chain Support" value="3+" />
                <Stat label="Security Audit" value="Verifying" />
              </div>
            </div>

            {/* Right — compact swap preview panel */}
            <div className="w-full max-w-sm animate-fade-in [animation-delay:300ms] lg:flex-1">
              <SwapPreviewPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-surface/30 py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Engineered for Sovereignty
            </h2>
            <p className="mt-4 text-text-secondary">
              Non-custodial by design. Built with industry-standard primitives.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-brand-500" />}
              title="Self-Custody"
              description="Your keys never leave your device. All transactions are signed locally using your preferred wallet."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-indigo-500" />}
              title="Atomic Guarantees"
              description="Hash Time-Locked Contracts ensure that either both parties receive their assets, or both are refunded."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-amber-500" />}
              title="Ultra Low Fees"
              description="Leverage Stellar's high-speed network for settlement, reducing cross-chain bridging costs by up to 90%."
            />
            <FeatureCard
              icon={<Coins className="h-6 w-6 text-emerald-500" />}
              title="Roadmap Foundations"
              description="Governance, fallback liquidity pools, advanced orders, and referral growth tooling now have dedicated product surfaces."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card
            variant="glow"
            className="flex flex-col items-center gap-8 overflow-hidden p-8 text-center md:flex-row md:p-12 md:text-left"
          >
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-text-primary">Ready to cross the bridge?</h2>
              <p className="mt-4 text-text-secondary">
                Connect your wallet and start swapping assets instantly across major blockchain
                networks.
              </p>
              <div className="mt-8">
                <Link href="/swap" prefetch={true}>
                  <Button variant="primary" size="lg" className="rounded-xl">
                    Connect and Swap <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex h-48 w-48 shrink-0 items-center justify-center md:h-64 md:w-64">
              <ArrowRightLeft className="h-20 w-20 text-brand-500/40" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SwapPreviewPanel() {
  return (
    <Card variant="raised" className="overflow-hidden shadow-glow-sm">
      <div className="border-b border-border bg-surface-overlay/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-brand-500" />
          <span className="text-sm font-semibold text-text-primary">Swap Preview</span>
        </div>
        <Badge variant="info" className="text-[10px]">Testnet</Badge>
      </div>

      <div className="p-4 space-y-3">
        {/* From */}
        <div className="rounded-xl border border-border bg-surface-overlay/40 p-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">From</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-brand-500/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-brand-500">XLM</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Stellar</p>
                <p className="text-[10px] text-text-muted">Lumens</p>
              </div>
            </div>
            <span className="text-lg font-bold text-text-primary">100</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-overlay">
            <ArrowRightLeft className="h-3.5 w-3.5 text-brand-500" />
          </div>
        </div>

        {/* To */}
        <div className="rounded-xl border border-border bg-surface-overlay/40 p-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">To</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-amber-500">BTC</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Bitcoin</p>
                <p className="text-[10px] text-text-muted">Bitcoin</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-400">≈ 0.0021</span>
              <p className="text-[10px] text-text-muted">estimated</p>
            </div>
          </div>
        </div>

        {/* Rate row */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-overlay/40 px-3 py-2 text-xs">
          <span className="text-text-muted">Rate</span>
          <span className="font-medium text-text-primary">1 XLM ≈ 0.0000213 BTC</span>
        </div>

        {/* CTA */}
        <Link href="/swap" prefetch={true}>
          <Button className="w-full rounded-xl" size="sm">
            Open Swap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-center text-[10px] text-text-muted">
          Trustless · Atomic · Self-custody
        </p>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-raised border border-border p-6 text-center">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      variant="glass"
      className="p-8 transition-all hover:border-brand-500/50 hover:shadow-glow-sm"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-overlay border border-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{description}</p>
    </Card>
  );
}
