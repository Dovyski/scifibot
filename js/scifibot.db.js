var ScifiBot = ScifiBot || {};

ScifiBot.db = new function() {
    this.data = null;

    this.load = function() {
        this.data = JSON.parse(window.localStorage.getItem('data'));

        if(!this.data) {
            console.debug('First time the db is used, adding initial data...');
            this.data = ScifiBot.DATA;
        }

        console.debug('Data loaded from disk', this.data);
    };

    this.flush = function() {
        window.localStorage.setItem('data', JSON.stringify(this.data));
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
        return this.data[theId];
    };
};
