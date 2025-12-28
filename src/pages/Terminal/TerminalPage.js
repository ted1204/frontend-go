import { jsx as _jsx } from "react/jsx-runtime";
import TerminalPage from '../../components/terminal/PodTerminal';
import { useSearchParams } from 'react-router-dom';
const TerminalWrapper = () => {
    const [searchParams] = useSearchParams();
    const namespace = searchParams.get('namespace') || '';
    const pod = searchParams.get('pod') || '';
    const container = searchParams.get('container') || '';
    return _jsx(TerminalPage, { namespace: namespace, pod: pod, container: container });
};
export default TerminalWrapper;
