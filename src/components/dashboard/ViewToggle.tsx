import { Map, List, Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ViewMode } from "@/data/mockData";

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as ViewMode)}
      className="surface-card p-1 inline-flex"
    >
      <ToggleGroupItem value="map" className="h-8 px-3 text-xs gap-1.5 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
        <Map className="h-3.5 w-3.5" /> Mapa
      </ToggleGroupItem>
      <ToggleGroupItem value="list" className="h-8 px-3 text-xs gap-1.5 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
        <List className="h-3.5 w-3.5" /> Lista
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" className="h-8 px-3 text-xs gap-1.5 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
        <Calendar className="h-3.5 w-3.5" /> Calendario
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
