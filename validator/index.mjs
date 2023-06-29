import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

// Usage example
const directoryPath = '..' + path.sep;
const fileName = 'did.json';
const githubRepository = process.env.GITHUB_REPOSITORY ?? 'cre7/.well-known';
const githubUser = githubRepository.split('/')[0];
const repository = githubRepository.split('/')[1] === '.well-known' ? '' : `:${githubRepository.split('/')[1]}`;
const preDidId = `did:web:${githubUser}.github.io${repository}`;
let foundError = false;


/**
 * Recursively searches a directory for files with a matching name.
 * @param {*} directoryPath 
 * @param {*} fileName 
 * @returns 
 */
async function findFilesWithMatchingName(directoryPath, fileName) {
  try {
    const files = await readdirSync(directoryPath);
    const matchingFiles = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await statSync(filePath);

      if (stats.isDirectory()) {
        // Recursively search subdirectories
        const subdirectoryMatches = await findFilesWithMatchingName(filePath, fileName);
        matchingFiles.push(...subdirectoryMatches);
      } else if (file === fileName) {
        // Found a matching file
        matchingFiles.push(filePath);
      }
    }

    return matchingFiles;
  } catch (err) {
    throw err;
  }
}

/**
 * Will check if the id value in the did.json file matches with the expected id value based on the path and repository.
 * @param {*} filePath 
 */
function validateIdMatch(filePath) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    const folder = filePath.slice(3, -8).split(path.sep);
    const shouldId = `${preDidId}${folder.length > 0 ? `${folder.join(':')}` : ''}`;
    if(shouldId !== content.id) {
      throw new Error(`Id mismatch: ${shouldId} !== ${content.id}`);
    }
  } catch (err) {
    console.log(err.message);
    foundError = true;
  };
}

findFilesWithMatchingName(directoryPath, fileName)
  .then(async (filePaths) => {
    for(const filePath of filePaths) {
      validateIdMatch(filePath);
    }
    if(foundError) {
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });

