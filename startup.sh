#!/bin/bash
cd /home/pi/pi-display
git pull origin master
cd /home/pi/pi-display/art
echo "let fileList = [" > /home/pi/pi-display/fileList.js
files=(*)
n=0
for current in "${files[@]}"; do
	n=$(($n+1))
	if [ $n -lt ${#files[@]} ]
	then
		printf "%s %s\n" "'$current'""," >> /home/pi/pi-display/fileList.js
	else
		printf "%s %s\n" "'$current'" >> /home/pi/pi-display/fileList.js
	fi
done
echo "]" >> /home/pi/pi-display/fileList.js
