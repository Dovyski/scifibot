# Build

This directory contains the scripts required to build and package the app for distributions. The mentioned scripts
will create subfolders within this directory to house the generated files.

**NOTICE: Before building the app, make sure the Android SDK has been downloaded and is available in your path.**

In order to prepare the build process, make sure you are in the `build` folder. After run the following as adminstrator:

```
prepare-build.bat
```

It will download Apache Cordova and create the required project folders, i.e. a folder named `cordova`. After that, you can build the app:

```
build-android.bat
```

It will create a folder named `dist`. The apk will be in that folder.
