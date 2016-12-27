var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.item = new function() {
    this.init = function(thePage) {
        console.debug('scifibot.page.item.init()', thePage);

        var aItemId = thePage.query.id;
        var aItem = ScifiBot.db.fetch(aItemId);

        if(!aItem) {
            console.error('Unable to load item with id: ' + aItemId);
            return;
        }

        $('#item-card-teaser').css('background-image', 'url(' + aItem.teaser + ')');
        $('#item-block-title').html('<strong>' + aItem.name + '</strong><br/><p class="color-gray">{publisher} &bull; ' + aItem.released + '</p>');

        $('#item-block-content').html(
            '<p class="color-gray"><i class="material-icons">star</i> 8/10 <i class="material-icons">star</i> 92% <i class="material-icons">star</i> 80%</p>' +
            '<p>' + aItem.plot + '</p>'
        );

        $('a.trailer-link').attr('href', 'https://youtube.com');
        $('a.rate-link').attr('href', 'rate.html?id=' + aItemId);
        $('a.similar-link').attr('href', 'similar.html?id=' + aItemId);

        this.initInlineButtons(aItem);
        ScifiBot.app.setNavbarTitle(ScifiBot.db.TYPE_NAMES[aItem.type][0]);
    };

    this.refreshInlineButtons = function() {
        var aItemId = ScifiBot.app.views.main.activePage.query.id;

        $('#btn-watch').html(ScifiBot.user.watched(aItemId) ? '<i class="material-icons">check</i> Watched' : '<i class="material-icons">visibility_off</i> Not watched');
        $('#btn-follow').html(ScifiBot.user.following(aItemId) ? '<i class="material-icons">notifications_active</i> Tracked' : '<i class="material-icons">notifications</i> Not tracked');
        $('#btn-list').html(ScifiBot.user.list.has(aItemId) ? '<i class="material-icons">playlist_add_check</i> In list' : '<i class="material-icons">playlist_add</i> Not in list');

        ScifiBot.app.updateExistingCards(aItemId);
    };

    this.initInlineButtons = function(theItem) {
        var aSelf = this;

        $('.item-inline-buttons a').data('item', theItem.id);

        this.refreshInlineButtons();

        $('#btn-watch').on('click', function () {
            ScifiBot.user.toggleWatched(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        $('#btn-follow').on('click', function () {
            var aFollowing = ScifiBot.user.toggleFollowing(ScifiBot.app.views.main.activePage.query.id);

            if(aFollowing) {
                ScifiBot.app.core.addNotification({
                    message: 'You will be notified about important news regarding this title.',
                    button: {
                        text: 'CLOSE',
                        color: 'orange'
                    }
                });
            }

            aSelf.refreshInlineButtons();
        });

        $('#btn-list').on('click', function () {
            ScifiBot.user.list.toggle(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });
    };
};
