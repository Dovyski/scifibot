@echo off

REM This script builds and packages the app for distributions as an Android APK
REM Usage:
REM    build-android.bat               # build unsigned APKs
REM    build-android.bat <password>    # <password> is a string with a password. Build signed APKs.

echo Removing old build files
rm -rf ./dist/
rm -rf ./cordova/scifibot/platforms/android/build/outputs/apk/*.apk
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

echo Copying config.xml
cp config.xml ./cordova/scifibot/config.xml

echo Building APK (debug and release)
cd cordova\scifibot\

echo Removing development plugins
REM cordova plugin rm org.apache.cordova.console --save

echo Building APKs

if [%1]==[] goto notsigned
echo Generating signed APK using provided password
call cordova build --release -- --keystore=..\..\scifibot.keystore --storePassword=%1 --alias=scifibot --password=%1
goto finalize

:notsigned

call cordova build
call cordova build --release

:finalize

cd ..
cd ..

echo Copying APKs to dist folder
xcopy .\cordova\scifibot\platforms\android\build\outputs\apk\*.apk .\dist\

echo All done!
echo Final APK files are in the "dist" folder.
