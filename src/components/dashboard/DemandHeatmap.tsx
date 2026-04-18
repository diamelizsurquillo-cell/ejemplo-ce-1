import { useMemo } from "react";
import { useFilters } from "@/context/FiltersContext";
import { regions } from "@/data/mockData";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function DemandHeatmap() {
  const { filteredOrders } = useFilters();

  const { matrix, max } = useMemo(() => {
    const m: Record<string, number[]> = {};
    regions.forEach((r) => (m[r] = [0, 0, 0, 0, 0, 0, 0]));
    filteredOrders.forEach((o) => {
      if (!m[o.region]) return;
      const day = (new Date(o.date).getDay() + 6) % 7; // Mon=0
      m[o.region][day]++;
    });
    const max = Math.max(1, ...Object.values(m).flat());
    return { matrix: m, max };
  }, [filteredOrders]);

  const cellColor = (v: number) => {
    const intensity = v / max;
    return `hsl(199 89% 48% / ${0.08 + intensity * 0.85})`;
  };

  return (
    <div className="surface-card p-5">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg">Demanda por región</h3>
        <p className="text-xs text-muted-foreground">Volumen de pedidos por día de la semana</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1.5 mb-2">
            <div />
            {days.map((d) => <div key={d} className="text-[11px] text-muted-foreground text-center font-medium">{d}</div>)}
          </div>
          {regions.map((r) => (
            <div key={r} className="grid grid-cols-[100px_repeat(7,1fr)] gap-1.5 mb-1.5">
              <div className="text-xs font-medium text-foreground self-center">{r}</div>
              {matrix[r].map((v, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md flex items-center justify-center text-[11px] font-semibold tabular border border-border/50 transition-transform hover:scale-110 hover:z-10"
                  style={{ background: cellColor(v), color: v / max > 0.5 ? "white" : "hsl(var(--foreground))" }}
                  title={`${r} · ${days[i]}: ${v} pedidos`}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
