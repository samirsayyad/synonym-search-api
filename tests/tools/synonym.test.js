const {
  addSynonym,
  findSynonyms,
  synonymGraph,
} = require('../../tools/synonym');
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

  test('Should handle empty input gracefully', () => {
    expect(findSynonyms('')).toEqual([]);
  });
});
