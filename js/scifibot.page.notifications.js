var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.notifications = new function() {
    this.renderNotification = function(theNotification) {
        var aHtml =
            '<li class="notification-1" data-title-id="2">' +
              '<div class="item-content">' +
                '<div class="item-media" data-title-id="2"><img src="http://s3.foxmovies.com/foxmovies/production/films/104/images/featured_content/97-front.jpg" width="80"/></div>' +
                '<div class="item-inner" data-title-id="2">' +
                  '<div class="item-title-row">' +
                    '<div class="item-title">The Martian</div>' +
                  '</div>' +
                  '<div class="item-subtitle">2 days ago</div>' +
                  '<div class="item-text">New movie added</div>' +
                '</div>' +
                '<div class="item-after"><a href="#" class="item-link delete" data-id="1"><i class="material-icons">delete</i></a></div>' +
              '</div>' +
            '</li>';

        return aHtml;
    };

    this.handleDelete = function(theEvent) {
        var aNotificationId = $(this).data('id');
        console.log('TODO: delete', aNotificationId);
    };

    this.handleClick = function(theEvent) {
        var aTitleId = $(this).data('title-id');

        ScifiBot.app.views.main.router.load({
            url: 'item.html?id=' + aTitleId,
            ignoreCache: true
        });
    };

    this.init = function(thePage) {
        var aHtml = '';

        console.debug('scifibot.page.notifications.init()', thePage);

        for(var i = 0; i < 3; i++) {
            aHtml += this.renderNotification();
        }

        $('#notifications-list').html('<ul>' + aHtml + '</ul>');
        $('#notifications-list a.delete').on('click', this.handleDelete);
        $('#notifications-list div.item-inner, #notifications-list div.item-media').on('click', this.handleClick);

        ScifiBot.app.setNavbarTitle('Notifications');
    };
};