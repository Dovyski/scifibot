var ScifiBot = ScifiBot || {};

ScifiBot.db = new function() {
    this.DATABASE_NAME = 'scifibot_data_20161205';
    this.data = null;

    this.load = function() {
        this.data = JSON.parse(window.localStorage.getItem(this.DATABASE_NAME));

        if(!this.data) {
            console.debug('First time the db is used, adding initial data...');
            this.data = {
                titles: ScifiBot.DATA,
                watched: {},
                following: {},
                list: {}
            };

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
};
