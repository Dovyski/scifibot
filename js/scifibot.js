// Export selectors engine
var $ = Dom7;

// Add an init listener to all existing pages/screens
for(var aPageId in ScifiBot.app.pages) {
    ScifiBot.app.core.onPageInit(aPageId, function(thePage) {
        console.debug('scifibot.onPageInit', thePage.name, ScifiBot.app.pages[thePage.name], thePage);

        ScifiBot.app.updateNavbar();

        if(ScifiBot.app.pages[thePage.name]) {
            ScifiBot.app.pages[thePage.name].init(thePage);
        }
    });
}

// Set a global error handler, not connected to the app itself.
window.onerror = function (theMsg, theURL, theLineNo, theColumnNo, theError)  {
    window.location.href = 'error.html';
};

// Initialize app and start the party \m/
ScifiBot.app.init();
