import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import { useFilters } from "@/context/FiltersContext";
import { getCarrier, getCenter, statusColor, statusLabel } from "@/data/mockData";
import { Fragment, useMemo } from "react";

export function RoutesMap() {
  const { filteredOrders } = useFilters();
  // Limit markers for perf
  const sample = useMemo(() => filteredOrders.slice(0, 120), [filteredOrders]);

  return (
    <div className="surface-card overflow-hidden h-[440px] lg:h-[520px]">
      <div className="flex items-baseline justify-between p-5 pb-3">
        <div>
          <h3 className="font-display font-semibold text-lg">Mapa de rutas en tiempo real</h3>
          <p className="text-xs text-muted-foreground">Mostrando {sample.length} de {filteredOrders.length} envíos</p>
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
      <div className="h-[calc(100%-72px)] px-2 pb-2">
        <MapContainer
          center={[23.6, -102.5]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          {sample.map((o) => {
            const center = getCenter(o.centerId);
            const color = statusColor[o.status];
            return (
              <Fragment key={o.id}>
                <Polyline
                  positions={[[center.lat, center.lng], [o.destination.lat, o.destination.lng]]}
                  pathOptions={{ color, weight: 1, opacity: 0.25, dashArray: "4 6" }}
                />
                <CircleMarker
                  center={[o.destination.lat, o.destination.lng]}
                  radius={6}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-sm">{o.id}</div>
                      <div><strong>Cliente:</strong> {o.customer}</div>
                      <div><strong>Destino:</strong> {o.destination.city}</div>
                      <div><strong>Transportista:</strong> {getCarrier(o.carrierId).name}</div>
                      <div><strong>Estado:</strong> <span style={{ color }}>{statusLabel[o.status]}</span></div>
                      <div><strong>SLA:</strong> {o.slaHours}h · <strong>Real:</strong> {o.actualHours}h</div>
                    </div>
                  </Popup>
                </CircleMarker>
              </Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
