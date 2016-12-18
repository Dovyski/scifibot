var ScifiBot = ScifiBot || {};

ScifiBot.app = new function() {
    this.activeItem = null;
};

// Initialize your app
var myApp = new Framework7({
    material: true,
    init: false //Disable App's automatica initialization
});

// Export selectors engine
var $ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

function hideButtons(theButtonIds) {
    var i, aLength = theButtonIds.length;

    for(i = 0; i < aLength; i++) {
        $('#' + theButtonIds[i]).css({opacity: 0, pointerEvents: 'none'});
        ;
    }
}

function showButtons(theButtonIds) {
    var i, aLength = theButtonIds.length;

    for(i = 0; i < aLength; i++) {
        $('#' + theButtonIds[i]).css({opacity: 1.0, pointerEvents: 'auto'});
    }
}

function updateNavbar() {
    if(mainView.activePage.name == "index") {
        $('#btn-menu').html('<i class="material-icons">menu</i>');
        showButtons(['btn-menu', 'btn-filter', 'btn-search']);

    } else {
        $('#btn-menu').html('<i class="material-icons">arrow_back</i>');
        hideButtons(['btn-filter', 'btn-search']);
    }

    $('#navbar-title').text(mainView.activePage.name);
}

function handleClickMainMenuButton() {
    if(mainView.activePage.name == 'index') {
         myApp.openPanel('left');
    } else {
        handlePageBack();
    }
}

function handleClickMenuItem(theAction) {
    console.debug('Menu', theAction);

    if(theAction == 'movies') {

    } else if(theAction == 'series') {

    }

    myApp.closePanel();
}

function handleClickItemActions(theEvent) {
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
                myApp.mainView.router.loadPage('rate.html?id=' + ScifiBot.app.activeItem);
                ScifiBot.app.activeItem = null;
            }
        }
    ];

    myApp.actions(aButtons);
}

function handleClickSearchButton() {
    // TODO: implement search
    alert('Sorry, this feature is not working at the moment.');
}

function initIndexPage(thePage) {
    $('#btn-menu').on('click', handleClickMainMenuButton);
    $('#btn-search').on('click', handleClickSearchButton);

    $('.menu-item').on('click', function () {
        handleClickMenuItem($(this).data('action'));
    });

    ScifiBot.db.load();
    loadItems();
}

function itemPageRefreshInlineButtons() {
    var aItemId = myApp.mainView.activePage.query.id;

    $('#btn-watch').html(ScifiBot.user.watched(aItemId) ? '<i class="material-icons">check</i> Watched' : '<i class="material-icons">visibility_off</i> Not watched');
    $('#btn-follow').html(ScifiBot.user.following(aItemId) ? '<i class="material-icons">notifications_active</i> Tracked' : '<i class="material-icons">notifications</i> Not tracked');
    $('#btn-list').html(ScifiBot.user.list.has(aItemId) ? '<i class="material-icons">playlist_add_check</i> In list' : '<i class="material-icons">playlist_add</i> Not in list');
}

function initItemPageInlineButtons(theItem) {
    $('.item-inline-buttons a').data('item', theItem.id);

    itemPageRefreshInlineButtons();

    $('#btn-watch').on('click', function () {
        ScifiBot.user.toggleWatched(myApp.mainView.activePage.query.id);
        itemPageRefreshInlineButtons();
    });

    $('#btn-follow').on('click', function () {
        var aFollowing = ScifiBot.user.toggleFollowing(myApp.mainView.activePage.query.id);

        if(aFollowing) {
            myApp.addNotification({
                message: 'You will be notified about important news regarding this title.'
            });
        }

        itemPageRefreshInlineButtons();
    });

    $('#btn-list').on('click', function () {
        ScifiBot.user.list.toggle(myApp.mainView.activePage.query.id);
        itemPageRefreshInlineButtons();
    });
}

