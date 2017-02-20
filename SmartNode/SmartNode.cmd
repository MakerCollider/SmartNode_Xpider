@echo off
set tmp_path = %path%
path=%path%;%~dp0mplayer
@ node node-red\red.js --userDir %~dp0\node-red -v