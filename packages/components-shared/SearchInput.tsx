import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="w-full px-3 py-2 border rounded"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder || 'Search...'}
  />
);

export default SearchInput;
