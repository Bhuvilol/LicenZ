import React from 'react';

const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  fullWidth = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const base = 'block w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors duration-200 resize-vertical';
  
  const cls = `${base} ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''} ${fullWidth ? 'w-full' : ''} ${className}`.trim();
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cls}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
