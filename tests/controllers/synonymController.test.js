const {
  addSynonymRequestHandler,
  findSynonymsRequestHandler,
  deleteSynonymRequestHandler,
} = require('../../controllers/synonymController');
const {
  addSynonym,
  findSynonyms,
  deleteSynonym,
} = require('../../services/synonym');
const logger = require('../../utils/logger');

// Mock logger and service functions
jest.mock('../../services/synonym');
jest.mock('../../utils/logger');

describe('Synonym Request Handlers', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('addSynonymRequestHandler', () => {
    test('should add synonym and return 201 status', async () => {
      mockReq.body = { word: 'happy', synonym: 'joyful' };
      await addSynonymRequestHandler(mockReq, mockRes, mockNext);

      expect(addSynonym).toHaveBeenCalledWith('happy', 'joyful');
      expect(logger.info).toHaveBeenCalledWith(
        'Synonym added: "joyful" for "happy"'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Synonym "joyful" added for "happy".',
      });
    });

    test('should call next with error if word or synonym is missing', async () => {
      mockReq.body = { synonym: 'joyful' };
      await addSynonymRequestHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error('Word and synonym are required')
      );
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('findSynonymsRequestHandler', () => {
    test('should find synonyms and return them', async () => {
      mockReq.body = { word: 'happy' };
      findSynonyms.mockResolvedValue(['joyful', 'cheerful']);
      await findSynonymsRequestHandler(mockReq, mockRes, mockNext);

      expect(findSynonyms).toHaveBeenCalledWith('happy');
      expect(mockRes.json).toHaveBeenCalledWith({
        synonyms: ['joyful', 'cheerful'],
      });
    });

    test('should call next with error if word is missing', async () => {
      mockReq.body = {};
      await findSynonymsRequestHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Word is required'));
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteSynonymRequestHandler', () => {
    test('should delete synonym and return success message', async () => {
      mockReq.body = { word: 'happy', synonym: 'joyful' };
      await deleteSynonymRequestHandler(mockReq, mockRes, mockNext);

      expect(deleteSynonym).toHaveBeenCalledWith('happy', 'joyful');
      expect(logger.info).toHaveBeenCalledWith(
        'Synonym deleted: "joyful" for "happy"'
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Synonym "joyful" deleted for "happy".',
      });
    });

    test('should call next with error if word or synonym is missing', async () => {
      mockReq.body = { word: 'happy' };
      await deleteSynonymRequestHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error('Word and synonym are required')
      );
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});
