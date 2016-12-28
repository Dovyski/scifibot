var ScifiBot = ScifiBot || {};

ScifiBot.sync = new function() {
    this.handleNewContentNotifiation = function(theOldTitleInfo, theNewTitleInfo) {
        console.debug('Notify user about new content');
    };

    this.handleNewTitles = function(theTitles, theTimestamp) {
        var i, aLength = theTitles.length, aModified = 0;

        // First of all, save the time this sync was performed
        // using the server time, so there is no disagreement between
        // client/server time.
        if(theTimestamp && theTimestamp > 0) {
            ScifiBot.db.data.settings.lastSync = theTimestamp;
        }

        if(aLength == 0) {
            console.debug('ScifiBot.sync.handleNewTitles() - No new info received from server. Sync skipped.');
            return;
        }

        for(i = 0; i < aLength; i++) {
            var aTitle = theTitles[i];

            // If the user is following the title, we must create
            // a notification because there is somthing new.
            if(ScifiBot.user.following(aTitle.id)) {
                this.handleNewContentNotifiation(ScifiBot.db.data.titles[aTitle.id], aTitle);
            }

            // Save the most recent timestamp regading modifications.
            // It will be used in the future to request only the data
            // that has changed since that point in time.
            if(aTitle.modified > aModified) {
                aModified = aTitle.modified;
            }

            ScifiBot.db.data.titles[aTitle.id] = aTitle;
        }

        ScifiBot.db.data.settings.syncModified = aModified;
        ScifiBot.db.save();
    };

    this.run = function() {
        ScifiBot.api.invoke({
            method: 'sync',
            since: ScifiBot.db.data.settings.syncModified || 0
        });
    };
};
