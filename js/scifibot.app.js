var ScifiBot = ScifiBot || {};

// Export selectors engine
var $ = Dom7;

ScifiBot.app = new function() {
    this.activeItem = null;

    // List of pages/screens in the app.
    // They are indexed by id.
    this.pages = {
        index: new ScifiBot.page.Index(),
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

        if(ScifiBot.config.IS_CORDOVA) {
            this.registerEventListeners();
        }

        this.core.init();
        this.initUI();

        var aSettings = ScifiBot.app.settings();

        // Sync data using the web endpoint
        if(aSettings.sync && aSettings.syncOnStartup) {
            setTimeout(ScifiBot.sync.onlineRun, 5000);
        }
    };

    this.registerEventListeners = function() {
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('backbutton', this.onBackButton, false);
    };

    this.onPause = function() {
    };

    this.onResume = function() {
    };

    this.onBackButton = function() {
        ScifiBot.app.handlePageBack();
    };

    this.handlePageBack = function() {
        var aHistory = ScifiBot.app.views.main.history, aURL;

        // Remove active page from the historic
        aHistory.pop();

        if(aHistory.length > 0) {
            aUrl = aHistory[aHistory.length - 1];
        }

        // Jump to previous page
        this.views.main.router.loadPage(aUrl ? aUrl : 'index.html');
        this.updateNavbar();

        // Remove lasd added entry, otherwise it will
        // be duplicated bacause loadPage() already
        // added an entry.
        aHistory.pop();
    };

    this.updateNavbar = function() {
        if(this.views.main.activePage.name == "index") {
            $('#btn-menu').html('<i class="material-icons">menu</i>');
            this.updateNotificationBadges();
            this.showButtons(['btn-menu', 'btn-filter', 'btn-search']);
        } else {
            $('#btn-menu').html('<i class="material-icons">arrow_back</i>');
            this.hideButtons(['btn-filter', 'btn-search']);
        }
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
                '<div class="card-badges">' +
                    '<span class="badge-entry not-marked watch-status-' + theId + '" data-id="' + aItem.id + '"></span>' +
                    '<span class="badge-entry not-marked track-status-' + theId + '" data-id="' + aItem.id + '"></span>' +
                    '<span class="badge-entry not-marked list-status-' + theId + '" data-id="' + aItem.id + '"></span>' +
                 '</div>' +
              '</div>' +
              '<div class="card-content">' +
                '<div class="card-content-inner">' +
                  '<p class="card-item-title">' + aItem.name + '</p>' +
                  '<p class="color-gray card-item-plot">' + (aItem.plot ? aItem.plot.substr(0, ScifiBot.config.PLOT_SUMMARY_SIZE) + '...' : 'No information available.') + '</p>' +
                  '<div class="item-buttons">' +
                    '<a href="#" data-id="' + aItem.id + '" class="link item-actions"><i class="material-icons">list</i> Actions</a>' +
                    '<a href="item.html?id=' + theId + '" class="link item-info">More <i class="material-icons">chevron_right</i></a>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>';

        return aHtml;
    };

    this.titleToggleList = function(theTitleId) {
        ScifiBot.user.list.toggle(theTitleId);
        ScifiBot.app.updateExistingCards(theTitleId);
    };

    this.titleToggleWatched = function(theTitleId) {
        ScifiBot.user.toggleWatched(theTitleId);
        ScifiBot.app.updateExistingCards(theTitleId);
    };

    this.titleToggleFollow = function(theTitleId) {
        var aFollowing = ScifiBot.user.toggleFollowing(theTitleId);

        if(aFollowing) {
            ScifiBot.app.core.addNotification({
                message: 'You will be notified about important news regarding this title.',
                button: {
                    text: 'CLOSE',
                    color: 'orange'
                }
            });
        }

        ScifiBot.app.updateExistingCards(theTitleId);
    };

    this.updateBadge = function(theItemId) {
        var aThings = [
            {name: 'watch', icon: 'check',                  doing: ScifiBot.user.watched(theItemId)},
            {name: 'track', icon: 'notifications_active',   doing: ScifiBot.user.following(theItemId)},
            {name: 'list',  icon: 'playlist_add_check',     doing: ScifiBot.user.list.has(theItemId)},
        ];

        for(var i = 0, aSize = aThings.length; i < aSize; i++) {
            var aSelector = '.' + aThings[i].name + '-status-' + theItemId;

            if(aThings[i].doing) {
                $(aSelector)
                    .removeClass('not-marked')
                    .addClass('marked')
                    .html('<i class="material-icons">' + aThings[i].icon + '</i></span>');
            } else {
                $(aSelector)
                    .removeClass('marked')
                    .addClass('not-marked')
                    .html('');
            }
        }
    };

    this.updateExistingCards = function(theItemId) {
        if(theItemId) {
            // Update the card of an specific item
            ScifiBot.app.updateBadge(theItemId);
        } else {
            // Update all cards of the app.
            $('.badge-entry').each(function(theKey, theValue) {
                ScifiBot.app.updateBadge($(theValue).data('id'));
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
            $('.notifications-count').html(aUnread + '');
            $('.notifications-call').css({display: 'inline-block'});
        } else {
            $('.notifications-call').css({display: 'none'});
        }
    };
};
