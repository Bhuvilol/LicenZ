import React from 'react';

const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'default',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const base = 'bg-white border border-neutral-200 rounded-xl shadow-soft transition-all duration-200';
  
  const styles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-medium hover:shadow-strong',
    outlined: 'bg-white border-2 border-neutral-300',
    filled: 'bg-neutral-50 border-neutral-200',
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    error: 'bg-error-50 border-error-200',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const cls = `${base} ${styles[variant]} ${paddingStyles[padding]} ${fullWidth ? 'w-full' : ''} ${className}`.trim();
  
  return (
    <div
      ref={ref}
      className={cls}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

Card.Header = ({ children, className = '', ...props }) => (
  <div className={`border-b border-neutral-200 pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`border-t border-neutral-200 pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
