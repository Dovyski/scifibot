@echo off

REM This script builds and packages the app for distributions as an Android APK

echo Removing old build files
rm -rf ./dist/
mkdir dist
rm -rf ./cordova/scifibot/www/

echo Creating directories
mkdir cordova\scifibot\www\
mkdir cordova\scifibot\www\css
mkdir cordova\scifibot\www\fonts
mkdir cordova\scifibot\www\img
mkdir cordova\scifibot\www\js

echo Copying app files
xcopy ..\*.html .\cordova\scifibot\www\
xcopy ..\css .\cordova\scifibot\www\css\ /E
xcopy ..\fonts .\cordova\scifibot\www\fonts\ /E
xcopy ..\img .\cordova\scifibot\www\img\ /E
xcopy ..\js .\cordova\scifibot\www\js\ /E

echo Adjusting permitions
chmod 755 -R cordova

echo Removing unecessary app files
rm -rf ./cordova/scifibot/www/build
rm -rf ./cordova/scifibot/www/api
rm -rf ./cordova/scifibot/www/img/logo

echo Copying config files

echo Copying distrubution assets

echo Building APK (debug and release)
cd cordova\scifibot\
call cordova build
call cordova build --release

cd ..
cd ..
xcopy .\cordova\scifibot\platforms\android\build\outputs\apk\*.apk .\dist\

echo Done!
echo Final APK file is in the "dist" folder.
