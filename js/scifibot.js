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

function initPage(thePage) {
    updateNavbar();

    if(thePage == 'index') {

    } else if(thePage == 'item') {

    }

    console.debug('INIT page', thePage);
}

function handlePageBack() {
    mainView.router.back();
    updateNavbar();
}

// Generate dynamic page
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        //'<div class="navbar">' +
        //'  <div class="navbar-inner">' +
        //'    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        //'    <div class="center sliding">Dynamic Page</div>' +
        //'  </div>' +
        //'</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

// Callbacks to run specific code for specific pages
myApp.onPageInit('index', function (page) {
    updateNavbar();

    $('#btn-back').on('click', function () {
        handlePageBack();
    });

    $('#btn-search').on('click', function () {
        // TODO: implement search
        alert('Sorry, this feature is not working at the moment.');
    });

    $('.item-info').on('click', function () {
        console.log('heee');
        mainView.router.loadContent($('#item-page').html());
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
});

myApp.onPageInit('item', initPage);
myApp.onPageInit('rate', initPage);
myApp.onPageInit('similar', initPage);

//And now we initialize app
myApp.init();
