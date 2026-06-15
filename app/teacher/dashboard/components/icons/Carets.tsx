export function CaretDown({ className = "h-3 w-3" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M14.77 7.79a.75.75 0 00-1.06-.02L10 11.293 6.29 7.77a.75.75 0 10-1.04 1.08l4.23 4a.75.75 0 001.04 0l4.23-4a.75.75 0 00.02-1.06z" />
    </svg>
  );
}

export function CaretUp({ className = "h-3 w-3" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5.23 12.21a.75.75 0 001.06.02L10 8.707l3.71 3.523a.75.75 0 001.04-1.08l-4.23-4a.75.75 0 00-1.04 0l-4.23 4a.75.75 0 00-.02 1.06z" />
    </svg>
  );
}