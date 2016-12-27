var ScifiBot = ScifiBot || {};

ScifiBot.db = new function() {
    this.INITIAL_DATA = {
        titles: ScifiBot.DATA,
        watched: {},
        following: {},
        list: {},
        settings: {
            sync: true,
            notifyNewTitles: true,
            notifyTrackedTitles: true,
            useDeviceNotifications: true,
            lastTitleTimestamp: 0
        }
    };

    this.MOVIES = 1;
    this.SERIES = 2;
    this.TYPE_NAMES = {
        1: ['Movie', 'Movies'],
        2: ['TV show', 'Series']
    };

    this.DATABASE_NAME = 'scifibot_data_20161226';
    this.data = null;

    this.load = function() {
        this.data = JSON.parse(window.localStorage.getItem(this.DATABASE_NAME));

        if(!this.data) {
            console.debug('First time the db is used, adding initial data...');
            this.data = this.INITIAL_DATA;
            this.save();
        }

        console.debug('Data loaded from disk', this.data);
    };

    this.save = function() {
        window.localStorage.setItem(this.DATABASE_NAME, JSON.stringify(this.data));
        console.debug('Data written to disk');
    };

    this.update = function(theObject) {
        var aId = theObject.id, aSuccess = false;

        if(this.data[aId]) {
            for(var aProp in theObject) {
                this.data[aId][aProp] = theObject[aProp];
            }
            aSuccess = true;
        }

        return aSuccess;
    };

    this.fetch = function(theId) {
        return this.data.titles[theId];
    };

    this.find = function(theFields) {
        var aRet = {};
        var aType = theFields['type'] || this.MOVIES;

        for(var aId in this.data.titles) {
            if(this.data.titles[aId].type == aType) {
                aRet[aId] = this.data.titles[aId];
            }
        }

        return aRet;
    };
};
