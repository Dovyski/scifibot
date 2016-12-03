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

    $('.item-actions').on('click', handleClickItemActions);
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

myApp.onPageInit('index', initPage);
myApp.onPageInit('item', initPage);
myApp.onPageInit('rate', initPage);
myApp.onPageInit('similar', initPage);
myApp.onPageInit('settings', initPage);
myApp.onPageInit('about', initPage);
myApp.onPageInit('mylist', initPage);

//And now we initialize app
myApp.init();
