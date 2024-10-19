const fs = require('fs').promises;
const path = require('path');

async function mergeFiles(sourceFolder, destinationFolder) {
  // Create destination folder if it doesn't exist
  await fs.mkdir(destinationFolder, { recursive: true });

  try {
    // Read all items in the source folder
    const items = await fs.readdir(sourceFolder, { withFileTypes: true });

    // Filter out only the directories
    const sourceFolders = items
      .filter(item => item.isDirectory())
      .map(item => path.join(sourceFolder, item.name));

    for (const folder of sourceFolders) {
      await processFolder(folder, destinationFolder);
    }

    console.log('File merging completed successfully!');
  } catch (error) {
    console.error(`Error reading source folder ${sourceFolder}:`, error);
  }
}

async function processFolder(sourceFolder, destinationFolder) {
  try {
    const files = await fs.readdir(sourceFolder, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(sourceFolder, file.name);
      const destPath = path.join(destinationFolder, file.name);

      if (file.isDirectory()) {
        await processFolder(sourcePath, destinationFolder);
      } else {
        await fs.copyFile(sourcePath, destPath);
        console.log(`Copied: ${sourcePath} -> ${destPath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing folder ${sourceFolder}:`, error);
  }
}

// Usage example
// const sourceFolder = '/Users/sevda/Downloads/replicate-generations';
// const destinationFolder = '/Users/sevda/ProiecteleMele/DATA/replicate-generations-merged';

// mergeFiles(sourceFolder, destinationFolder);
