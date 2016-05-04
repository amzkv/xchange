export function WhenScrolledDirective() {
  'ngInject';
  return function (scope, elem, attrs) {
    var row = elem[0];
    var currentBreakPoint = row.scrollHeight-100;
    elem.bind("scroll", function () {
      if ((row.scrollTop + row.offsetHeight + 5) >= row.scrollHeight) {
        scope.loading = true;
        scope.$apply(attrs.whenScrolled);
      }
    });
  }
}
