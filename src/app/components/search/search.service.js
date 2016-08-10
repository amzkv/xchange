export class SearchService {
  constructor($filter) {
    'ngInject';
    this.filter = $filter;
  }

  searchCriteria(query) {
    let self = this;
    return function( item ) {
      let itemMod = angular.copy(item);
      if (itemMod.thumb) {
        itemMod.thumb = '';//skip this for search
      }
      //add other exceptions here if necessary
      if (itemMod.date) {
        let fDate = self.filter('date')(itemMod.date, 'dd.MM.yyyy');
        let ds =  self.filter('filter')([fDate], query);
        if (ds.length>0) {
          return true;
        }
      }

      if (itemMod.totalamount) {
        let ta = self.filter('currency')(itemMod.totalamount, '');
        let tas =  self.filter('filter')([ta], query);
        if (tas.length>0) {
          return true;
        }
      }

      //console.log('common filter', self.filter('filter')([itemMod], query));
      return (self.filter('filter')([itemMod], query).length > 0);
    };
  }
}

