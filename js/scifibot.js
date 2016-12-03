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
        showButtons(['btn-menu', 'btn-filter', 'btn-search']);
        hideButtons(['btn-back']);

        $('#navbar-title').text('Movies');
    } else {
        showButtons(['btn-back']);
        hideButtons(['btn-menu', 'btn-filter', 'btn-search']);

        $('#navbar-title').text(mainView.activePage.name);
    }
}

function handleMenuClick(theAction) {
    console.debug('Menu', theAction);

    if(theAction == 'movies') {

    } else if(theAction == 'series') {

    }

    myApp.closePanel();
}

function initIndexPage(thePage) {
    $('#btn-back').on('click', function () {
        handlePageBack();
    });

    $('#btn-search').on('click', function () {
        // TODO: implement search
        alert('Sorry, this feature is not working at the moment.');
    });

    $('.menu-item').on('click', function () {
        handleMenuClick($(this).data('action'));
    });

    // run createContentPage func after link was clicked
    $('.item-actions').on('click', function () {
        //- With callbacks on click
        var buttons = [
            {
                text: 'Button1',
                onClick: function () {
                    myApp.alert('Button1 clicked');
                }
            },
            {
                text: 'Button2',
                onClick: function () {
                    myApp.alert('Button2 clicked');
                }
            },
            {
                text: 'Cancel',
                color: 'red',
                onClick: function () {
                    myApp.alert('Cancel clicked');
                }
            },
        ];
        myApp.actions(buttons);
    });
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

//And now we initialize app
myApp.init();
