// Initialize your app
var myApp = new Framework7({
    init: false //Disable App's automatica initialization
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

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
    $$('.back-btn').on('click', function () {
        mainView.router.back();
    });

    //$$('.item-info').on('click', function () {
    //    createContentPage();
    //});

    // run createContentPage func after link was clicked
    $$('.item-actions').on('click', function () {
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

myApp.onPageInit('item', function (page) {
     console.log(page);

    $$('.back-btn').show();
});

//And now we initialize app
myApp.init();
