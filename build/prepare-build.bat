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

echo Copying config.xml
cp ..\config.xml scifibot\config.xml

echo Preparing cordova stuff
cd scifibot
call cordova prepare

cd ..\..\
chmod 777 -R cordova

echo Done!
echo Build is prepared. Run "build-android.bat" now.
