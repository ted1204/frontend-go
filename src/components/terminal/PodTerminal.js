import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { BASE_URL } from '../../config/url';
import 'xterm/css/xterm.css';
import { useTranslation } from '@tailadmin/utils';
const TerminalPage = ({ namespace, pod, container, command = 'bash', tty = true, }) => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const socket = useRef(null);
    const fitAddon = useRef(new FitAddon());
    const { t } = useTranslation();
    useEffect(() => {
        // t is used inside websocket event handlers below
        if (!terminalRef.current)
            return;
        // 1. Initialize the Terminal with a modern, dark theme.
        term.current = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            letterSpacing: 0.5,
            lineHeight: 1.3,
            fontFamily: '"FiraCode Nerd Font", Consolas, "Courier New", monospace',
            theme: {
                background: 'transparent',
                foreground: '#d4d4d4',
                cursor: '#a9b7c6',
                selectionBackground: '#525252',
                black: '#000000',
                red: '#ef5350',
                green: '#c3e88d',
                yellow: '#ffcb6b',
                blue: '#82aaff',
                magenta: '#c792ea',
                cyan: '#89ddff',
                white: '#ffffff',
                brightBlack: '#546e7a',
                brightRed: '#ff5370',
                brightGreen: '#c3e88d',
                brightYellow: '#ffcb6b',
                brightBlue: '#82aaff',
                brightMagenta: '#c792ea',
                brightCyan: '#89ddff',
                brightWhite: '#ffffff',
            },
        });
        term.current.loadAddon(fitAddon.current);
        term.current.open(terminalRef.current);
        // 2. Establish the WebSocket Connection.
        const wsUrl = `ws://${BASE_URL}/ws/exec?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(pod)}&container=${encodeURIComponent(container)}&command=${encodeURIComponent(command)}&tty=${tty}`;
        socket.current = new WebSocket(wsUrl);
        // 3. Handle WebSocket Events.
        socket.current.onopen = () => {
            term.current?.writeln(`\x1b[38;5;154m[${t('terminal.connected')}]\x1b[0m`);
            fitAddon.current.fit();
            const initialSize = {
                type: 'resize',
                cols: term.current?.cols,
                rows: term.current?.rows,
            };
            socket.current?.send(JSON.stringify(initialSize));
        };
        socket.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'stdout' && msg.data) {
                    term.current?.write(msg.data);
                }
            }
            catch (e) {
                console.error('Failed to parse websocket message', e);
            }
        };
        socket.current.onerror = () => {
            term.current?.writeln(`\x1b[31m[${t('terminal.websocketError')}]\x1b[0m`);
        };
        socket.current.onclose = () => {
            term.current?.writeln(`\n\x1b[38;5;220m[${t('terminal.disconnected')}]\x1b[0m`);
        };
        // 4. Handle xterm.js Events.
        term.current.onData((data) => {
            const stdinMessage = { type: 'stdin', data };
            socket.current?.send(JSON.stringify(stdinMessage));
        });
        term.current.onResize(({ cols, rows }) => {
            if (socket.current?.readyState === WebSocket.OPEN) {
                const resizeMessage = { type: 'resize', cols, rows };
                socket.current.send(JSON.stringify(resizeMessage));
            }
        });
        // 5. Handle Browser Window Resize.
        const handleResize = () => {
            fitAddon.current.fit();
        };
        window.addEventListener('resize', handleResize);
        // 6. Cleanup function to prevent memory leaks.
        return () => {
            window.removeEventListener('resize', handleResize);
            socket.current?.close();
            term.current?.dispose();
        };
    }, [namespace, pod, container, command, tty, t]);
    return (_jsx("div", { ref: terminalRef, className: "\n        w-full \n        h-[80vh] \n        p-4 \n        bg-gray-800 \n        shadow-2xl \n        rounded-lg \n        border border-gray-700\n      " }));
};
export default TerminalPage;
