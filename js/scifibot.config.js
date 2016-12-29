var ScifiBot = ScifiBot || {};

ScifiBot.config = {
    API_ENDPOINT: 'http://192.168.0.104/scifibot/api/',

    // Name of the database used to store app's data
    DATABASE_NAME: 'scifibot_data_20161227',

    // Version of the database shipped along with the app.
    DATABASE_VERSION: 3,

    // Default settings
    SETTINGS: {
        sync: true,                     // should sync with the server
        notifyNewTitles: true,          // notify about titles added to the database
        notifyTrackedTitles: true,      // notify about news regarding tracked titles
        useDeviceNotifications: true,   // use Android notifications to broadcast app notifications.
        syncModified: 0,                // Most recent timestamp found in the database.
        lastSync: 0,                    // Timestamp of the last time the app performed a sync operation.
        databaseVersion: 1              // Version of the database in use by the app.
    }
};
