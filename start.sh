#!/bin/bash
# Start Claude Monitor - keeps running after session ends
cd "$(dirname "$0")"

# Kill any existing instance AND chromium leftovers
pkill -f "node.*server.js" 2>/dev/null
pkill -f "chromium.*--headless" 2>/dev/null
sleep 2

# Start with setsid to detach from terminal completely
setsid node server.js > /tmp/claude-monitor.log 2>&1 &
echo "Claude Monitor started (PID: $!)"
echo "Log: /tmp/claude-monitor.log"
echo "URL: http://0.0.0.0:3456"
