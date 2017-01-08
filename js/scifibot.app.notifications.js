var ScifiBot = ScifiBot || {};

ScifiBot.Notification = function(theType, theTitleId, theTime) {
    this.type = theType;                    // Type of the notification. It can be any of ScifiBot.Notification.TITLE_*.
    this.read = false;                      // If the notification has been read by the user
    this.title = theTitleId;                // Id of the title related to this notification
    this.time = theTime || Date.now();      // When this notification was created. Time is local and not related to the server.
}

ScifiBot.Notification.TITLE_ADDED = "titleAdded";
ScifiBot.Notification.TITLE_RELEASED = "titleReleased";

ScifiBot.app.notifications = new function() {
    this.nextId = function() {
        return ScifiBot.db.data.notifications.id++;
    };

    this.add = function(theNotification) {
        theNotification.id = this.nextId();

        ScifiBot.db.data.notifications.entries.push(theNotification);
        ScifiBot.db.save();

        ScifiBot.app.updateNotificationBadges();

        return theNotification;
    };

    this.remove = function(theNotificationId) {
        var i, aRemoved = false, aNotifications = this.all(), aLength = aNotifications.length;

        for(i = 0; i < aLength; i++) {
            if(aNotifications[i].id == theNotificationId) {
                aNotifications.splice(i, 1);
                aRemoved = true;
                break;
            }
        }

        if(aRemoved) {
            ScifiBot.db.save();
        }

        return aRemoved;
    };

    this.all = function() {
        return ScifiBot.db.data.notifications.entries;
    };

    this.unreadCount = function() {
        var i, aCount = 0, aNotifications = this.all(), aLength = aNotifications.length;

        for(i = 0; i < aLength; i++) {
            if(!aNotifications[i].read) {
                aCount++;
            }
        }

        return aCount;
    };
};
