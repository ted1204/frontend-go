import type React from 'react';
import type { FC } from 'react';
interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}
declare const Input: FC<InputProps>;
export default Input;
//# sourceMappingURL=InputFieldDefault.d.ts.map
