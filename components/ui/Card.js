export default function Card({ children, className = "" }) {
  return (
    <div 
      className={`rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 md:p-5 border border-transparent hover:shadow-lg transition-all ${className}`} 
      style={{ 
        backgroundColor: "rgba(10, 10, 12, 0.85)", 
        borderColor: "color-mix(in srgb, var(--accent) 30%, rgba(255, 255, 255, 0.1))",
        color: "var(--text)"
      }}
    >
      {children}
    </div>
  );
}