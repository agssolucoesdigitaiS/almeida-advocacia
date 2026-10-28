/** Monograma AA: duas letras A em traço fino, entrelaçadas por uma barra comum em dourado. */
export function Monogram({ className = '', draw = false, title = 'Monograma AA' }: { className?: string; draw?: boolean; title?: string }) {
  const d = draw ? { pathLength: 1, strokeDasharray: '1', 'data-mono-draw': true } : {};
  return (
    <svg viewBox="0 0 120 100" className={className} role="img" aria-label={title} fill="none" strokeLinecap="square">
      <path {...d} d="M8 90 L40 10 L72 90" stroke="currentColor" strokeWidth="2.2" />
      <path {...d} d="M48 90 L80 10 L112 90" stroke="currentColor" strokeWidth="2.2" />
      <path {...d} d="M0 90 H18 M62 90 H80 M40 90 H58 M102 90 H120" stroke="currentColor" strokeWidth="1.4" />
      <path {...d} d="M22 62 H98" stroke="var(--c-gold)" strokeWidth="1.6" />
    </svg>
  );
}
