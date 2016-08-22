export class NotificationService {
  constructor($q, ConfigService, StorageService) {
    'ngInject';
    this.$q = $q;
    this.ConfigService = ConfigService;
    this.storageService = StorageService;
    this.notifications = [];
  }

  processNotificationData(type, data, userId) {
    let time = new Date();
    //default
    let notification = {
      id: data.id,
      header: time,
      title: "default",
      action: "has been changed",
      entityName: "Item",
      url: "/"
    };
    switch (type) {
      case 'userCollection':
        notification.header = time;
        notification.entityName = data.group.locale;
        notification.title = data.title;
        notification.url = '/' + data.group.value + '/' + data.id;
        notification.originalData = data;
        //clear docs
        this.storageService.cleanSelectedRecordsByCollectionForUser('documents', notification.id, userId);
        //clear collections
        this.storageService.cleanSelectedRecordsByCollectionForUser('collections', data.group.value, userId);

        return notification;
        break;
      default:
        return notification;
    }
  };

  addNotification(formattedNotification) {
    let self = this;
    if (this.notifications.length) {
      let unique = true;
      angular.forEach(this.notifications, function (item) {
        if (formattedNotification == item) {
          unique = false;
          return;
        }
      });
      if (unique) {
        //self.
        self.notifications.push(formattedNotification);
      }
    } else {
      self.notifications.push(formattedNotification);
    }
  }

  clearNotifications(){
    this.notifications = [];
  }

}
