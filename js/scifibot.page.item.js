var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.item = new function() {
    this.renderRatings = function(theItem) {
        var aHtml = '<div class="ratings">';

        if(theItem.imdb_rating) {
            aHtml += '<a href="' + theItem.imdb_url + '"><li><img src="img/rating/imdb.png" class="rating-icon imdb" />' + theItem.imdb_rating.toFixed(1) + '</li></a>';
        }

        if(theItem.metascore_rating) {
            aHtml += '<a href="' + theItem.metascore_url + '"><li><img src="img/rating/metascore.png" class="rating-icon metascore" />' + theItem.metascore_rating + '%</li></a>';
        }

        if(theItem.rotten_tomatoes_rating) {
            aHtml += '<a href="' + theItem.rotten_tomatoes_url + '"><li><img src="img/rating/rotten_tomatoes.png" class="rating-icon rotten-tomatoes" />' + theItem.rotten_tomatoes_rating + '%</li></a>';
        }

        aHtml += '</div>';

        return aHtml;
    };

    this.init = function(thePage) {
        console.debug('scifibot.page.item.init()', thePage);

        var aItemId = thePage.query.id;
        var aItem = ScifiBot.db.fetch(aItemId);

        if(!aItem) {
            console.error('Unable to load item with id: ' + aItemId);
            return;
        }

        $('#item-card-teaser').css('background-image', 'url(' + aItem.teaser + ')');
        $('#item-block-title').html(
            '<strong>' + aItem.name + '</strong><br/>' +
            '<p class="color-gray">' +
                (aItem.year ? aItem.year : '') +
                (aItem.runtime ? ' &bull; ' + aItem.runtime + ' min' : '') +
                (aItem.publisher ? ' &bull; ' + aItem.publisher : '') +
            '</p>'
        );

        $('#item-block-content').html(
            this.renderRatings(aItem) +
            '<p class="plot-text">' + (aItem.plot || 'No information available.') + '</p>' +
            '<p class="plot-source">Source: <a href="' + aItem.wikipedia_url + '" class="external">Wikipedia</a></p>'
        );

        if(aItem.trailer) {
            $('a.trailer-link').attr('href', aItem.trailer);
        } else {
            $('.item-watch-trailer').remove();
        }

        $('a.rate-link').attr('href', 'rate.html?id=' + aItemId);
        $('a.similar-link').attr('href', 'similar.html?id=' + aItemId);

        // For now, disable rate and similar titles
        $('.item-rate').remove();
        $('.item-similars').remove();

        this.initInlineButtons(aItem);
        ScifiBot.app.setNavbarTitle(ScifiBot.db.TYPE_NAMES[aItem.type][0]);
    };

    this.refreshInlineButtons = function() {
        var aItemId = ScifiBot.app.views.main.activePage.query.id;

        $('#btn-watch').html(ScifiBot.user.watched(aItemId) ? '<i class="material-icons">check</i> Watched' : '<i class="material-icons">visibility_off</i> Not watched');
        $('#btn-follow').html(ScifiBot.user.following(aItemId) ? '<i class="material-icons">notifications_active</i> Tracked' : '<i class="material-icons">notifications</i> Not tracked');
        $('#btn-list').html(ScifiBot.user.list.has(aItemId) ? '<i class="material-icons">playlist_add_check</i> In list' : '<i class="material-icons">playlist_add</i> Not in list');
    };

    this.initInlineButtons = function(theItem) {
        var aSelf = this;

        $('.item-inline-buttons a').data('item', theItem.id);

        this.refreshInlineButtons();

        $('#btn-watch').on('click', function () {
            ScifiBot.app.titleToggleWatched(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        $('#btn-follow').on('click', function () {
            ScifiBot.app.titleToggleFollow(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        $('#btn-list').on('click', function () {
            ScifiBot.app.titleToggleList(ScifiBot.app.views.main.activePage.query.id)
            aSelf.refreshInlineButtons();
        });
    };
};
