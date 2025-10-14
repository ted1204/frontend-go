import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { BASE_URL } from "../../config/url";
import "xterm/css/xterm.css";

// Define the message structure for communication with the backend.
interface TerminalMessage {
  type: 'stdin' | 'stdout' | 'resize';
  data?: string;
  cols?: number;
  rows?: number;
}

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
  const term = useRef<Terminal | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const fitAddon = useRef(new FitAddon()); // Keep the fitAddon instance in a ref.

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. Initialize the Terminal with desired appearance.
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      letterSpacing: 1,
      fontFamily: '"FiraCode Nerd Font", Consolas, "Courier New", monospace',
      theme: {
        background: "#000000",
        foreground: "#ffffff",
      },
    });
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    
    // 2. Establish the WebSocket Connection.
    const wsUrl = `ws://${BASE_URL}/ws/exec?namespace=${encodeURIComponent(
      namespace
    )}&pod=${encodeURIComponent(pod)}&container=${encodeURIComponent(
      container
    )}&command=${encodeURIComponent(command)}&tty=${tty}`;
    
    socket.current = new WebSocket(wsUrl);

    // 3. Handle WebSocket Events.
    socket.current.onopen = () => {
      term.current?.writeln("\x1b[32m[Connected to Pod shell]\x1b[0m");

      // This is the crucial fix for the race condition TypeError.
      // It ensures the terminal is sized only after it's ready and connected.
      fitAddon.current.fit();

      // Send the initial dimensions to the backend.
      const initialSize = {
        type: 'resize',
        cols: term.current?.cols,
        rows: term.current?.rows,
      };
      socket.current?.send(JSON.stringify(initialSize));
    };
    
    socket.current.onmessage = (event) => {
      // Parse stdout messages from the backend.
      try {
        const msg: TerminalMessage = JSON.parse(event.data);
        if (msg.type === 'stdout' && msg.data) {
          term.current?.write(msg.data);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    socket.current.onerror = () => {
      term.current?.writeln("\x1b[31m[WebSocket Error]\x1b[0m");
    };

    socket.current.onclose = () => {
      term.current?.writeln("\n\x1b[33m[Disconnected]\x1b[0m");
    };

    // 4. Handle xterm.js Events.
    // Send user input (stdin) to the backend.
    term.current.onData((data) => {
      const stdinMessage: TerminalMessage = { type: 'stdin', data };
      socket.current?.send(JSON.stringify(stdinMessage));
    });

    // Send new dimensions to the backend when the terminal is resized.
    term.current.onResize(({ cols, rows }) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        const resizeMessage: TerminalMessage = { type: 'resize', cols, rows };
        socket.current.send(JSON.stringify(resizeMessage));
      }
    });

    // 5. Handle Browser Window Resize.
    // This will trigger the term.current.onResize event above.
    const handleResize = () => {
      fitAddon.current.fit();
    };
    window.addEventListener("resize", handleResize);

    // 6. Cleanup function to prevent memory leaks.
    return () => {
      window.removeEventListener("resize", handleResize);
      socket.current?.close();
      term.current?.dispose();
    };
  }, [namespace, pod, container, command, tty]);

  // Restore the dynamic, full-screen styling.
  return (
    <div 
      ref={terminalRef} 
      style={{ 
        width: "100%", 
        height: "85vh" 
      }} 
    />
  );
};

export default TerminalPage;