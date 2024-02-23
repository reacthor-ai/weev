import {Dataset, PlaywrightCrawler} from 'crawlee';
import {v4 as uuidv4} from 'uuid';
import {writeFile} from "fs/promises";

// Define your requestHandler
async function requestHandler({request, page}) {
  // Navigate to the URL of the image directly
  let count = 0
  await page.goto(request.url);
  const name = request.url.slice(request.url.length - 15).trim() + uuidv4().slice(0, 5)

  // Fetch the image content as a binary string
  const binaryString = await page.evaluate(() => {
    return fetch(document.location.href)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        const byteArray = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < byteArray.byteLength; i++) {
          binaryString += String.fromCharCode(byteArray[i]);
        }
        return btoa(binaryString); // Encode binary string to base64
      });
  });

  // Convert the base64 encoded binary string back to a Buffer
  const buffer = Buffer.from(binaryString, 'base64');

  // Define the path and filename for the image
  const filePath = `images-200/${name}.jpg`;

  // Save the image buffer to a file
  await writeFile(filePath, buffer)

  console.log(`Image has been downloaded and saved to ${name}, number: ${count}`);
}

const data = await Dataset.open('prompt-image-data-set');
const images: string[] = await data.map(d => d.image)
const cleanImages = images.filter(url => !url.includes('null'))
console.log({d: cleanImages.length})

const crawler = new PlaywrightCrawler({
  requestHandler,
  maxRequestsPerCrawl: cleanImages.length
});

await crawler.run(cleanImages.slice(100));