import fs from 'fs';
import path from 'path';
import axios from 'axios';
import artworkData from './artwork-data.json' assert { type: 'json' };
// https://www.wikiart.org/en/roy-lichtenstein/all-works#!#filterName:Genre_portrait,resultType:detailed
// $$('.wiki-layout-artist-image-wrapper img').map(img => ({ title: img.title, src: img.src }))


const img = artworkData[0]
// .toLowerCase().replace(/\s+/g, '-')
async function downloadImage(imageObj, index, outputFolder) {
  // const fileName = `pop_art_image_title_${imageObj.title}.jpg`;
  const fileName = `${imageObj.title}_image-${index}.jpg`;
  const filePath = path.join(outputFolder, fileName);

  try {
    const response = await axios({
      method: 'GET',
      url: imageObj.src,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error}`);
    throw error;
  }
}

// Usage example
const outputFolder = './downloaded-images';

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}


artworkData.forEach((img, index) => {
  downloadImage(img, index, outputFolder)
    .then(() => console.log('Image downloaded successfully', img.title))
    .catch((error) => console.error('Failed to download image:', error));
});
