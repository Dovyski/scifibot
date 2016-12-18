var ScifiBot = ScifiBot || {};

ScifiBot.user = new function() {
    this.watched = function(theId) {
        return ScifiBot.db.data.watched[theId] == true;
    };

    this.setWatched = function(theId, theStatus) {
        ScifiBot.db.data.watched[theId] = theStatus;
        ScifiBot.db.save();
        console.debug('user.watching', theId, theStatus);
        return theStatus;
    };

    this.toggleWatched = function(theId) {
        return this.setWatched(theId, !this.watched(theId));
    };

    this.following = function(theId) {
        return ScifiBot.db.data.following[theId] == true;
    };

    this.setFollowing = function(theId, theStatus) {
        ScifiBot.db.data.following[theId] = theStatus;
        ScifiBot.db.save();
        console.debug('user.following', theId, theStatus);
        return theStatus;
    };

    this.toggleFollowing = function(theId) {
        return this.setFollowing(theId, !this.following(theId));
    };

    this.list = new function() {
        this.has = function(theId) {
            return ScifiBot.db.data.list[theId];
        };

        this.add = function(theId) {
            ScifiBot.db.data.list[theId] = theId;
            ScifiBot.db.save();
            console.debug('user.list.add', theId);
        };

        this.remove = function(theId) {
            delete ScifiBot.db.data.list[theId];
            ScifiBot.db.save();
            console.debug('user.list.remove', theId);
        };

        this.toggle = function(theId) {
            var aHas = this.has(theId);

            if(aHas) {
                this.remove(theId);
            } else {
                this.add(theId);
            }

            return !aHas;
        };
    };
};
