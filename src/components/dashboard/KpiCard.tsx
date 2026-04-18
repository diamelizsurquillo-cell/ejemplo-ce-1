import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number; // percent change
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "danger";
  index?: number;
}

const accentClass = {
  primary: "bg-accent/10 text-accent",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger",
};

export function KpiCard({ label, value, delta, hint, icon: Icon, accent = "primary", index = 0 }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="surface-card p-5 hover:shadow-elevated transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", accentClass[accent])}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="font-display font-bold text-3xl text-foreground tabular leading-none">{value}</div>
      <div className="flex items-center gap-2 mt-3 text-xs">
        {delta !== undefined && (
          <span className={cn("flex items-center gap-1 font-semibold tabular", positive ? "text-status-success" : "text-status-danger")}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}{delta.toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </motion.div>
  );
}
