#!/bin/sh\n\
echo "window.ENV = {\n\
  VITE_API_URL: \"$VITE_API_URL\"\n\
};" > /app/dist/config.js