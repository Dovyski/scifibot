var ScifiBot = ScifiBot || {};

ScifiBot.sync = new function() {
    this.handleNewContentNotifiation = function(theOldTitle, theNewTitle) {
        var aSettings = ScifiBot.app.settings();

        if(!theOldTitle) {
            // There is no previous entry for this title, it is a brand new
            // entry in the catalog /o/
            if(aSettings.notifyNewTitles) {
                ScifiBot.app.notifications.add(new ScifiBot.Notification(ScifiBot.Notification.TITLE_ADDED, theNewTitle.id));
            }
        } else {
            // The entry already existed, it has only been updated.
            // If the user is following the title, we must create
            // a notification about it.
            if(ScifiBot.user.following(theNewTitle.id)) {
                if(theNewTitle.released) {
                    ScifiBot.app.notifications.add(new ScifiBot.Notification(ScifiBot.Notification.TITLE_RELEASED, theNewTitle.id));
                }
            }
        }
    };

    this.handleNewTitles = function(theTitles, theTimestamp) {
        var i, aLength = theTitles.length, aModified = 0;

        // First of all, save the time this sync was performed
        // using the server time, so there is no disagreement between
        // client/server time.
        if(theTimestamp && theTimestamp > 0) {
            ScifiBot.app.settings().lastSync = theTimestamp;
        }

        if(aLength == 0) {
            console.debug('ScifiBot.sync.handleNewTitles() - No new info received from server. Sync skipped.');
            return;
        }

        for(i = 0; i < aLength; i++) {
            var aTitle = theTitles[i];

            // Notify the user about new concent, according to notification settings
            this.handleNewContentNotifiation(ScifiBot.db.fetch(aTitle.id), aTitle);

            // Save the most recent timestamp regading modifications.
            // It will be used in the future to request only the data
            // that has changed since that point in time.
            if(aTitle.modified > aModified) {
                aModified = aTitle.modified;
            }

            ScifiBot.db.update(aTitle);
        }

        ScifiBot.app.settings().syncModified = aModified;
        ScifiBot.db.save();
    };

    // Performs a sync operation offline, using the data from ScifiBot.DATA
    // as a source of information.
    this.offlineRun = function() {
        var aItemsToUpdate = [];

        if(ScifiBot.config.DATABASE_VERSION <= ScifiBot.app.settings().databaseVersion) {
            console.debug('ScifiBot.sync.offlineRun() - Installed db is up to date, offline sync skipped.');
            return;
        }

        console.debug('ScifiBot.sync.offlineRun() - performing sync.');

        for(var aId in ScifiBot.config.DATABASE_DATA) {
            var aNewTitle = ScifiBot.config.DATABASE_DATA[aId], aOldTitle = ScifiBot.db.fetch(aId);

            if(aNewTitle.modified > aOldTitle.modified) {
                aItemsToUpdate.push(aNewTitle);
            }
        }

        if(aItemsToUpdate.length > 0) {
            this.handleNewTitles(aItemsToUpdate);
        }

        ScifiBot.app.settings().databaseVersion = ScifiBot.config.DATABASE_VERSION;
        ScifiBot.db.save();
    };

    // Performs a sync operation online, using the REST API as a source of
    // information.
    this.onlineRun = function(theCallback) {
        var aSince = ScifiBot.app.settings().syncModified || 0;

        console.debug('ScifiBot.sync.onlineRun() - Starting online sync.', aSince);

        ScifiBot.api.invoke({
            method: 'sync',
            since: aSince,
        }, theCallback);
    };
};
