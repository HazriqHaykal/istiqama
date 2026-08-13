export interface HeatmapDay {
  key: string;
  value: number;
}

const TONE_VAR: Record<"primary" | "gold", string> = {
  primary: "var(--primary)",
  gold: "var(--gold)",
};

export function Heatmap({ days, tone }: { days: HeatmapDay[]; tone: "primary" | "gold" }) {
  const maxValue = Math.max(1, ...days.map((d) => d.value));
  const color = TONE_VAR[tone];

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto pb-1">
      {days.map((day) => (
        <div
          key={day.key}
          title={`${day.key}: ${day.value}`}
          className="h-[11px] w-[11px] rounded-[3px]"
          style={{
            backgroundColor: day.value === 0 ? "var(--hairline)" : color,
            opacity: day.value === 0 ? 1 : 0.4 + 0.6 * (day.value / maxValue),
          }}
        />
      ))}
    </div>
  );
}
