export class ViewerService {
  constructor($q, documentsService) {
    'ngInject';
    this.readOptions = {};
    this.getTestData = function(fileUrl) {
      //XLSX.readFile(fileUrl, this.readOptions)
    };

    this.workbooktoJson = function(workbook) {
      var sheetArr = [];
      var sheetNamesArr = [];
      workbook.SheetNames.forEach(function(sheetName) {
        //var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json = XLS.utils.sheet_to_json(workbook.Sheets[sheetName]);
        //console.log(json);
        if (json.length > 0) {
          sheetArr.push(json);
          sheetNamesArr.push(sheetName);
        }
      });
      return {
        'data': sheetArr,
        'names': sheetNamesArr
      };
    };

    this.workbookToCsv = function(workbook) {
      var result = [];
      workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
          result.push("SHEET: " + sheetName);
          result.push("");
          result.push(csv);
        }
      });
      return result.join("\n");
    };

    this.readXLdata = function(data, type) {
      if (XLSX) {
        type = type || 'binary';
        return XLSX.read(data, {type: type});
      } else {
        return null;
      }
    }
  }
}
