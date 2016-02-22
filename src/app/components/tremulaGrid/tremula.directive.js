/**
 * Created by decipher on 19.2.16.
 */
/*export function TremulaDirective($timeout) {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/tremula/tremula.html',
    scope: {},
    link: function ($scope, elem) {
      let tremulaBase;

      function createTremula() {

        let $tremulaContainer = elem;
        let tremula = new Tremula();
        let config = {
          itemConstraint: 150,//px
          itemMargins: [10, 10],//x (left & right), y (top & bottom) in px
          staticAxisOffset: 0,//px
          scrollAxisOffset: 20,//px
          scrollAxis: 'x',//'x'|'y'
          surfaceMap: tremula.projections.xyPlain,
          staticAxisCount: 2,//zero based
          defaultLayout: tremula.layouts.xyPlain,
          itemPreloading: true,
          itemEasing: false,
          isLooping: false,
          itemEasingParams: {
            touchCurve: tremula.easings.easeOutCubic,
            swipeCurve: tremula.easings.easeOutCubic,
            transitionCurve: tremula.easings.easeOutElastic,
            easeTime: 500,
            springLimit: 40 //in px
          },
          onChangePub: doScrollEvents,
          data: null,
          lastContentBlock: {
            template: '<div class="lastContentItem"></div>',
            layoutType: 'tremulaBlockItem',
            noScaling: true,
            w: 300,
            h: 300,
            isLastContentBlock: true,
            adapter: tremula.dataAdapters.TremulaItem
          },
          adapter: null

        };
        tremula.init($tremulaContainer, config, this);
        return tremula;
      }

      function doScrollEvents(o) {
        if (o.scrollProgress > .7) {
          if (!tremula.cache.endOfScrollFlag) {
            tremula.cache.endOfScrollFlag = true;
            pageCtr++;
            loadFlickr();
            console.log('END OF SCROLL!')
          }
        }
      }

      let pageCtr = 1;

      function applyBoxClick() {
        elem.on('tremulaItemSelect', function (gestureEvt, domEvt) {
          console.log(gestureEvt, domEvt)
          var
            $e = $(domEvt.target);
          if ($e.closest('.gridBox')[0]) {
            var data = $.data(t).model.model.data;
          }
          if (data)alert(JSON.stringify(data));
        })
      }

      $timeout(function () {
        tremulaBase = createTremula();
        applyBoxClick();
        loadFlickr()
      }, 1);
    }
  }


//controller: TremulaController,
    //controllerAs: 'tremula',
    //bindToController: true
  //};

  return directive;
}

class NavbarController {
  constructor () {
    'ngInject';

    // "this.creation" is available by directive option "bindToController: true"

  }
}
*/
