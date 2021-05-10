# pi-display

This is a webpage that runs on a Raspberry Pi in front of my front door. 

It show the time, weather, and a QR code that configures the Wifi (if your phone supports it). 
This repo also has a bash script that pulls the latest version from GitHub and generates a javascript file with an array of paths to the videos/images to display as a background. 
This way I can move large video files over FTP without having to keep them in the repo. When I'm done adding changes (to code or backgrounds) I SSH and `kill -9 -1`. This restarts
the X server and runs my startup script. 
