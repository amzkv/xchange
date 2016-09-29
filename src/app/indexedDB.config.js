export function indexedDBConfig ($indexedDBProvider) {
  'ngInject';

  $indexedDBProvider
  .connection('iDB365_')
  .upgradeDatabase(1, function(event, db, tx){
    var objStore = db.createObjectStore('user', {keyPath: 'user_key'});
  }).upgradeDatabase(2, function(event, db, tx){
    //db.createObjectStore('core', {keyPath: 'group.value'});
    db.createObjectStore('core', {keyPath: 'id'});
  }).upgradeDatabase(3, function(event, db, tx){
    db.createObjectStore('collections', {keyPath: 'id'});
  }).upgradeDatabase(4, function(event, db, tx){
    db.createObjectStore('documents', {keyPath: 'id'});
  }).upgradeDatabase(5, function(event, db, tx){
    db.createObjectStore('document_detail', {keyPath: 'id'});
  }).upgradeDatabase(6, function(event, db, tx){
    db.createObjectStore('expiration', {keyPath: 'key'});
  }).upgradeDatabase(7, function(event, db, tx){
    db.createObjectStore('partner', {keyPath: 'id'});
  })

}
