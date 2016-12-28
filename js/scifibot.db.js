var ScifiBot = ScifiBot || {};

ScifiBot.db = new function() {
    this.INITIAL_DATA = {
        titles: ScifiBot.DATA,
        watched: {},
        following: {},
        list: {},
        settings: ScifiBot.config.SETTINGS
    };

    this.MOVIES = 1;
    this.SERIES = 2;
    this.TYPE_NAMES = {
        1: ['Movie', 'Movies'],
        2: ['TV show', 'Series']
    };

    this.data = null;

    this.load = function() {
        this.data = JSON.parse(window.localStorage.getItem(ScifiBot.config.DATABASE_NAME));

        if(!this.data) {
            console.debug('ScifiBot.db.load() - first time the db is used, adding initial data.');
            this.data = this.INITIAL_DATA;
            this.save();
        }

        console.debug('ScifiBot.db.load() - data loaded from disk');
    };

    this.save = function() {
        window.localStorage.setItem(ScifiBot.config.DATABASE_NAME, JSON.stringify(this.data));
        console.debug('ScifiBot.db.save() - data written to disk.');
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
