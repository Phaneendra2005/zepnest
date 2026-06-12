import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestsApi } from '../api/requests';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import Pagination from '../components/Pagination';

const STATUSES = ['', 'Pending', 'In Progress', 'Completed', 'Cancelled'];
const STATUS_LABELS = { '': 'All', 'Pending': 'Pending', 'In Progress': 'In Progress', 'Completed': 'Completed', 'Cancelled': 'Cancelled' };

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const searchInputRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(search);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await requestsApi.list(params);
      setRequests(data.data.requests);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load service requests.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      // Reset to page 1 on filter change
      if (updates.search !== undefined || updates.status !== undefined) {
        next.set('page', '1');
      }
      return next;
    });
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        updateParams({ search: localSearch });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handlePageChange = (newPage) => updateParams({ page: String(newPage) });
  const handleStatusChange = (s) => updateParams({ status: s });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            My Requests
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Hello, {user?.name?.split(' ')[0]} — here are your service requests.
          </p>
        </div>
        <Link to="/requests/new" className="btn-primary w-fit">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search requests…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input pl-9"
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(''); updateParams({ search: '' }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-display font-semibold transition-all duration-150 ${
                status === s
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mb-6">
        <p className="text-xs text-zinc-600 font-mono">
          {loading ? 'Loading…' : `${pagination.total} request${pagination.total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="mb-4 h-9 w-9 rounded-lg bg-zinc-800" />
              <div className="mb-2 h-4 w-3/4 rounded bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-zinc-300">No requests found</h3>
          <p className="mt-1 text-sm text-zinc-600">
            {search || status ? 'Try adjusting your filters.' : 'Create your first service request to get started.'}
          </p>
          {!search && !status && (
            <Link to="/requests/new" className="btn-primary mt-6">
              Create Request
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
