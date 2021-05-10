
# pi-display

This is a webpage that runs on a Raspberry Pi in front of my front door. 
![PXL_20210510_031324095](https://user-images.githubusercontent.com/44104194/117602232-27374180-b11e-11eb-99c2-f1d184b0edeb.jpg)

It show the time, weather, and a QR code that configures the Wifi (if your phone supports it). 
https://user-images.githubusercontent.com/44104194/117602276-4635d380-b11e-11eb-9767-c72bc82f512f.mp4

This repo also has a bash script that pulls the latest version from GitHub and generates a javascript file with an array of paths to the videos/images to display as a background. 
This way I can move large video files over FTP without having to keep them in the repo. 
When I'm done adding changes (to code or backgrounds) I SSH in and `kill -9 -1`. This restarts the X server and runs my startup script. 
