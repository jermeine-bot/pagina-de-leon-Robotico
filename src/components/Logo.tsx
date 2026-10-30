export function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#2563EB" />
      <rect x="4" y="4" width="40" height="14" rx="12" fill="#FFD500" />
      <rect x="4" y="14" width="40" height="4" fill="#FFD500" />
      {/* eyes */}
      <circle cx="18" cy="26" r="4" fill="#FFFFFF" />
      <circle cx="30" cy="26" r="4" fill="#FFFFFF" />
      <circle cx="19" cy="26" r="2" fill="#202638" />
      <circle cx="31" cy="26" r="2" fill="#202638" />
      {/* smile */}
      <path d="M16 34 Q24 40 32 34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* antenna */}
      <rect x="22" y="0" width="4" height="6" rx="2" fill="#E83E99" />
      <circle cx="24" cy="0" r="3" fill="#E83E99" />
      {/* gear accent */}
      <circle cx="40" cy="40" r="5" fill="#37C8E8" />
      <circle cx="40" cy="40" r="2" fill="#FFFFFF" />
    </svg>
  )
}
