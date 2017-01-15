var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.notifications = new function() {
    this.describeType = function(theNotificationType, theTitle) {
        switch(theNotificationType) {
            case ScifiBot.Notification.TITLE_ADDED: return 'new ' + ScifiBot.db.TYPE_NAMES[theTitle.type][0] + ' added to the catalog';
            case ScifiBot.Notification.TITLE_RELEASED: return 'has been released';
            default: '?';
        }
    };

    this.renderNotification = function(theNotification) {
        var aTitle = ScifiBot.db.fetch(theNotification.title);

        if(!aTitle) {
            console.error('Unable to fetch title with id', theNotification.title);
            return '';
        }

        var aHtml =
            '<li class="notification-' + theNotification.id + ' swipeout notification-item" data-title-id="' + aTitle.id + '">' +
              '<div class="item-content swipeout-content">' +
                '<div class="item-media" data-title-id="' + aTitle.id + '"><img src="' + aTitle.teaser + '" class="item-thumbnail" /></div>' +
                '<div class="item-inner" data-title-id="' + aTitle.id + '">' +
                  '<div class="item-title-row">' +
                    '<div class="item-title">' + aTitle.name + '</div>' +
                  '</div>' +
                  '<div class="item-text">' + this.describeType(theNotification.type, aTitle) + '</div>' +
                  '<div class="item-subtitle">' + new timeago().format(theNotification.time) + '</div>' +
                '</div>' +
                '<div class="item-after"><a href="#" class="item-link deleted" data-id="' + theNotification.id + '"><i class="material-icons">delete</i></a></div>' +
              '</div>' +
              '<div class="swipeout-actions-left">' +
                '<a href="#" class="swipeout-delete swipeout-overswipe deleted" data-id="' + theNotification.id + '"><i class="material-icons">delete</i> Remove</a>' +
              '</div>' +
            '</li>';

        return aHtml;
    };

    this.handleDelete = function(theEvent) {
        var aNotificationId = $(this).data('id');

        ScifiBot.app.notifications.remove(aNotificationId);
        ScifiBot.app.core.swipeoutDelete('.notification-' + aNotificationId);

        console.debug('ScifiBot.page.notifications.handleDelete()', aNotificationId);

        if(ScifiBot.app.notifications.all().length == 0) {
            ScifiBot.page.notifications.showMessageNoNotifications();
        }

        // TODO: show undo option
    };

    this.handleClick = function(theEvent) {
        var aTitleId = $(this).data('title-id');

        ScifiBot.app.views.main.router.load({
            url: 'item.html?id=' + aTitleId,
            ignoreCache: true
        });
    };

    this.showMessageNoNotifications = function() {
        var aHtml =
            '<div class="content-block" style="text-align: center; margin-top: 20%;">' +
                '<i class="material-icons" style="font-size: 8em;">info_outline</i><br />' +
                'No notifications for now.<br /><br />New titles will be added soon. Meanwhile you can <i class="material-icons">notifications</i><strong>track</strong> existing titles to receive news about them.' +
            '</div>';

        $('#notifications-list').html(aHtml);
    };

    this.init = function(thePage) {
        var aHtml = '', aNotifications = ScifiBot.app.notifications.all(), aMarked = 0, i;

        console.debug('scifibot.page.notifications.init()', thePage);

        for(i = aNotifications.length - 1; i >= 0; i--) {
            aHtml += this.renderNotification(aNotifications[i]);

            if(!aNotifications[i].read) {
                aNotifications[i].read = true;
                aMarked++;
            }
        }

        if(aHtml == '') {
            // No notifications so far.
            this.showMessageNoNotifications();

        } else {
            $('#notifications-list').html('<ul>' + aHtml + '</ul>');
            $('#notifications-list div.item-inner, #notifications-list div.item-media').on('click', this.handleClick);
            $('#notifications-list .swipeout').on('swipeout:deleted', this.handleDelete);
            $('#notifications-list .deleted').on('click', this.handleDelete);

            // Notifications were marked as read at the begining of this method,
            // so we must save those changes to the disk.
            if(aMarked > 0) {
                ScifiBot.app.updateNotificationBadges();
                ScifiBot.db.save();
            }
        }

        ScifiBot.app.setNavbarTitle('Notifications');
    };
};
