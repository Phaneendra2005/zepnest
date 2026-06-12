const STATUS_STYLES = {
  'Pending':     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'In Progress': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Completed':   'bg-brand-500/15 text-brand-400 border-brand-500/30',
  'Cancelled':   'bg-zinc-600/30 text-zinc-400 border-zinc-600/40',
};

const STATUS_DOTS = {
  'Pending':     'bg-amber-400',
  'In Progress': 'bg-blue-400 animate-pulse',
  'Completed':   'bg-brand-400',
  'Cancelled':   'bg-zinc-500',
};

const StatusBadge = ({ status, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-display font-semibold tracking-wide ${STATUS_STYLES[status] || STATUS_STYLES['Pending']} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status] || STATUS_DOTS['Pending']}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
