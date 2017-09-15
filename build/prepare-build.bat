@echo off

REM This file installs all tools required to build and package the
REM the app for distribution.
REM Source: https://ccoenraets.github.io/cordova-tutorial/create-cordova-project.html

echo Installing Apache Cordova
call npm install -g cordova

echo Installing Android stuff
call sdkmanager "platforms;android-26"
call sdkmanager "build-tools;26.0.0"

echo Removing old build files
rm -rf cordova

echo Creating output directories
mkdir cordova
cd cordova

echo Creating cordova project
call cordova create scifibot com.loopyape.scifibot ScifiBot
cd scifibot
call cordova platforms add android
call cordova plugin add cordova-plugin-device
call cordova plugin add cordova-plugin-app-event
call cordova plugin add cordova-plugin-local-notification
call cordova plugin add cordova-plugin-dialogs

cd ..\..\
chmod 777 -R cordova

echo Done!
echo Build is prepared. Run "build-android.bat" now.