function initItemPage(thePage) {
    var aItemId = thePage.query.id;
    var aItem = ScifiBot.db.fetch(aItemId);

    if(!aItem) {
        console.error('Unable to load item with id: ' + aItemId);
        return;
    }

    $('#item-block-title').html('<strong>' + aItem.title + '</strong><br/><p class="color-gray">{publisher} &bull; ' + aItem.released + '</p>');

    $('#item-block-content').html(
        '<p class="color-gray"><i class="material-icons">star</i> 8/10 <i class="material-icons">star</i> 92% <i class="material-icons">star</i> 80%</p>' +
        '<p>' + aItem.plot + '</p>'
    );

    $('a.trailer-link').attr('href', 'https://youtube.com');
    $('a.rate-link').attr('href', 'rate.html?id=' + aItemId);
    $('a.similar-link').attr('href', 'similar.html?id=' + aItemId);

    initItemPageInlineButtons(aItem);
}

function initPage(thePage) {
    console.debug('INIT page', thePage);
    updateNavbar();

    if(thePage.name == 'index') {
        initIndexPage(thePage);
    } else if(thePage.name == 'item') {
        initItemPage(thePage);
    }
}

function handlePageBack() {
    mainView.router.back();
    updateNavbar();
}

function generateItemCard(theId) {
    var aHtml = '', aWatched = '', aItem = ScifiBot.db.fetch(theId);

    if(!aItem) {
        console.error('Unknown item with id: ' + theId);
        return '[Oops, something wrong!]';
    }

    aWatched = ScifiBot.user.watched(theId) ? '<span class="watch-status badge-watched"><i class="material-icons">check</i> WATCHED</span>' : '<span class="watch-status"></span>';

    aHtml +=
        '<div class="card card-header-pic">' +
          '<div style="background-image:url(http://s3.foxmovies.com/foxmovies/production/films/104/images/featured_content/97-front.jpg)" valign="bottom" class="card-header color-white">' + aWatched + '</div>' +
          '<div class="card-content">' +
            '<div class="card-content-inner">' +
              '<p class="color-gray">' + aItem.title + '</p>' +
              '<p>' + aItem.plot + '</p>' +
              '<div class="item-buttons">' +
                '<a href="#" data-id="' + aItem.id + '" class="link item-actions"><i class="material-icons">list</i> Actions</a>' +
                '<a href="item.html?id=' + theId + '" class="link item-info">More <i class="material-icons">chevron_right</i></a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

    return aHtml;
}


// Last loaded index
var lastIndex = $('.card').length;

// Max items to load
var maxItems = 60;

// Append items per load
var itemsPerLoad = 20;

function setInfiniteScrolling(theStatus) {
    if(theStatus) {
        // Attach 'infinite' event handler (for infinite scrolling)
        $('.infinite-scroll').on('infinite', loadItems);
    } else {
        myApp.detachInfiniteScroll($('.infinite-scroll'));
        $('.infinite-scroll-preloader').remove();
    }
}

function loadItems() {
    var aHtml = '',
        aData = ScifiBot.db.data.titles,
        i = 0,
        aLastIdAppended;

    console.debug('lastIndex', lastIndex);

    for(var aId in aData) {
        console.log(aId, lastIndex, itemsPerLoad);
        if(aId > lastIndex && i++ < itemsPerLoad) {
            aHtml += generateItemCard(aId);
            aLastIdAppended = aId;
        }
    }

    // Update last loaded index
    lastIndex = aLastIdAppended;

    // If the last id in the database equals the last
    // appended item, then we have nothing else to load.
    aDataIsOver = aLastIdAppended == aId;

    if (aDataIsOver) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        setInfiniteScrolling(false);
    }

    // Append new items
    $('.page-content').append(aHtml);

    // Remove any existig click listener, then add a new one
    $('.item-actions').off('click', handleClickItemActions);
    $('.item-actions').on('click', handleClickItemActions);
}

myApp.onPageInit('index', initPage);
myApp.onPageInit('item', initPage);
myApp.onPageInit('rate', initPage);
myApp.onPageInit('similar', initPage);
myApp.onPageInit('settings', initPage);
myApp.onPageInit('about', initPage);
myApp.onPageInit('mylist', initPage);
myApp.onPageInit('notifications', initPage);

// Enable infinite scrolling of data
setInfiniteScrolling(true);

//And now we initialize app
myApp.init();
