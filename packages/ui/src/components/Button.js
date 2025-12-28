import { jsxs as _jsxs } from "react/jsx-runtime";
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
const Button = ({ children, size = 'md', variant = 'primary', startIcon, endIcon, onClick, className = '', disabled = false, type = 'button', }) => {
    // Base classes that apply to all variants and sizes
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
    };
    // Variant classes
    const variantClasses = {
        primary: 'border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-300',
        outline: 'border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    };
    // CORE FIX: Use twMerge and clsx to intelligently combine classes
    const combinedClasses = twMerge(clsx(baseClasses, sizeClasses[size], variantClasses[variant], disabled && 'cursor-not-allowed opacity-50', // Conditionally add disabled classes
    className));
    return (_jsxs("button", { type: type, className: combinedClasses, onClick: onClick, disabled: disabled, children: [startIcon, children, endIcon] }));
};
export default Button;
