export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span className={`monogram ${className}`} aria-hidden="true">
      <span>Z</span>
      <span>T</span>
    </span>
  )
}
