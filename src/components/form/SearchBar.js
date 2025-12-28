import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from '@tailadmin/utils';
import { SearchInput } from '@tailadmin/ui';
const SearchBar = ({ value, onChange, className = '', placeholder }) => {
    const { t } = useTranslation();
    const ph = placeholder ?? `${t('form.label.title')}/${t('form.label.description')}`;
    return (_jsx("div", { className: `min-w-[180px] ${className}`, children: _jsx(SearchInput, { value: value, onChange: onChange, placeholder: ph }) }));
};
export default SearchBar;
