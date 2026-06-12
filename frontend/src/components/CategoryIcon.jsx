const ICONS = {
  Plumbing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 22v-5M12 7V2M12 7a5 5 0 110 10A5 5 0 0112 7zM22 12h-5M7 12H2"/>
    </svg>
  ),
  Electrical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Cleaning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 21h4l13-13-4-4L3 17v4zM14.5 6.5l3 3"/>
    </svg>
  ),
  Carpentry: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 3l7.5 7.5M20.9 3.1L12 12l3 3 5.9-5.9a3 3 0 000-5.2L20.9 3.1zM8.5 15.5L3 21"/>
    </svg>
  ),
  Other: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </svg>
  ),
};

const COLORS = {
  Plumbing:   'bg-cyan-500/15 text-cyan-400',
  Electrical: 'bg-yellow-500/15 text-yellow-400',
  Cleaning:   'bg-purple-500/15 text-purple-400',
  Carpentry:  'bg-orange-500/15 text-orange-400',
  Other:      'bg-zinc-600/30 text-zinc-400',
};

const CategoryIcon = ({ category, className = '' }) => (
  <span className={`inline-flex items-center justify-center rounded-lg p-2 ${COLORS[category] || COLORS['Other']} ${className}`}>
    {ICONS[category] || ICONS['Other']}
  </span>
);

export default CategoryIcon;
