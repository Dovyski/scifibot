@echo off

REM This script builds and packages the app for distributions as an Android APK
REM Usage:
REM    build-android.bat               # build unsigned APKs
REM    build-android.bat <password>    # <password> is a string with a password. Build signed APKs.

SET PATH_APP_ICON_512=..\img\logo\scifibot-logo-512.png

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

echo Creating app icons
rm -rf ./cordova/scifibot/res/icon/android/*.png
magick convert %PATH_APP_ICON_512% -resize 36x36 .\cordova\scifibot\res\icon\android\icon-36-ldpi.png
magick convert %PATH_APP_ICON_512% -resize 48x48 .\cordova\scifibot\res\icon\android\icon-48-mdpi.png
magick convert %PATH_APP_ICON_512% -resize 72x72 .\cordova\scifibot\res\icon\android\icon-72-hdpi.png
magick convert %PATH_APP_ICON_512% -resize 96x96 .\cordova\scifibot\res\icon\android\icon-96-xhdpi.png
magick convert %PATH_APP_ICON_512% -resize 144x144 .\cordova\scifibot\res\icon\android\icon-144-xxhdpi.png
magick convert %PATH_APP_ICON_512% -resize 192x192 .\cordova\scifibot\res\icon\android\icon-192-xxxhdpi.png
magick convert %PATH_APP_ICON_512% -resize 512x512 .\cordova\scifibot\res\icon\android\icon-512-play.png

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
