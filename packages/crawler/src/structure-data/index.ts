import {Dataset, Dictionary} from 'crawlee';

type TrainingResults = {
  input: { title: string, description: string },
  output?: { title: string, description: string }
}

const cleanDuplicates = async (data: Dataset<Dictionary>) => {
  const uniqueItems = new Map<string, string>();

  await data.forEach((item) => {
    const identifier = item.title;

    if (!uniqueItems.has(identifier)) {

      if (item?.images && item.images.length > 0) {
        if (item?.recommended && item.recommended.length > 0) {
          item.recommended.map((pro) => {
            if ('image' in pro || 'images' in pro) {
              uniqueItems.set(identifier, pro?.image);
              if (pro?.images && pro.images.length > 0) {
                pro?.images.map(i => {
                  uniqueItems.set(identifier, i);
                })
              }
            }
          })
        }

        item.images.map((img: string) => {
          uniqueItems.set(identifier, img);
        })
      }
    }
  });

  return Array.from(uniqueItems.values()).filter(t => t !== '');
}

async function cleanData() {
  // read data sets
  const readBeyondData = await Dataset.open('beyond-batches');
  const readBonitBatch = await Dataset.open('bonit-batch')
  const readNaiiBatch = await Dataset.open('naii-products')
  const readPerkBatch = await Dataset.open('perk-products')
  const readCastBatch = await Dataset.open('cast-products')
  const readFinixBatch = await Dataset.open('finix-batches')

  const cleanBeyond = await cleanDuplicates(readBeyondData)
  const cleanBonitBatch = await cleanDuplicates(readBonitBatch)
  const cleanNaii = await cleanDuplicates(readNaiiBatch)
  const cleanPerk = await cleanDuplicates(readPerkBatch)
  const cleanCast = await cleanDuplicates(readCastBatch)
  const cleanFinix = await cleanDuplicates(readFinixBatch)

  const combinedData = [
    ...cleanBeyond,
    ...cleanBonitBatch,
    ...cleanNaii,
    ...cleanPerk,
    ...cleanCast,
    ...cleanFinix,
  ];

  try {
    const cleanDataSet = await Dataset.open('prompt-image-data-set')

    for (const image of combinedData) {
      await cleanDataSet.pushData({image});
    }

    await cleanDataSet.exportToJSON('products-sustainable-image', {
      skipEmpty: true
    })
  } catch (error) {
    console.log(`Error performing clean: `, error)
  }

  return {
    "input": {
      "title": "",
      "description": "",
    },

    "output": {
      "title": "",
      "description": "",
    }
  }
}

export async function mergeDataSet() {

  cleanData().then(console.log)
    .catch(err => console.log('ERRORROR!', err))
}