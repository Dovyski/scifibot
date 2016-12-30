var ScifiBot = ScifiBot || {};
ScifiBot.page = ScifiBot.page || {};

ScifiBot.page.notifications = new function() {
    this.describeType = function(theNotificationType) {
        return theNotificationType;
    };

    this.renderNotification = function(theNotification) {
        var aTitle = ScifiBot.db.fetch(theNotification.title);

        if(!aTitle) {
            console.error('Unable to fetch title with id', theNotification.title);
            return '';
        }

        var aHtml =
            '<li class="notification-1" data-title-id="' + aTitle.id + '">' +
              '<div class="item-content">' +
                '<div class="item-media" data-title-id="' + aTitle.id + '"><img src="' + aTitle.teaser + '" width="80"/></div>' +
                '<div class="item-inner" data-title-id="' + aTitle.id + '">' +
                  '<div class="item-title-row">' +
                    '<div class="item-title">' + aTitle.name + '</div>' +
                  '</div>' +
                  '<div class="item-subtitle">' + new timeago().format(theNotification.time) + '</div>' +
                  '<div class="item-text">' + this.describeType(theNotification.type) + '</div>' +
                '</div>' +
                '<div class="item-after"><a href="#" class="item-link delete" data-id="' + theNotification.id + '"><i class="material-icons">delete</i></a></div>' +
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
            aHtml =
                '<div class="content-block" style="text-align: center; margin-top: 20%;">' +
                    '<i class="material-icons" style="font-size: 8em;">info_outline</i><br />' +
                    'No notifications for now.<br /><br />New titles will be added soon. Meanwhile you can <i class="material-icons">notifications</i><strong>track</strong> existing titles to receive news about them.' +
                '</div>';

            $('#notifications-list').html(aHtml);

        } else {
            $('#notifications-list').html('<ul>' + aHtml + '</ul>');
            $('#notifications-list a.delete').on('click', this.handleDelete);
            $('#notifications-list div.item-inner, #notifications-list div.item-media').on('click', this.handleClick);

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
