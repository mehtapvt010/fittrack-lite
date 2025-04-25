// components/ui/Skeleton.tsx
export default function Skeleton({ className = "" }) {
    return (
      <div
        className={`bg-gray-300 dark:bg-gray-700 animate-pulse rounded ${className}`}
      />
    );
  }
  