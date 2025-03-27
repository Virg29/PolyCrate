#!/bin/sh
echo "window.ENV = {\
  VITE_API_URL: \"$VITE_API_URL\"\
};" > /app/src/config.tsx