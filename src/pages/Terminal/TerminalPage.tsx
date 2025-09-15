import TerminalPage from "../../components/terminal/PodTerminal";
import { useSearchParams } from "react-router-dom";

// Wrapper 解析 query string
const TerminalWrapper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const namespace = searchParams.get("namespace") || "";
  const pod = searchParams.get("pod") || "";
  const container = searchParams.get("container") || "";

  return <TerminalPage namespace={namespace} pod={pod} container={container} />;
};

export default TerminalWrapper;