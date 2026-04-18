import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useMemo } from "react";
import { useFilters } from "@/context/FiltersContext";

export function OtdGauge() {
  const { filteredOrders } = useFilters();
  const { pct, onTime, total } = useMemo(() => {
    const completed = filteredOrders.filter((o) => o.status === "delivered" || o.status === "delayed");
    const onTime = completed.filter((o) => o.actualHours <= o.slaHours).length;
    const total = completed.length || 1;
    return { pct: Math.round((onTime / total) * 100), onTime, total: completed.length };
  }, [filteredOrders]);

  const color = pct >= 90 ? "hsl(var(--status-success))" : pct >= 75 ? "hsl(var(--status-warning))" : "hsl(var(--status-danger))";
  const data = [{ name: "OTD", value: pct, fill: color }];

  return (
    <div className="surface-card p-5 flex flex-col">
      <div className="mb-2">
        <h3 className="font-display font-semibold text-lg">On-Time Delivery</h3>
        <p className="text-xs text-muted-foreground">% de pedidos entregados en SLA</p>
      </div>
      <div className="relative flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "hsl(var(--secondary))" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-bold text-5xl tabular" style={{ color }}>{pct}%</span>
          <span className="text-xs text-muted-foreground mt-1">{onTime.toLocaleString()} / {total.toLocaleString()} pedidos</span>
        </div>
      </div>
    </div>
  );
}
