const {
  validateAddSynonym,
  validateFindSynonym,
  validateDeleteSynonym,
} = require('../../middlewares/validationMiddleware');
const httpMocks = require('node-mocks-http'); // For mocking req and res objects

describe('Joi Validation Middleware', () => {
  // Helper function to create mock req, res, and next
  const mockNext = jest.fn();
  const createMockReqRes = (body) => {
    const req = httpMocks.createRequest({ body });
    const res = httpMocks.createResponse();
    return { req, res };
  };

  describe('Add Synonym Validation', () => {
    test('should pass validation with valid data', () => {
      const { req, res } = createMockReqRes({
        word: 'happy',
        synonym: 'joyful',
      });
      validateAddSynonym(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled(); // Next function should be called, indicating no errors
    });

    test('should fail validation if word is missing', () => {
      const { req, res } = createMockReqRes({ synonym: 'joyful' });
      validateAddSynonym(req, res, mockNext);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('{"error":"\\"Word\\" is required"}'); // Joi error message
    });

    test('should fail validation if synonym is missing', () => {
      const { req, res } = createMockReqRes({ word: 'happy' });
      validateAddSynonym(req, res, mockNext);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('{"error":"\\"Synonym\\" is required"}'); // Joi error message
    });
  });

  describe('Find Synonym Validation', () => {
    test('should pass validation with valid data', () => {
      const { req, res } = createMockReqRes({ word: 'happy' });
      validateFindSynonym(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should fail validation if word is missing', () => {
      const { req, res } = createMockReqRes({});
      validateFindSynonym(req, res, mockNext);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('{"error":"\\"Word\\" is required"}');
    });
  });

  describe('Delete Synonym Validation', () => {
    test('should pass validation with valid data', () => {
      const { req, res } = createMockReqRes({
        word: 'happy',
        synonym: 'joyful',
      });
      validateDeleteSynonym(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should fail validation if word is missing', () => {
      const { req, res } = createMockReqRes({ synonym: 'joyful' });
      validateDeleteSynonym(req, res, mockNext);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('{"error":"\\"Word\\" is required"}');
    });

    test('should fail validation if synonym is missing', () => {
      const { req, res } = createMockReqRes({ word: 'happy' });
      validateDeleteSynonym(req, res, mockNext);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('{"error":"\\"Synonym\\" is required"}');
    });
  });
});
