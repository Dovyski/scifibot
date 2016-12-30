var ScifiBot = ScifiBot || {};

// Export selectors engine
var $ = Dom7;

ScifiBot.app = new function() {
    this.activeItem = null;

    // List of pages/screens in the app.
    // They are indexed by id.
    this.pages = {
        index: ScifiBot.page.index,
        item: ScifiBot.page.item,
        rate: null,
        similar: null,
        settings: ScifiBot.page.settings,
        about: null,
        mylist: null,
        notifications: ScifiBot.page.notifications
    };

    // Framework7 access point
    this.core = new Framework7({
        material: true,
        init: false // disable app's automatica initialization
    });

    // List of views
    this.views = {
        main: this.core.addView('.view-main', {
            dynamicNavbar: true // Because we use fixed-through navbar we can enable dynamic navbar
        })
    };

    this.init = function() {
        // Check if the database being used is the most recent one.
        // If it is not, update it based on the database shipped with the app.
        ScifiBot.db.load();
        ScifiBot.sync.offlineRun();

        this.core.init();
        this.initUI();
    };

    this.handlePageBack = function() {
        this.views.main.router.back();
        this.updateNavbar();
    };

    this.updateNavbar = function() {
        if(this.views.main.activePage.name == "index") {
            $('#btn-menu').html('<i class="material-icons">menu</i> <span class="notifications-count badge bg-red"></span>');
            this.showButtons(['btn-menu', 'btn-filter', 'btn-search']);

        } else {
            $('#btn-menu').html('<i class="material-icons">arrow_back</i>');
            this.hideButtons(['btn-filter', 'btn-search']);
        }

        this.setNavbarTitle(this.views.main.activePage.name);
    };

    this.setNavbarTitle = function(theString) {
        $('#navbar-title').text(theString);
    };

    this.hideButtons = function(theButtonIds) {
        var i, aLength = theButtonIds.length;

        for(i = 0; i < aLength; i++) {
            $('#' + theButtonIds[i]).css({opacity: 0, pointerEvents: 'none'});
            ;
        }
    }

    this.showButtons = function(theButtonIds) {
        var i, aLength = theButtonIds.length;

        for(i = 0; i < aLength; i++) {
            $('#' + theButtonIds[i]).css({opacity: 1.0, pointerEvents: 'auto'});
        }
    };

    this.generateItemCard = function(theId) {
        var aHtml = '', aItem = ScifiBot.db.fetch(theId);

        if(!aItem) {
            console.error('Unknown item with id: ' + theId);
            return '[Oops, something wrong!]';
        }

        aHtml +=
            '<div class="card card-header-pic">' +
              '<div style="background-image:url(' + aItem.teaser + ')" valign="bottom" class="card-header color-white">' +
                '<span class="watch-status watch-status-' + theId + '" data-id="' + aItem.id + '"></span>' +
              '</div>' +
              '<div class="card-content">' +
                '<div class="card-content-inner">' +
                  '<p class="color-gray">' + aItem.name + '</p>' +
                  '<p>' + (aItem.plot || 'No information available.') + '</p>' +
                  '<div class="item-buttons">' +
                    '<a href="#" data-id="' + aItem.id + '" class="link item-actions"><i class="material-icons">list</i> Actions</a>' +
                    '<a href="item.html?id=' + theId + '" class="link item-info">More <i class="material-icons">chevron_right</i></a>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>';

        return aHtml;
    }

    this.updateWatchedBadge = function(theItemId) {
        if(ScifiBot.user.watched(theItemId)) {
            $('.watch-status-' + theItemId).addClass('badge-watched').html('<i class="material-icons">check</i> WATCHED</span>');
        } else {
            $('.watch-status-' + theItemId).removeClass('badge-watched').html('');
        }
    };

    this.updateExistingCards = function(theItemId) {
        if(theItemId) {
            // Update the card of an specific item
            ScifiBot.app.updateWatchedBadge(theItemId);
        } else {
            // Update all cards of the app.
            $('.watch-status').each(function(theKey, theValue) {
                ScifiBot.app.updateWatchedBadge($(theValue).data('id'));
            });
        }
    };

    this.handleClickMainMenuButton = function() {
        if(ScifiBot.app.views.main.activePage.name == 'index') {
             ScifiBot.app.core.openPanel('left');
        } else {
            ScifiBot.app.handlePageBack();
        }
    };

    this.handleClickSearchButton = function() {
        // TODO: implement search
        alert('Sorry, this feature is not working at the moment.');
    };

    this.initUI = function() {
        $('a.menu-item').on('click', function() {
            ScifiBot.app.core.closePanel();
            ScifiBot.app.views.main.router.load({
                url: $(this).data('url'),
                ignoreCache: true
            });
            console.debug('Menu click');
        });

        $('#btn-menu').on('click', this.handleClickMainMenuButton);
        $('#btn-search').on('click', this.handleClickSearchButton);

        this.updateNotificationBadges();
    };

    this.settings = function() {
        return ScifiBot.db.data.settings;
    };

    this.updateNotificationBadges = function() {
        var aUnread = ScifiBot.app.notifications.unreadCount();

        if(aUnread > 0) {
            $('.notifications-count').html(aUnread + '').css({visibility: 'visible'});
        } else {
            $('.notifications-count').css({visibility: 'hidden'});
        }
    };
};