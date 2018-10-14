const axios = require('axios');


const translate = (text, targetLang, sourceLang, callback) => {
  let token = process.env.TRANSLATION_API_KEY;
  axios.post(`https://translation.googleapis.com/language/translate/v2?key=` + token, {
    q: text,
    target: targetLang,
    source: sourceLang
  }).then(res => {
    console.log(res.data.data.translations);
    callback(res.data.data.translations)
  })
  .catch(err =>{
    console.log(err.response.data);
    callback(null, err)
  });
  
}


module.exports = {translate};
// translate('hello', 'ru', 'en', (translation) => {
//     console.log(translation);
// });
