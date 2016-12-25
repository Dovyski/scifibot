var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.index = new function() {
    this.lastId = -1;           // If of Last loaded item
    this.type = 2;              // Type of titles to be displayed in the page.
    this.itemsPerLoad = 20;     // Append items per load

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

    this.setInfiniteScrolling = function(theStatus) {
        if(theStatus) {
            // Attach 'infinite' event handler (for infinite scrolling)
            $('.infinite-scroll').on('infinite', loadItems);
        } else {
            ScifiBot.app.core.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').remove();
        }
    };

    this.loadItems = function() {
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

        // Remove any existig click listener, then add a new one
        $('.item-actions').off('click', this.handleClickItemActions);
        $('.item-actions').on('click', this.handleClickItemActions);
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

    this.init = function(thePage) {
        var aSelf = this;

        console.debug('scifibot.page.index.init()', thePage);

        $('#btn-menu').on('click', this.handleClickMainMenuButton);
        $('#btn-search').on('click', this.handleClickSearchButton);

        $('.menu-item').on('click', function () {
            ScifiBot.app.core.closePanel();
        });

        this.lastId = -1;
        this.type = thePage.query.type || ScifiBot.db.MOVIES;

        this.setInfiniteScrolling();
        this.loadItems();

        ScifiBot.app.setNavbarTitle(ScifiBot.db.TYPE_NAMES[this.type][1]);
    };
};
