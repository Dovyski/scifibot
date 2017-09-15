var ScifiBot = ScifiBot || {};

ScifiBot.device = new function() {
    this.schedulePeriodicCallback = function(theCallback, theContext) {
    };

    this.showNotification = function(theTitle, theMessage, theData) {
        if(ScifiBot.config.IS_CORDOVA) {
            cordova.plugins.notification.local.schedule({
                title: theTitle || "New Message",
                message: theMessage || "Hi, are you ready? We are waiting.",
                data: theData
            });
        } else {
            alert('Hey!');
        }
    };

    this.init = function(theCallback) {
        if(ScifiBot.config.IS_CORDOVA) {
            console.debug('[DEBUG] Running in Cordova mode.');
            document.addEventListener('deviceready', function () {
                console.debug('[deviceready] Device is ready, initing the app.');
                theCallback();
            }, false);
        } else {
            console.debug('[DEBUG] Running in web mode. Firing init callback right away.');
            theCallback();
        }
    };
};
