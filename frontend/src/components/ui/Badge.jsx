import React from 'react';

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}, ref) => {
  const base = 'inline-flex items-center font-medium';
  
  const styles = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  const cls = `${base} ${styles[variant]} ${sizes[size]} ${rounded ? 'rounded-full' : 'rounded-md'} ${className}`.trim();
  
  return (
    <span
      ref={ref}
      className={cls}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
