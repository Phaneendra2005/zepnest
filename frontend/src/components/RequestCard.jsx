import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import CategoryIcon from './CategoryIcon';

const RequestCard = ({ request }) => {
  const formattedDate = new Date(request.preferred_time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/requests/${request.id}`}
      className="card group flex flex-col gap-4 hover:border-zinc-700 hover:bg-zinc-800/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 cursor-pointer animate-fade-in"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <CategoryIcon category={request.category} />
        <StatusBadge status={request.status} />
      </div>

      {/* Title & description */}
      <div>
        <h3 className="font-display font-semibold text-base text-white leading-snug line-clamp-1 group-hover:text-brand-300 transition-colors">
          {request.title}
        </h3>
      </div>

      {/* Meta */}
      <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>
        <span className="inline-flex items-center gap-1 truncate max-w-[120px]">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{request.address.split(',')[0]}</span>
        </span>
      </div>

      {/* Category label */}
      <div className="border-t border-zinc-800/80 pt-3">
        <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
          {request.category}
        </span>
      </div>
    </Link>
  );
};

export default RequestCard;
