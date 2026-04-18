import { useMemo } from "react";
import { useFilters } from "@/context/FiltersContext";
import { statusColor, statusLabel } from "@/data/mockData";

export function OrdersCalendar() {
  const { filteredOrders } = useFilters();

  const grouped = useMemo(() => {
    const map = new Map<string, { count: number; statuses: Record<string, number> }>();
    filteredOrders.forEach((o) => {
      const d = new Date(o.date);
      const key = d.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, { count: 0, statuses: {} });
      const entry = map.get(key)!;
      entry.count++;
      entry.statuses[o.status] = (entry.statuses[o.status] ?? 0) + 1;
    });
    return map;
  }, [filteredOrders]);

  // Build last 35 days grid
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 35 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (34 - i));
      return d;
    });
  }, []);

  const max = Math.max(1, ...Array.from(grouped.values()).map((g) => g.count));

  return (
    <div className="surface-card p-5">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg">Calendario de envíos</h3>
        <p className="text-xs text-muted-foreground">Últimos 35 días · intensidad = volumen</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="text-[11px] text-muted-foreground font-medium text-center pb-1">{d}</div>
        ))}
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const entry = grouped.get(key);
          const intensity = entry ? entry.count / max : 0;
          return (
            <div
              key={key}
              className="aspect-square rounded-lg border border-border/50 p-2 flex flex-col justify-between text-xs transition-all hover:border-accent hover:shadow-sm cursor-pointer"
              style={{ background: entry ? `hsl(199 89% 48% / ${0.08 + intensity * 0.4})` : "hsl(var(--secondary) / 0.4)" }}
              title={entry ? `${entry.count} pedidos el ${key}` : `Sin pedidos`}
            >
              <span className="text-foreground/70 font-medium">{d.getDate()}</span>
              {entry && (
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold tabular">{entry.count}</span>
                  <div className="flex gap-0.5">
                    {Object.entries(entry.statuses).slice(0, 3).map(([s, n]) => (
                      <span key={s} className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[s as keyof typeof statusColor] }} title={`${statusLabel[s as keyof typeof statusLabel]}: ${n}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
