var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.settings = new function() {
    this.init = function(thePage) {
        console.debug('scifibot.page.settings.init()', thePage);

        $('input[type=checkbox]').each(function () {
            var aName = $(this).attr('name');
            this.checked = ScifiBot.db.data.settings[aName];
        });

        $('input[type=checkbox]').on('change', function (theEvent) {
            var aName = $(this).attr('name');
            ScifiBot.db.data.settings[aName] = this.checked;
            ScifiBot.db.save();
        });

        ScifiBot.app.setNavbarTitle('Settings');
    };
};
