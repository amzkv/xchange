/**
 * Created by decipher on 18.2.16.
 */
describe('service documentsService', () => {
  beforeEach(angular.mock.module('xchange'));

  it('should be registered', inject(documentsService => {
    expect(documentsService).not.toEqual(null);
  }));

  describe('callDocumentsCore function', () => {
    it('should exist', inject(documentsService => {
      expect(documentsService.callDocumentsCore).not.toBeNull();
    }));

    it('should return array of object', inject(documentsService => {
      const data = documentsService.callDocumentsCore();
      expect(data).toEqual(jasmine.any(Array));
      expect(data[0]).toEqual(jasmine.any(Object));
      expect(data.length > 0).toBeTruthy();
    }));
  });
});
