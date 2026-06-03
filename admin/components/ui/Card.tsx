import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
