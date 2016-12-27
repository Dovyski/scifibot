var ScifiBot = ScifiBot || {};

ScifiBot.api = new function() {
    this.API_ENDPOINT = 'http://dev.local.com/scifibot/api/';

    this.handleError = function (theXhr, theStatus) {
        console.debug('ScifiBot.api.handleError', theXhr, theStatus);
    };

    this.handleSuccess = function (theResponse, theStatus, theXhr) {
        console.debug('ScifiBot.api.handleSuccess', theResponse, theXhr);

        if(!theResponse.success) {
            console.error('API error: ', theResponse.message);
        } else {
            if(theResponse.method == 'sync') {
                ScifiBot.sync.handleNewTitles(theResponse.data);
            }
        }
    };

    this.invoke = function(theParams) {
        $.ajax({
            url: this.API_ENDPOINT,
            method: 'GET',
            data: theParams,
            dataType: 'json',
            cache: false,
            error: this.handleError,
            success: this.handleSuccess,
        });
    };

    this.sync = function() {
        this.invoke({
            method: 'sync',
            since: ScifiBot.db.data.settings.lastTitleTimestamp || 0
        });
    };
};
