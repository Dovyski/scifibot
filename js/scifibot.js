// Export selectors engine
var $ = Dom7;

function updateNavbarTitle(thePage) {
    if(ScifiBot.app.pages[thePage.name]) {
        var aTitle = ScifiBot.app.pages[thePage.name].getNavbarTitle();
        ScifiBot.app.setNavbarTitle(aTitle);
    }
}

for(var aPageId in ScifiBot.app.pages) {
    ScifiBot.app.core.onPageAfterAnimation(aPageId, updateNavbarTitle);
    ScifiBot.app.core.onPageBeforeAnimation(aPageId, updateNavbarTitle);

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
