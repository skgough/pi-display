#!/bin/bash
cd /home/pi/display/
python -m SimpleHTTPServer
chromium-browser --app="http://localhost:8000"