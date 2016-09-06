export class TestController {
  constructor($scope, $timeout, ViewerService) {
    'ngInject';
    let self = this;

    this.submitForm = function (event){
      /*console.log(this.testForm, this.testForm.testFile, event);*/
    };

    /*$scope.$watch('gridOptions', function(newv, oldv, scope){
      console.log('gridOptions:', newv, oldv);
    });*/

    let columnDefs = [];



    this.initXLViewer = function() {
      $scope.xldata = [];
      $scope.columnDefs = [];
      $scope.gridApi = {};

      $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        data: 'xldata',
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        }
      };
    };

    this.initXLViewer();

    /*this.workbookToUIGridJsonData = function(workbook) {
      var result = {
        'columns': [],
        'data': []
      };
      workbook.SheetNames.forEach(function(sheetName) {
        //var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        console.log('json:',workbook.Sheets[sheetName]);
        //if(roa.length > 0){
        //}
      });

      return result;
    };*/



    this.resetGrid = function () {
      $scope.$apply(function () {
        $scope.gridOptions.columnDefs = [];
        /*$scope.gridOptions = {
          columnDefs: [],
          data: []
        };*/
      });
    };

    /*$scope.refresht = function() {
      $scope.refresh = true;
      $timeout(function() {
        $scope.refresh = false;
      }, 0);
    };*/

    $scope.getFile = function (element) {
      $scope.xlprocessing = true;
      /*console.log(element, element.files);*/
      if (element.files && element.files[0]) {
        var fileReader = new FileReader();
        fileReader.onload = function (file) {
          let data = fileReader.result;
          let workbook = ViewerService.readXLdata(data);
          let jsonSheets = {};
          if (workbook) {
            jsonSheets = ViewerService.workbooktoJson(workbook);
          } else {
            //error
          }

          self.resetGrid();
          if (jsonSheets.data && jsonSheets.data[0]) {
            $scope.$apply(function () {
              $scope.xldata = jsonSheets.data[0];
              $scope.xlprocessing = false;
            });
          }
        };
        fileReader.readAsBinaryString(element.files[0]);
        //fileReader.readAsDataURL(element.files[0]);
      }
    }
  }
}
