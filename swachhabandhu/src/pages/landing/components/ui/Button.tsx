import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  href,
  external = false,
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400',
    outline: 'border border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
    text: 'text-teal-600 hover:text-teal-700 hover:bg-teal-50 focus:ring-teal-500',
  };
  
  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3 rounded-md',
    md: 'text-base py-2 px-4 rounded-lg',
    lg: 'text-lg py-2.5 px-5 rounded-lg',
    full: 'text-base py-2 px-4 rounded-lg w-full',
  };
  
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a 
          href={href} 
          className={buttonStyles}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={buttonStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonStyles} disabled={disabled}>
      {content}
    </button>
  );
};

export default Button;