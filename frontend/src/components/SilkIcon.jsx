const SilkIcon = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#9c27b0",stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#2196f3",stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#4caf50",stopOpacity:1}} />
        </linearGradient>
      </defs>
      {/* Silk cocoon shape */}
      <ellipse cx="50" cy="50" rx="35" ry="45" fill="url(#silkGradient)" opacity="0.9"/>
      {/* Silk thread lines */}
      <path d="M 30 20 Q 50 30 70 20" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M 25 35 Q 50 45 75 35" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M 30 50 Q 50 60 70 50" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M 25 65 Q 50 75 75 65" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M 30 80 Q 50 90 70 80" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
      {/* Highlight */}
      <ellipse cx="45" cy="40" rx="8" ry="12" fill="#fff" opacity="0.3"/>
    </svg>
  )
}

export default SilkIcon

