export function NoScopeRepeatDirective($compile) {
  'ngInject';
  return function (scope, elem, attrs) {
    scope.$watch(attrs.items, function (items) {
      if (!items) return;

      let template = '<div>{{ #TPL#.' + attrs.value + ' || #TPL#.' + attrs.defaultvalue + ' }}</div>';

      items.forEach(function (val, key) {
        let newElement = angular.element(
          template.replace(/#TPL#/g, attrs.items + '[' + key + ']')
        );
        $compile(newElement)(scope);
        elem.append(newElement);
      });
    });
  }
}
