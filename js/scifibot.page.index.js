var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.index = new function() {
    this.lastId = -1;           // If of Last loaded item
    this.type = 2;              // Type of titles to be displayed in the page.
    this.myList = false;        // If the page is working to show the list of title in user's "My list".
    this.itemsPerLoad = 20;     // Append items per load

    this.setInfiniteScrolling = function(theStatus) {
        if(theStatus) {
            // Attach 'infinite' event handler (for infinite scrolling)
            $('.infinite-scroll').on('infinite', loadItems);
        } else {
            ScifiBot.app.core.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').remove();
        }
    };

    this.updateCardItemListeners = function() {
        // Remove any existig click listener, then add a new one
        $('.item-actions').off('click', this.handleClickItemActions);
        $('.item-actions').on('click', this.handleClickItemActions);
    };

    this.loadItemsByType = function() {
        var aHtml = '',
            aData = ScifiBot.db.find({type: this.type}),
            i = 0,
            aLastIdAppended;

        console.debug('scifibot.page.index.lastId', this.lastId);

        for(var aId in aData) {
            if(aId > this.lastId && i++ < this.itemsPerLoad) {
                aHtml += ScifiBot.app.generateItemCard(aId);
                aLastIdAppended = aId;
            }
        }

        // Update last loaded index
        this.lastId = aLastIdAppended;

        // If the last id in the database equals the last
        // appended item, then we have nothing else to load.
        aDataIsOver = aLastIdAppended == aId;

        if (aDataIsOver) {
            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            this.setInfiniteScrolling(false);
        }

        // Append new items
        $('.index-content').append(aHtml);

        // Updade visual elements of each card, e.g. "watched" badge.
        ScifiBot.app.updateExistingCards();
        this.updateCardItemListeners();
    };

    this.loadItemsIntoMyList = function() {
        var aHtml = '',
            aMyListItems = ScifiBot.user.list.all(),
            aId = 0;

        console.debug('scifibot.page.index.myList', this.myList);

        // No infinite scrolling while browsing my list.
        this.setInfiniteScrolling(false);

        for(aId in aMyListItems) {
            aHtml += ScifiBot.app.generateItemCard(aId);
        }

        if(aHtml == '') {
            // No items in my list, very sad :(
            aHtml =
                '<div class="content-block" style="text-align: center; margin-top: 20%;">' +
                    '<i class="material-icons" style="font-size: 8em;">info_outline</i><br />' +
                    'Your queue is empty.<br />Find a <a href="index.html?type=1">movie</a> or a <a href="index.html?type=2">series</a> to watch.' +
                '</div>';
        }

        // Append new items
        $('.index-content').append(aHtml);

        // Updade visual elements of each card, e.g. "watched" badge.
        ScifiBot.app.updateExistingCards();
        this.updateCardItemListeners();
    };

    this.loadItems = function() {
        // Let's load titles according to the specified behavior.
        // If this is the myList mode, we load the titles in the
        // user's queue, otherwise we load all titles that match
        // the informed type.
        if(this.myList) {
            this.loadItemsIntoMyList();
        } else {
            this.loadItemsByType();
        }
    };

    this.handleClickItemActions = function(theEvent) {
        var aItemId = theEvent.target.dataset['id'];

        // Use this (ugly) global var to broadcast the information of
        // which items is being handled at the moment.
        ScifiBot.app.activeItem = aItemId;

        var aButtons = [
            {
                text: ScifiBot.user.list.has(aItemId) ? '<i class="material-icons">remove</i> Remove from my list' : '<i class="material-icons">add</i> Add to my list',
                onClick: function () {
                    ScifiBot.user.list.toggle(ScifiBot.app.activeItem);
                    ScifiBot.app.activeItem = null;
                }
            },
            {
                text: ScifiBot.user.watched(aItemId) ? '<i class="material-icons">remove</i> Mark as not watched' : '<i class="material-icons">check</i> Mark as watched',
                onClick: function () {
                    ScifiBot.user.toggleWatched(ScifiBot.app.activeItem);
                    ScifiBot.app.updateExistingCards(ScifiBot.app.activeItem);
                    ScifiBot.app.activeItem = null;
                }
            },
            {
                text: ScifiBot.user.following(aItemId) ? '<i class="material-icons">remove</i> Stop tracking' : '<i class="material-icons">add_alert</i> Track',
                onClick: function () {
                    ScifiBot.user.toggleFollowing(ScifiBot.app.activeItem);
                    ScifiBot.app.activeItem = null;
                }
            },
            {
                text: '<i class="material-icons">star_half</i> Rate and review',
                onClick: function () {
                    ScifiBot.app.views.main.router.loadPage('rate.html?id=' + ScifiBot.app.activeItem);
                    ScifiBot.app.activeItem = null;
                }
            }
        ];

        ScifiBot.app.core.actions(aButtons);
    };

    this.removeContent = function() {
        // Clear the content of the page and add
        // the bare minimum to allow new content.
        $('.index-content').empty().html(
            // Page title, to push content a bit down
            '<div class="content-block-title">List</div>' +
            // Infinite scrolling preloader
            '<div class="infinite-scroll-preloader"><div class="preloader"></div></div>'
        );
    };

    this.init = function(thePage) {
        console.debug('scifibot.page.index.init()', thePage);

        this.lastId = -1;
        this.type = thePage.query.type || ScifiBot.db.MOVIES;
        this.myList = thePage.query.myList;

        // Clear any previously loaded content
        this.removeContent();
        this.setInfiniteScrolling();
        this.loadItems();

        if(this.myList) {
            // User is browing "My list"
            ScifiBot.app.setNavbarTitle("My list");
        } else {
            // User is browsing some type of title.
            ScifiBot.app.setNavbarTitle(ScifiBot.db.TYPE_NAMES[this.type][1]);
        }
    };
};
