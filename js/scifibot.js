var ScifiBot = ScifiBot || {};

// Initialize your app
var myApp = new Framework7({
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
    console.log(theEvent.target.dataset['id']);

    var aButtons = [
        {
            text: '<i class="material-icons">add</i> Add to my list',
            onClick: function () {
                myApp.alert('Button1 clicked');
            }
        },
        {
            text: '<i class="material-icons">check</i> Mark as watched',
            onClick: function () {
                myApp.alert('Button2 clicked');
            }
        },
        {
            text: '<i class="material-icons">add_alert</i> Follow',
            onClick: function () {
                myApp.alert('Button2 clicked');
            }
        },
        {
            text: '<i class="material-icons">star_half</i> Rate and review',
            onClick: function () {
                myApp.alert('Button2 clicked');
            }
        },
        {
            text: '<i class="material-icons">share</i> Share',
            onClick: function () {
                myApp.alert('Button2 clicked');
            }
        },
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

function initItemPage(thePage) {
    var aItemId = thePage.query.id;

    $('#btn-watch').on('click', function () {
        console.log('WATCH', aItemId);
    });

    $('#btn-follow').on('click', function () {
        console.log('FOLLOW', aItemId);
    });
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

    aWatched = Math.random() <= 0.5 ? '<span class="watch-status badge-watched"><i class="material-icons">check</i> WATCHED</span>' : '<span class="watch-status"></span>';

    aHtml +=
        '<div class="card card-header-pic">' +
          '<div style="background-image:url(http://s3.foxmovies.com/foxmovies/production/films/104/images/featured_content/97-front.jpg)" valign="bottom" class="card-header color-white">' + aWatched + '</div>' +
          '<div class="card-content">' +
            '<div class="card-content-inner">' +
              '<p class="color-gray">The Martian, ' + theId + '</p>' +
              '<p>When astronauts blast off from the planet Mars, they leave behind Mark Watney (Matt Damon), presumed dead after a fierce storm.</p>' +
              '<div class="item-buttons">' +
                '<a href="#" data-id="1" class="link item-actions"><i class="material-icons">list</i> Actions</a>' +
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
        aData = ScifiBot.db.data,
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
