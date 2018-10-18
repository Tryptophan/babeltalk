const axios = require('axios');

const translate = (text, targetLang, sourceLang, callback) => {
  let token = process.env.TRANSLATION_API_KEY;
  axios.post('https://translation.googleapis.com/language/translate/v2?key=' + token, {
    q: text,
    target: targetLang,
    source: sourceLang
  }).then(res => {
    callback(null, res.data.data.translations);
  }).catch(err => {
    callback(err, null);
  });
}

module.exports = { translate };
