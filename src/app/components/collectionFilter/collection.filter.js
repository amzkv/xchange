export function CollectionFilter() {
  'ngInject';
  return function (collections, excludeCollectionNames) {
    if (!collections) {
      return [];
    }
    return collections.filter(function (collection) {
      return (excludeCollectionNames.indexOf(collection.group.value) == -1);
      //return collection.group.value !== 'Monat' && collection.group.value !== 'NEW' && collection.group.value !== 'INBOX' && collection.group.value !== 'Type' && collection.group.value !== 'WORKFLOW';
    });
  }
}
