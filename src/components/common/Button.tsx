import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps & 
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsAnchorProps = ButtonBaseProps & 
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  as = 'button',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded-[4px] transition-colors duration-200 whitespace-nowrap';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-opacity-90',
    secondary: 'bg-[#F3A146] text-white hover:bg-[#e08f3c]',
    outline: 'bg-transparent border border-white text-white hover:bg-white/10'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  if (as === 'a') {
    return (
      <a 
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default Button; 