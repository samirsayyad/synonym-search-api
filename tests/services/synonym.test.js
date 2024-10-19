const {
  addSynonym,
  findSynonyms,
  deleteSynonym,
  synonymGraph,
} = require('../../services/synonym');
const { performance } = require('perf_hooks');

describe('Synonym Search Tool - DFS Implementation', () => {
  // Clear the synonym graph before each test
  beforeEach(() => {
    synonymGraph.clear();
  });

  test('Stress test for synonym functions', () => {
    // Add a large number of synonyms
    for (let i = 0; i < 10000; i++) {
      addSynonym(`word${i}`, `word${i + 1}`);
    }

    // Measure the performance of findSynonyms
    const start = performance.now();
    const synonyms = findSynonyms('word5000');
    const end = performance.now();
    const timeTaken = end - start;

    console.log(`findSynonyms function took ${timeTaken} milliseconds.`);

    // Check that the correct synonyms were found
    expect(synonyms).toEqual(expect.arrayContaining(['word4999', 'word5001']));

    // Check that the function executed within the time limit
    expect(timeTaken).toBeLessThan(5000); // Example threshold of 5 seconds
  });

  test('Should return correct synonyms for a simple pair', () => {
    addSynonym('clean', 'wash');
    expect(findSynonyms('clean')).toEqual(['wash']);
    expect(findSynonyms('wash')).toEqual(['clean']);
  });

  test('Should return multiple synonyms for a word', () => {
    addSynonym('clean', 'wash');
    addSynonym('clean', 'clear');
    addSynonym('clean', 'tidy');
    expect(findSynonyms('clean')).toEqual(
      expect.arrayContaining(['wash', 'clear', 'tidy'])
    );
    expect(findSynonyms('wash')).toEqual(
      expect.arrayContaining(['clean', 'clear', 'tidy'])
    );
  });

  test('Should handle transitive synonyms correctly', () => {
    addSynonym('clean', 'wash');
    addSynonym('wash', 'rinse');
    expect(findSynonyms('clean')).toEqual(
      expect.arrayContaining(['wash', 'rinse'])
    );
    expect(findSynonyms('rinse')).toEqual(
      expect.arrayContaining(['wash', 'clean'])
    );
  });

  test('A word should not return itself as a synonym', () => {
    addSynonym('clean', 'wash');
    addSynonym('clean', 'clear');
    const synonymsForWord = findSynonyms('clean');
    expect(synonymsForWord).not.toContain('clean');
  });

  test('Should return an empty array for a word with no synonyms', () => {
    expect(findSynonyms('lonely')).toEqual([]);
  });

  test('Should handle cyclical relationships without infinite loops', () => {
    addSynonym('A', 'B');
    addSynonym('B', 'C');
    addSynonym('C', 'A');
    expect(findSynonyms('A')).toEqual(expect.arrayContaining(['B', 'C']));
    expect(findSynonyms('B')).toEqual(expect.arrayContaining(['A', 'C']));
    expect(findSynonyms('C')).toEqual(expect.arrayContaining(['A', 'B']));
  });

  test('Should return an empty array for a word not in the synonym graph', () => {
    expect(findSynonyms('nonexistent')).toEqual([]);
  });

  test('Should return an error with empty input gracefully', () => {
    expect(() => {
      addSynonym('', '');
    }).toThrow('Both word and synonym must be provided as strings or numbers');
    expect(() => {
      findSynonyms('');
    }).toThrow('word must be provided as strings or numbers');

    expect(() => {
      addSynonym('word', null);
    }).toThrow('Both word and synonym must be provided as strings or numbers');
    expect(() => {
      addSynonym(null, 'word');
    }).toThrow('Both word and synonym must be provided as strings or numbers');
    expect(() => {
      findSynonyms(null);
    }).toThrow('word must be provided as strings or numbers');
  });

  // deleteSynonym tests
  test('should not delete a synonym if word or synonym does not exist', () => {
    addSynonym('happy', 'joyful');

    // Delete with non-existing synonym (e.g., "sad")
    deleteSynonym('happy', 'sad');

    // "happy" should still have "joyful" as synonym
    expect(findSynonyms('happy')).toEqual(['joyful']);
    expect(findSynonyms('joyful')).toEqual(['happy']);
  });

  test('should delete synonym completely when no more connections', () => {
    addSynonym('happy', 'joyful');
    addSynonym('happy', 'cheerful');

    // Delete one synonym
    deleteSynonym('happy', 'joyful');

    // "happy" should only have "cheerful"
    expect(findSynonyms('happy')).toEqual(['cheerful']);
    expect(findSynonyms('joyful')).toEqual([]); // "joyful" should have no synonyms left

    // Synonym graph should not contain "joyful" anymore
    expect(synonymGraph.has('joyful')).toBe(false);
  });
  test('should delete a synonym pair in both directions', () => {
    addSynonym('happy', 'joyful');

    // Delete the synonym
    deleteSynonym('happy', 'joyful');

    // Both words should have no synonyms left
    expect(findSynonyms('happy')).toEqual([]);
    expect(findSynonyms('joyful')).toEqual([]);
  });

  // Edge case: Deleting a non-existent synonym
  test('should handle deleting a non-existent synonym without error', () => {
    addSynonym('happy', 'joyful');

    // Try to delete a synonym that doesn't exist
    expect(() => deleteSynonym('happy', 'sad')).not.toThrow();
    expect(findSynonyms('happy')).toEqual(['joyful']);

    expect(() => deleteSynonym('joyful', 'cheerful')).not.toThrow();
    expect(findSynonyms('joyful')).toEqual(['happy']);
  });

  // Removing a word entirely if all synonyms are deleted
  test('should remove a word from the graph if all its synonyms are deleted', () => {
    addSynonym('happy', 'joyful');
    addSynonym('happy', 'cheerful');

    // Delete all synonyms for "happy"
    deleteSynonym('happy', 'joyful');
    deleteSynonym('happy', 'cheerful');

    // "happy" should no longer exist in the graph
    expect(synonymGraph.has('happy')).toBe(false);
    expect(findSynonyms('happy')).toEqual([]);
  });

  // Deleting from a chain of synonyms
  test('should delete only the specified synonym in a chain of synonyms', () => {
    addSynonym('happy', 'joyful');
    addSynonym('joyful', 'cheerful');

    // Delete "joyful" from "happy", but keep "joyful" linked to "cheerful"
    deleteSynonym('happy', 'joyful');

    // "happy" should not have "joyful" anymore
    expect(findSynonyms('happy')).toEqual([]);

    // "joyful" should still be linked to "cheerful"
    expect(findSynonyms('joyful')).toEqual(['cheerful']);
    expect(findSynonyms('cheerful')).toEqual(['joyful']);
  });

  // Edge case: Deleting with empty or invalid inputs
  test('should handle deletion with invalid inputs', () => {
    addSynonym('happy', 'joyful');

    // Invalid deletion calls
    expect(() => deleteSynonym('', 'joyful')).toThrow(
      'Both word and synonym must be provided as strings or numbers'
    );
    expect(() => deleteSynonym('happy', '')).toThrow(
      'Both word and synonym must be provided as strings or numbers'
    );
    expect(() => deleteSynonym('', '')).toThrow(
      'Both word and synonym must be provided as strings or numbers'
    );
    // delete something that doesn't exist
    deleteSynonym('test', 'hello');

    // No deletions should have occurred
    expect(findSynonyms('happy')).toEqual(['joyful']);
  });

  test('Should not delete cyclical relationships', () => {
    addSynonym('A', 'B');
    addSynonym('B', 'C');
    addSynonym('C', 'A');
    deleteSynonym('A', 'B');
    expect(findSynonyms('A')).toEqual(['C', 'B']);
    expect(findSynonyms('B')).toEqual(['C', 'A']);
    expect(findSynonyms('C')).toEqual(['A', 'B']);
  });
  test('Should delete cyclical relationships', () => {
    addSynonym('A', 'B');
    addSynonym('B', 'C');
    addSynonym('C', 'A');
    deleteSynonym('B', 'C');
    deleteSynonym('C', 'A');
    expect(findSynonyms('A')).toEqual(['B']);
    expect(findSynonyms('B')).toEqual(['A']);
    expect(findSynonyms('C')).toEqual([]);
  });
});
