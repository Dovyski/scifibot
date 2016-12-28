var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.settings = new function() {
    this.updateSyncStatus = function() {
        var aLastSyncMs = ScifiBot.app.settings().lastSync * 1000;

        $('#settings-last-sync span').html(new timeago().format(aLastSyncMs));
        $('#settings-last-sync a').html('<i class="material-icons">sync</i> Sync now');
    };

    this.handleSyncNowLink = function() {
        ScifiBot.sync.onlineRun(ScifiBot.page.settings.updateSyncStatus);
        $('#settings-last-sync a').html('<i class="material-icons md-spin">sync</i>');
    };

    this.changeVisibilitySyncAction = function(theVisible) {
        if(theVisible) {
            $('#settings-last-sync').show();
        } else {
            $('#settings-last-sync').hide();
        }
    };

    this.init = function(thePage) {
        console.debug('scifibot.page.settings.init()', thePage);

        $('input[type=checkbox]').each(function () {
            var aName = $(this).attr('name'), aSettings = ScifiBot.app.settings();
            this.checked = aSettings[aName];

            if(aName == 'sync') {
                ScifiBot.page.settings.changeVisibilitySyncAction(this.checked);
            }
        });

        $('input[type=checkbox]').on('change', function (theEvent) {
            var aName = $(this).attr('name'), aSettings = ScifiBot.app.settings();
            aSettings[aName] = this.checked;
            ScifiBot.db.save();

            if(aName == 'sync') {
                ScifiBot.page.settings.changeVisibilitySyncAction(this.checked);
            }
        });

        this.updateSyncStatus();
        $('#settings-last-sync a').on('click', this.handleSyncNowLink);

        ScifiBot.app.setNavbarTitle('Settings');
    };
};
