/**
 * Created by decipher on 19.5.16.
 */
export class ViewModeService {
  constructor($log, $rootScope) {
    'ngInject';
    this.$log = $log;
    this.$rootScope = $rootScope;

    this.viewMode = 'Card';
    this.alternateViewMode = 'List';
  }

  getState() {
    "use strict";
    return this.viewMode;
  }

  getAlterState() {
    "use strict";
    return this.alternateViewMode;
  }

  setState(mode, alterMode){
    "use strict";
    //return this.viewMode = mode;
    this.viewMode = mode;
    this.alternateViewMode = alterMode;
    return this.$rootScope.$broadcast('customerStateChanged', {thisState: mode, alterState: alterMode})
  }

  setAlterState(mode){
    "use strict";
    return this.alternateViewMode = mode;
  }


}
