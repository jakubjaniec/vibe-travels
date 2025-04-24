export function Loader() {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
