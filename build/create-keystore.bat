@echo off

REM This script creates the files required to sign the app before uploading it to Google Play

keytool -genkey -v -keystore scifibot.keystore -alias scifibot -keyalg RSA -keysize 2048 -validity 10000
