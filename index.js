class SearchEngine {
  entities = [];
  options = {
    paths: []
  };

  constructor(entities, options) {
    this.entities = entities;
    this.options = options;
  }

  find(query) {
    if (!this.entities.length) {
      return null;
    }

    let result = null;

    for (const entity of this.entities) {
      if (typeof entity === "object") {
        for (const path of this.options.paths) {
          const string = getDescendantProp(entity, path);
          if (levenshteinDistanceSearch(query, string, string.length)) {
            result = string;
            break;
          }
        }
      } else {
        const string = entity.toString();
        if (levenshteinDistanceSearch(query, string, string.length)) {
          result = string;
          break;
        }
      }

      if (result) {
        break;
      }
    }

    return result;
  }
}

function getDescendantProp(obj, desc) {
  let arr = desc.split(".");
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
}

function levenshteinDistanceSearch(query, string, maxDistance) {
  const m = query.length;
  const n = string.length;

  const matrix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    matrix[i][0] = i;
  }

  for (let j = 1; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (query[i - 1] === string[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  let minDistance = Infinity;
  for (let j = 1; j <= n; j++) {
    minDistance = Math.min(minDistance, matrix[m][j]);
  }

  return minDistance <= maxDistance; // is match
}

const entities = [
  {test: "making"},
  {test: "Search"},
  {test: "my so long text"},
  {test: "my so long engine"},
  {test: "engine"},
  {test: "path"},
  {test: "regexoid"},
]

const searchEngine = new SearchEngine(entities, {
  paths: ["test"]
});
// Todo: add percentage match of words with query
// Todo: add optiomizations
console.log(searchEngine.find("mking"));