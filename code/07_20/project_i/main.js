// @ts-check

/* 키워드로 검색해서 나온 이미지를 원한느 사이즈로 리사잊이해서 돌려주는 서버 */
const fs = require('fs');
const path = require('path');
const { createApi } = require('unsplash-js');
const { default: fetch } = require('node-fetch');
const http = require('http');
const sharp = require('sharp');
const { pipeline } = require('stream');
const { promisify } = require('util');
const unsplash = createApi({
  accessKey: '3rHurJmsr-W-rhgRBYyfSV5WvvzlIV5SYYbaAXYzbUM',
  // @ts-ignore
  fetch,
});
/**
 *
 * @param {string} query
 *
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({ query });
  if (!result.response) {
    throw new Error('search image error');
  }
  const image = result.response.results[0];

  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  };
}
/**
 * 이미지를 검색하거나, 이미 있다면 캐시된 이미지를 리턴한다.
 * @param {string} query
 */
async function getCachedImageOrSearchedImage(query) {
  const imageFilePath = path.resolve(__dirname, `./images/${query}`);
  if (fs.existsSync(imageFilePath)) {
    return {
      stream: fs.createReadStream(imageFilePath),
      message: `Returning cached image: ${query}`,
    };
  }
  const result = await searchImage(query);
  const resp = await fetch(result.url);

  await promisify(pipeline)(resp.body, fs.createWriteStream(imageFilePath));
  return {
    stream: fs.createReadStream(imageFilePath),
    message: `Returng new image: ${query}`,
  };
}

/**
 *
 * @param {string} url
 */
function convertURL(url) {
  const urlObj = new URL(url, 'http://localhost:5000');
  /**
   * @param {string} name
   * @param {number} defaultValue
   * @returns
   */
  function getSearchParam(name, defaultValue) {
    const str = urlObj.searchParams.get(name);
    return str ? parseInt(str, 10) : defaultValue;
  }
  const width = getSearchParam('width', 400);
  const height = getSearchParam('height', 400);

  return {
    query: urlObj.pathname.slice(1),
    width,
    height,
  };
}

const server = http.createServer((req, res) => {
  async function main() {
    // /cloud
    if (!req.url) {
      res.statusCode = 400;
      res.end('Needs URL');
      return;
    }

    const { query, width, height } = convertURL(req.url);
    try {
      const { message, stream } = await getCachedImageOrSearchedImage(query);
      await promisify(pipeline)(
        stream,
        sharp().resize(width, height).png(),
        res
      );
      console.log(message, width);
    } catch {
      res.statusCode = 400;
      res.end();
    }
  }

  main();
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log('The server is running');
});
