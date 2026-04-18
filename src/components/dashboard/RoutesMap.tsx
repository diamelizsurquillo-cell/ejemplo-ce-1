import { useFilters } from "@/context/FiltersContext";
import { distributionCenters, getCarrier, getCenter, statusColor, statusLabel } from "@/data/mockData";
import { useMemo, useState } from "react";

// Mexico approximate bounds
const BOUNDS = { minLat: 14.5, maxLat: 32.7, minLng: -118, maxLng: -86 };
const W = 800;
const H = 480;

const project = (lat: number, lng: number) => {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W;
  const y = H - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;
  return { x, y };
};

export function RoutesMap() {
  const { filteredOrders } = useFilters();
  const [hover, setHover] = useState<string | null>(null);
  const sample = useMemo(() => filteredOrders.slice(0, 120), [filteredOrders]);
  const hovered = sample.find((o) => o.id === hover);

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-baseline justify-between p-5 pb-3">
        <div>
          <h3 className="font-display font-semibold text-lg">Mapa de rutas en tiempo real</h3>
          <p className="text-xs text-muted-foreground">
            Mostrando {sample.length} de {filteredOrders.length} envíos
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          {(["delivered", "in-transit", "delayed", "issue"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[s] }} />
              <span className="text-muted-foreground">{statusLabel[s]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative px-2 pb-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto rounded-lg bg-muted/30"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" />

          {/* Routes */}
          {sample.map((o) => {
            const c = getCenter(o.centerId);
            const a = project(c.lat, c.lng);
            const b = project(o.destination.lat, o.destination.lng);
            const color = statusColor[o.status];
            const isHover = hover === o.id;
            return (
              <line
                key={`r-${o.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={color}
                strokeWidth={isHover ? 1.6 : 0.8}
                strokeDasharray="4 4"
                opacity={isHover ? 0.9 : 0.3}
              />
            );
          })}

          {/* Distribution centers */}
          {distributionCenters.map((c) => {
            const p = project(c.lat, c.lng);
            return (
              <g key={c.id}>
                <circle cx={p.x} cy={p.y} r={9} fill="hsl(var(--primary))" opacity={0.15} />
                <circle cx={p.x} cy={p.y} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={1.5} />
                <text x={p.x + 8} y={p.y - 6} fontSize={10} fill="hsl(var(--foreground))" fontWeight={600}>
                  {c.city}
                </text>
              </g>
            );
          })}

          {/* Destination markers */}
          {sample.map((o) => {
            const p = project(o.destination.lat, o.destination.lng);
            const color = statusColor[o.status];
            const isHover = hover === o.id;
            return (
              <circle
                key={`m-${o.id}`}
                cx={p.x}
                cy={p.y}
                r={isHover ? 7 : 4.5}
                fill={color}
                fillOpacity={0.85}
                stroke="hsl(var(--background))"
                strokeWidth={1.5}
                style={{ cursor: "pointer", transition: "r 120ms" }}
                onMouseEnter={() => setHover(o.id)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>

        {hovered && (
          <div className="absolute top-3 right-3 surface-card p-3 text-xs space-y-1 max-w-xs shadow-lg">
            <div className="font-semibold text-sm">{hovered.id}</div>
            <div><span className="text-muted-foreground">Cliente:</span> {hovered.customer}</div>
            <div><span className="text-muted-foreground">Destino:</span> {hovered.destination.city}</div>
            <div><span className="text-muted-foreground">Transportista:</span> {getCarrier(hovered.carrierId).name}</div>
            <div>
              <span className="text-muted-foreground">Estado:</span>{" "}
              <span style={{ color: statusColor[hovered.status] }} className="font-medium">
                {statusLabel[hovered.status]}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">SLA:</span> {hovered.slaHours}h ·{" "}
              <span className="text-muted-foreground">Real:</span> {hovered.actualHours}h
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
