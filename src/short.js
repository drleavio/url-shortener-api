const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const base = characters.length;

let urlDatabase = {}; // Simulated in-memory database
let id = 0;

function encode(num) {
  let shortUrl = "";
  while (num > 0) {
    shortUrl = characters[num % base] + shortUrl;
    num = Math.floor(num / base);
  }
  return shortUrl;
}

function shortenUrl(originalUrl) {
  id++; // auto-increment ID
  const shortKey = encode(id);
  const shortUrl = `https://short.ly/${shortKey}`;
  urlDatabase[shortKey] = originalUrl;
  return shortUrl;
}

function getOriginalUrl(shortKey) {
  return urlDatabase[shortKey] || null;
}

module.exports = {
    shortenUrl,
    getOriginalUrl
  };

// Example
// const longUrl = "https://example.com/my/long/url/path";
// const short = shortenUrl(longUrl);

// console.log("Short URL:", short);
// console.log("Original URL:", getOriginalUrl(short.replace("https://short.ly/", "")));
