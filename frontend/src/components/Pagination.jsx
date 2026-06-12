const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page buttons
  const visiblePages = pages.filter((p) => {
    if (totalPages <= 5) return true;
    if (p === 1 || p === totalPages) return true;
    if (Math.abs(p - currentPage) <= 1) return true;
    return false;
  });

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <div key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-1 text-zinc-600 text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-display font-medium transition-all ${
                page === currentPage
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
