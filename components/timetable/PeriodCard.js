import { getColor, PERIOD_TIMINGS } from "@/lib/timetable";

export default function PeriodCard({
  period,
  value,
  subject,
  isCurrent,
  currentRef,
  isEditing,
  day,
  subjects = [],
  override,
  onOverride,
}) {
  const hasOverride = override !== undefined;

  let finalSubject;

  if (hasOverride) {
    if (override === "") {
      finalSubject = null;
    } else {
      finalSubject =
        subjects.find((s) => s.course_code === override) || null;
    }
  } else {
    finalSubject = subject || null;
  }

  // 🌈 Dark mode neon color palette for timetable subjects
  const neonColors = [
    { r: 239, g: 68, b: 68 },  // Red
    { r: 59, g: 130, b: 246 }, // Blue
    { r: 16, g: 185, b: 129 }, // Green
    { r: 139, g: 92, b: 246 }, // Purple
    { r: 6, g: 182, b: 212 },  // Cyan
    { r: 249, g: 115, b: 22 }, // Orange
    { r: 236, g: 72, b: 153 }  // Pink
  ];

  let boxStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "var(--text)"
  };

  if (finalSubject) {
    const colorKey =
      finalSubject.course_code ||
      finalSubject.slot ||
      finalSubject.course_title ||
      value || "DEFAULT";

    // Hash string to pick a deterministic color
    let hash = 0;
    for (let i = 0; i < colorKey.length; i++) {
        hash = colorKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % neonColors.length;
    const { r, g, b } = neonColors[colorIndex];

    boxStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
    boxStyle.borderColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
    boxStyle.color = `rgb(${r+40 > 255 ? r : r+40}, ${g+40 > 255 ? g : g+40}, ${b+40 > 255 ? b : b+40})`; // slightly brightened for text visibility
  }

  if (isCurrent) {
    boxStyle.borderColor = "var(--accent)";
    boxStyle.boxShadow = "0 0 15px var(--accent)";
  }

  const timing = PERIOD_TIMINGS.find((p) => p.name === period);

  return (
    <div
      ref={isCurrent ? currentRef : null}
      className="border rounded-xl p-3 md:p-4 transition-all"
      style={boxStyle}
    >
      {timing && (
        <p className="text-xs mb-1" style={{ color: "var(--muted)", filter: "brightness(1.5)" }}>
          {timing.start} - {timing.end}
        </p>
      )}

      <p className="font-semibold break-words flex items-center gap-1">
        {finalSubject ? finalSubject.course_title : "Free"}

        {hasOverride && !isEditing && (
          <span className="text-xs text-blue-600">✏️</span>
        )}
      </p>

      {finalSubject && (
        <p className="text-xs opacity-80 break-words mt-1">
          {finalSubject.faculty_name} • {finalSubject.room_no}
        </p>
      )}

      {isEditing && (
        <select
          value={override ?? finalSubject?.course_code ?? ""}
          onChange={(e) => onOverride(day, period, e.target.value)}
          className="mt-3 w-full border rounded p-1.5 text-sm outline-none transition"
          style={{ backgroundColor: "rgba(10,10,10,0.8)", borderColor: "rgba(255,255,255,0.2)", color: "var(--text)" }}
        >
          <option value="">Free</option>

          {/* ✅ FIXED: unique keys */}
          {subjects.map((s, i) => (
            <option key={`${s.course_code}-${i}`} value={s.course_code}>
              {s.course_title}
            </option>
          ))}
        </select>
      )}

      {isCurrent && (
        <span 
          className="inline-block mt-3 text-xs font-bold px-2 py-1 rounded shadow-sm"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          NOW
        </span>
      )}
    </div>
  );
}