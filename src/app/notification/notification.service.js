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
      case 'userCollectionOld':
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
      case 'userCollection':
        if (data.document) {
          notification.id = data.document.id;
          notification.newCollectionsText = ' added to';
          notification.droppedCollectionsText = ' removed from';

          notification.date = data.document.when;
          notification.entityName = data.document.type.locale;//'Document'
          notification.title = data.document.title;
          notification.newCollections = [];
          notification.droppedCollections = [];
          notification.collectionValues = [];
          notification.usedUrls = [];
          if (data.document.collections && data.document.collections.length > 0) {
            //notification.url = '/' + data.document.type.value + '/' + data.id;
            angular.forEach(data.document.collections, function(collection) {
              if (collection.action == 'new') {
                //notification.newCollections
                notification.hasNewCollections = true;
                //collection.documentUrl = '/' + collection.group.value + '/' + collection.id + '/' + notification.id;
                notification.newCollections.push(collection);
              }
              if (collection.action == 'dropped') {
                notification.hasDroppedCollections = true;
                notification.droppedCollections.push(collection);
              }

              notification.usedUrls.push('/' + collection.group.value + '/' + collection.id);
              notification.usedUrls.push('/' + collection.group.value + '/' + collection.id + '/' + notification.id);

              notification.collectionValues.push(collection.group.value);//

            });
          }
          notification.originalData = data.document;
          //clear docs
          this.storageService.cleanSelectedRecordsByCollectionForUser('documents', notification.id, userId);

          if (notification.collectionValues.length > 0) {
            //clear collections
            this.storageService.cleanSelectedRecordsByCollectionForUser('collections', notification.collectionValues, userId);
          }
        }

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
    //console.log('clear');
    this.notifications = [];
  }

}
