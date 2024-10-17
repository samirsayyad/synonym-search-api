// Synonym graph using a Map for efficient key-value lookup
const synonymGraph = new Map();

// Function to add synonyms (bi-directional)
const addSynonym = (word, synonym) => {
  if (
    !word ||
    !synonym ||
    !['number', 'string'].includes(typeof word) ||
    !['number', 'string'].includes(typeof synonym)
  ) {
    throw new Error(
      'Both word and synonym must be provided as strings or numbers'
    );
  }

  [word, synonym].forEach((word) => {
    if (!synonymGraph.has(word)) {
      synonymGraph.set(word, new Set());
    }
  });

  // Add synonym of word and vice versa
  synonymGraph.get(word).add(synonym);
  synonymGraph.get(synonym).add(word);
};

// Depth-First Search (DFS) traversal
const dfs = (word) => {
  const visited = new Set(); // To track visited words due to cyclical relationships
  const synonyms = new Set(); // To store all related synonyms
  const stack = [word]; // Use a stack to manage the DFS traversal

  while (stack.length > 0) {
    const currentWord = stack.pop();
    if (visited.has(currentWord)) continue; // Skip if the word has been visited
    visited.add(currentWord);

    // Add the word to the synonyms list (only if it's not the start word)
    if (synonymGraph.has(currentWord) && currentWord !== word) {
      synonyms.add(currentWord);
    }

    // Add all unvisited synonyms to the stack
    const unvisitedSynonyms = synonymGraph.get(currentWord) || new Set();
    unvisitedSynonyms.forEach((synonym) => {
      if (!visited.has(synonym)) {
        stack.push(synonym);
      }
    });
  }

  return synonyms;
};

// Function to find all synonyms of a given word, with transitive rule
const findSynonyms = (word) => {
  if (!word || !['number', 'string'].includes(typeof word)) {
    throw new Error('word must be provided as strings or numbers');
  }

  const synonyms = dfs(word); // Start DFS traversal from the initial word
  return [...synonyms]; // Convert Set to Array for returning
};

module.exports = { addSynonym, findSynonyms, synonymGraph };
