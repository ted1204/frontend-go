import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const InputField = ({ label, className = '', 
// Destructure standard props used directly in the component logic
type = 'text', value, onChange, placeholder, required, disabled, 
// Collect all other native HTML input props
...rest }) => {
    // Use React.useId for robust accessibility linkage between label and input.
    const id = React.useId();
    return (
    // Outer Wrapper Div: Applies layout classes and any custom parent classNames.
    _jsxs("div", { className: `space-y-1.5 text-left ${className}`, children: [_jsxs("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [label, required && _jsx("span", { className: "text-red-500 ml-1 leading-none", children: "*" })] }), _jsx("input", { id: id, type: type, value: value, onChange: onChange, placeholder: placeholder, required: required, disabled: disabled, 
                // Tailwind CSS Styling: Consolidated into a single, clean template literal string.
                className: `
          w-full 
          px-3 py-2 
          border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-700 dark:text-white 
          rounded-md 
          shadow-inner-sm // Used a more subtle inner shadow for depth
          
          transition duration-150 ease-in-out
          
          focus:outline-none 
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 // Clear focus state
          
          disabled:bg-gray-100 dark:disabled:bg-gray-700/50
          disabled:cursor-not-allowed
        `, ...rest })] }));
};
export default InputField;
