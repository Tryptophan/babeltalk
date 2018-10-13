const axios = require('axios');


const translate = (text, targetLang, sourceLang, callback) => {
  let token = process.env.TRANSLATION_API_KEY;
  axios.post(`https://translation.googleapis.com/language/translate/v2?key=` + token, {
    q: text,
    target: targetLang,
    source: sourceLang
  }).then(data => {
    console.log(data.data.data.translations);
    callback(data.data.data.translations)
  })
  .catch(err =>{
    console.log(err);
    callback(null, err)
  });
  
}

export default {translate};
// translate('hello', 'ru', 'en', (translation) => {
//     console.log(translation);
// });
