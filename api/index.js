import bodyParser from 'body-parser'
import axios from 'axios'
var FormData = require('form-data');
const express = require('express')
const app = express()
app.use(bodyParser.json())
app.post('/', async function (req, res) {
  const payload = req.body
  var result = {};
  result.tableData = [];
  try {
    console.log("Received:")
    console.log(payload["model"])
    console.log(payload["paragraph"])
    const formData = new FormData()
    formData.append('type', payload["model"]);
    formData.append('paragraph', payload["paragraph"]);
    console.log(formData)
    const response = await axios({
      method: 'post',
      url: 'http://10.0.4.58:3001/api/v1/predict/model_predict',
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    if (response.status == 200) {
      console.log("call ner api success")
      console.log(response.data)
      response.data.ner.forEach(function (t, i) {
        console.log('item%s is %s', i, t);
        result.tableData.push(t)
      })
    }
    else {
      console.log("call ner api faild")
    }
    res.json(result)
  } catch (e) {
    console.log("Catch Exception")
    console.log(e)
    res.json({ error: e })
  }
})
// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
