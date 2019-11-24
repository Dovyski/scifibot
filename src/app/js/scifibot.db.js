var ScifiBot = ScifiBot || {};

ScifiBot.db = new function() {
    this.INITIAL_DATA = {
        titles: ScifiBot.config.DATABASE_DATA,
        watched: {},
        following: {},
        list: {},
        notifications: { id: 1, entries: []},
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
        var aId = theObject.id, aCreated = false;

        if(!this.data.titles[aId]) {
            this.data.titles[aId] = {};
            aCreated = true;
        }

        for(var aProp in theObject) {
            this.data.titles[aId][aProp] = theObject[aProp];
        }

        console.debug('ScifiBot.db.update() - ' + (aCreated ? 'created title with id=' : 'updated title with id=') + aId);

        return aCreated;
    };

    this.fetch = function(theId) {
        return this.data.titles[theId];
    };

    this.find = function(theFields) {
        theFields = theFields || {};

        var aType = theFields['type'] || this.MOVIES;
        var aRet = {};        

        for(var aId in this.data.titles) {
            if(this.data.titles[aId].type == aType && this.data.titles[aId].active) {
                aRet[aId] = this.data.titles[aId];
            }
        }

        return aRet;
    };
};
