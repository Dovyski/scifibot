var ScifiBot = ScifiBot || {};

// Controls if the app is running in a device or in the browser
var runningOnDevice = false;

ScifiBot.config = {
    // How many chars to display in the plo text
    PLOT_SUMMARY_SIZE: 120,

    // Name of the database used to store app's data
    DATABASE_NAME: 'scifibot_data_20161230',

    // Tell if the app is running on Cordova
    IS_CORDOVA: runningOnDevice,

    // API to be used by the app
    API_ENDPOINT: runningOnDevice ? 'https://scifibot.loopyape.com/v1/api/' : 'http://dev.local.com/scifibot/api/',

    // Version of the database shipped along with the app.
    DATABASE_VERSION: 3,

    // Default settings
    SETTINGS: {
        sync: false,                    // should sync with the server
        syncOnStartup: true,            // should sync when the app starts
        notifyNewTitles: true,          // notify about titles added to the database
        notifyTrackedTitles: true,      // notify about news regarding tracked titles
        useDeviceNotifications: true,   // use Android notifications to broadcast app notifications.
        syncModified: 0,                // Most recent timestamp found in the database.
        lastSync: 0,                    // Timestamp of the last time the app performed a sync operation.
        databaseVersion: 1              // Version of the database in use by the app.
    }
};
