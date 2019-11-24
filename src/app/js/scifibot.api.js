var ScifiBot = ScifiBot || {};

ScifiBot.api = new function() {
    this.callback = null;
    this.callbackContext = null;

    this.handleError = function (theXhr, theStatus) {
        console.debug('ScifiBot.api.handleError', theXhr, theStatus);
    };

    this.handleSuccess = function (theResponse, theStatus, theXhr) {
        console.debug('ScifiBot.api.handleSuccess', theResponse, theXhr);

        if(!theResponse.success) {
            console.error('API error: ', theResponse.message);
        } else {
            if(ScifiBot.api.callback != null) {
                ScifiBot.api.callback.call(ScifiBot.api.callbackContext, theResponse.data, theResponse.timestamp);
            }

            ScifiBot.api.callback = null;
            ScifiBot.api.callbackContext = null;
        }
    };

    this.invoke = function(theParams, theCallback, theCallbackContext) {
        this.callback = theCallback;
        this.callbackContext = theCallbackContext;

        $.ajax({
            url: ScifiBot.config.API_ENDPOINT,
            method: 'GET',
            data: theParams,
            dataType: 'json',
            cache: false,
            error: this.handleError,
            success: this.handleSuccess
        });
    };
};
