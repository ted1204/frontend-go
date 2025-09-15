import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalProps {
  namespace: string;
  pod: string;
  container: string;
  command?: string;
  tty?: boolean;
}

const TerminalPage: React.FC<TerminalProps> = ({
  namespace,
  pod,
  container,
  command = "sh",
  tty = true,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal>(null);
  const fitAddon = useRef(new FitAddon());

  useEffect(() => {
    if (!terminalRef.current) return;

    termInstance.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#000000",
        foreground: "#00ff00",
      },
    });

    termInstance.current.loadAddon(fitAddon.current);
    termInstance.current.open(terminalRef.current);
    fitAddon.current.fit();

    // 不帶 token，直接使用 cookie
    const wsUrl = `ws://10.121.124.22:30080/ws/exec?namespace=${encodeURIComponent(
      namespace
    )}&pod=${encodeURIComponent(pod)}&container=${encodeURIComponent(
      container
    )}&command=${encodeURIComponent(command)}&tty=${tty}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      termInstance.current?.writeln("\x1b[32m[Connected to Pod shell]\x1b[0m");
    };

    socket.onmessage = (event) => {
      termInstance.current?.write(event.data);
    };

    socket.onerror = () => {
      termInstance.current?.writeln("\x1b[31m[WebSocket Error]\x1b[0m");
    };

    socket.onclose = () => {
      termInstance.current?.writeln("\n\x1b[33m[Disconnected]\x1b[0m");
    };

    termInstance.current.onData((data) => {
      socket.send(data);
    });

    const handleResize = () => fitAddon.current.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      termInstance.current?.dispose();
    };
  }, [namespace, pod, container, command, tty]);

  return <div ref={terminalRef} style={{ width: "100%", height: "100vh" }} />;
};

export default TerminalPage;
