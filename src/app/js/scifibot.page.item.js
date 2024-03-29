var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.item = new function() {
    this.item = null;

    this.renderRatings = function(theItem) {
        var aHtml = '<div class="ratings">';

        if(theItem.imdb_rating) {
            aHtml += '<a href="' + theItem.imdb_url + '"><li><img src="img/rating/imdb.png" class="rating-icon imdb" />' + theItem.imdb_rating.toFixed(1) + '</li></a>';
        }

        if(theItem.metascore_rating) {
            aHtml += '<a href="' + theItem.metascore_url + '"><li><img src="img/rating/metascore.png" class="rating-icon metascore" />' + theItem.metascore_rating + '</li></a>';
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
        this.item = ScifiBot.db.fetch(aItemId);

        if(!this.item) {
            console.error('Unable to load item with id: ' + aItemId);
            return;
        }

        $('#item-card-teaser')
            .css('background-image', 'url(' + this.item.teaser + ')')
            .html(
            '<div class="card-badges">' +
                '<span class="badge-entry not-marked watch-status-' + aItemId + '" data-id="' + this.item.id + '"></span>' +
                '<span class="badge-entry not-marked track-status-' + aItemId + '" data-id="' + this.item.id + '"></span>' +
                '<span class="badge-entry not-marked list-status-' + aItemId + '" data-id="' + this.item.id + '"></span>' +
            '</div>');

        $('#item-block-title').html(
            '<strong>' + this.item.name + '</strong><br/>' +
            '<p class="color-gray">' +
                (this.item.year ? this.item.year : '') +
                (this.item.runtime ? ' &bull; ' + this.item.runtime + ' min' : '') +
                (this.item.publisher ? ' &bull; ' + this.item.publisher : '') +
            '</p>'
        );

        $('#item-block-content').html(
            (ScifiBot.app.settings().showRatings ? this.renderRatings(this.item) : '') +
            '<p class="plot-text">' + (this.item.plot || 'No information available.') + '</p>' +
            '<p class="plot-source">Source: <a href="' + (this.item.plot_source_url || '#') + '" class="external">' + (this.item.plot_source_name || 'Unknown') + '</a></p>'
        );

        if(this.item.trailer) {
            $('a.trailer-link').attr('href', this.item.trailer);
        } else {
            $('.item-watch-trailer').remove();
        }

        $('a.rate-link').attr('href', 'rate.html?id=' + aItemId);
        $('a.similar-link').attr('href', 'similar.html?id=' + aItemId);

        // For now, disable rate and similar titles
        $('.item-rate').remove();
        $('.item-similars').remove();

        this.initInlineButtons(this.item);
    };

    this.refreshInlineButtons = function() {
        var aItemId = ScifiBot.app.views.main.activePage.query.id;

        $('#btn-watch').html(ScifiBot.user.watched(aItemId) ? '<i class="material-icons">check</i> Watched' : '<i class="material-icons">visibility_off</i> Watch');
        $('#btn-follow').html(ScifiBot.user.following(aItemId) ? '<i class="material-icons">notifications_active</i> Tracked' : '<i class="material-icons">notifications</i> Track');
        $('#btn-list').html(ScifiBot.user.list.has(aItemId) ? '<i class="material-icons">playlist_add_check</i> Enqueued' : '<i class="material-icons">playlist_add</i> Enqueue');
    };

    this.initInlineButtons = function(theItem) {
        var aSelf = this;

        $('.item-inline-buttons a').data('item', theItem.id);

        $('#btn-watch').on('click', function () {
            ScifiBot.app.titleToggleWatched(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        $('#btn-follow').on('click', function () {
            ScifiBot.app.titleToggleFollow(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        $('#btn-list').on('click', function () {
            ScifiBot.app.titleToggleList(ScifiBot.app.views.main.activePage.query.id);
            aSelf.refreshInlineButtons();
        });

        this.refreshInlineButtons();
        ScifiBot.app.updateExistingCards(theItem.id);
    };

    this.getNavbarTitle = function() {
        return ScifiBot.db.TYPE_NAMES[this.item.type][0];
    };
};
