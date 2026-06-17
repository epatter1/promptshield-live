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

export function CaretLeft({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M12.79 14.77a.75.75 0 01-.02-1.06L9.293 10l3.523-3.71a.75.75 0 10-1.08-1.04l-4 4.23a.75.75 0 000 1.04l4 4.23a.75.75 0 001.06.02z" />
    </svg>
  );
}

export function CaretRight({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7.21 5.23a.75.75 0 01.02 1.06L10.707 10l-3.523 3.71a.75.75 0 101.08 1.04l4-4.23a.75.75 0 000-1.04l-4-4.23a.75.75 0 00-1.06-.02z" />
    </svg>
  );
}

export function X({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}