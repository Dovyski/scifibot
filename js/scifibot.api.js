var ScifiBot = ScifiBot || {};

ScifiBot.api = new function() {
    this.handleError = function (theXhr, theStatus) {
        console.debug('ScifiBot.api.handleError', theXhr, theStatus);
    };

    this.handleSuccess = function (theResponse, theStatus, theXhr) {
        console.debug('ScifiBot.api.handleSuccess', theResponse, theXhr);

        if(!theResponse.success) {
            console.error('API error: ', theResponse.message);
        } else {
            if(theResponse.method == 'sync') {
                ScifiBot.sync.handleNewTitles(theResponse.data, theResponse.timestamp);
            }
        }
    };

    this.invoke = function(theParams, theCallback) {
        $.ajax({
            url: ScifiBot.config.API_ENDPOINT,
            method: 'GET',
            data: theParams,
            dataType: 'json',
            cache: false,
            error: this.handleError,
            success: this.handleSuccess,
            complete: theCallback
        });
    };
};
