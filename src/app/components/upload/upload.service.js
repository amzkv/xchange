export class UploadService {
  constructor($q, documentsService) {
    'ngInject';
    this.template = '<div class="dz-preview dz-file-preview"><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-filename"><span data-dz-name></div></span><div class="dz-error-message"><span data-dz-errormessage></span><div></div>';
    let self = this;
    this.dropzone = null;

    this.localAcceptHandler = function(file, done) {
      self.sendInterceptPromise(file).then(result => {

        //file.contents = result;
        //file.status = 'success';//Dropzone.SUCCESS;
        //Dropzone.processFile(file);
        //console.log($scope.dzMethods);
        /*if(typeOf(this.localSuccess) === 'function') {
         this.localSuccess(file, done);
         } else {
         done(); // empty done signals success
         }*/

      }).catch(result => {

        /*if(typeOf(this.localFailure) === 'function') {
         file.contents = result;
         this.localFailure(file, done);
         } else {
         done(`Failed to download file ${file.name}`);
         console.warn(file);
         }*/

      });
    };

    this.setSuccess = function(file) {
      file.status = 'success';
      file.processing = false;

      self.dropzone.emit("success", file, 'file uploaded');
      self.dropzone.emit("complete", file);
    };

    this.setError = function(file, errorMessage) {
      file.status = 'error';
      file.processing = false;
      errorMessage = errorMessage || 'error';
      self.dropzone.emit("error", file, errorMessage);
    };

    this.sendInterceptPromise = function(file, done) {
      file.status = 'queued';
      return $q(function(resolve, reject) {

        let options = {
          'readType': 'readAsText'
        };

        let uploadOptions = {
          'name': file.name
        };

        if (self.uploadType) {
          uploadOptions.type = self.uploadType;
        }

        //let starttime = new Date();

        let reader = new FileReader();

        reader.onload = () => {
          //console.log(new Date() - starttime, 'ms');

          self.dropzone.emit("uploadprogress", file, 50, file.upload.bytesSent);

          let base64contents = btoa(reader.result);

          //TODO: uncomment when it's done
          documentsService.callUploadFile(base64contents, uploadOptions).then(
            function(response) {
              //success
              //console.log(response, angular.isUndefined(response.error));
              if (angular.isUndefined(response.error)) {
                self.dropzone.emit("uploadprogress", file, 100, file.upload.bytesSent);
                self.setSuccess(file);
              } else if (response.error) {
                self.dropzone.emit("uploadprogress", file, 100, file.upload.bytesSent);
                //console.log(response);
                self.setError(file,response.error);
                self.dropzone.emit("complete", file);
              }
            },
            function (response) {
              //error
              self.setError(file);
            }
          );


          //$scope.dzMethods.getDropzone().emit("error", file, 'error');

          resolve(reader.result);
        };
        reader.onerror = () => {

          /*file.status = 'success';
           file.processing = false;*/
          self.dropzone.emit("error", file, 'error');

          reject(reader.result);
          //console.log('err');
        };

        reader.onprogress = (fileProgress) => {
          let progress = Math.round((fileProgress.loaded / fileProgress.total) * 100);
          file.upload.bytesSent = fileProgress.loaded;
          self.dropzone.emit("uploadprogress", file, progress, file.upload.bytesSent);
          //$scope.dzMethods.getDropzone().updateTotalUploadProgress();
          //console.log(fileProgress, file);
        };

        // run the reader
        //reader[options.readType](file);

        reader.readAsBinaryString(file);

        file.status = 'uploading';
        file.processing = true;
        self.dropzone.emit("processing", file);
      });
    };

    this.acceptAltHandler = function(file, done) {
      self.dropzone.processFile(file);
    };
  }
}
