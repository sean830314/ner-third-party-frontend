import bodyParser from 'body-parser'
import axios from 'axios'
var FormData = require('form-data');
const express = require('express')
const app = express()
app.use(bodyParser.json())
app.post('/recognize', async function (req, res) {
  const payload = req.body
  var result = {};
  result.ner = {};
  result.ner.tableColConfigs = []; 
  result.ner.tableData = [];
  try {
    console.log("Received:")
    const formData = new FormData()
    formData.append('type', payload["model_type"]);
    formData.append('paragraph', payload["paragraph"]);
    console.log(formData)
    const response = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3001/api/v1/ner/paragraph/recognize',
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    if (response.status == 200) {
      console.log("call ner api success")
      console.log(response.data)
      const tableCols = new Array()
      response.data.ner.forEach(function (item, index) {
        for (let i = 0; i < item["entities"].length; i++) {
          item["entities"][i]["model"] = item["model"]
          // combine text instances of the same entity into an array
          var text = ""
          for (let j = 0; j < item["entities"][i]["values"].length; j++) {
            if (j == item["entities"][i]["values"].length-1) {
              text += "\"" + item["entities"][i]["values"][j] + "\""
            }else{
              text += "\"" + item["entities"][i]["values"][j] + "\", "
            }
          }
          item["entities"][i]["values"] = "["+text+"]"
          // build column data
          result.ner.tableData.push(item["entities"][i])
        }
      })
      // build column metadata
      tableCols.push("model")
      tableCols.push("type")
      tableCols.push("values")
      tableCols.forEach(function(key){
        result.ner.tableColConfigs.push({ prop: key, label: key[0].toUpperCase() + key.slice(1) })
      });
      console.log("11111")
      console.log(result)
    }
    else {
      console.log("call ner api faild, status code not 200")
    }
    res.json(result)
  } catch (e) {
    console.log("Catch Exception")
    console.log(e)
    res.json({ error: e })
  }
})
app.post('/annotate', async function (req, res) {
  const payload = req.body
  var result = {};
  result.annotations = [];
  try {
    console.log("Received:")
    var data = JSON.stringify({"type": payload["model_type"], "record_ids": payload["labelstudio_ids"]});
    console.log(data)
    const response = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3001/api/v1/ner/labelstudio/annotate',
      data: data,
      headers: {
        'Content-Type': `application/json; boundary=${data._boundary}`,
      },
    });
    if (response.status == 200) {
      console.log("call annotate api success")
      result = JSON.stringify(response.data)
    }
    else {
      console.log("call annotate api faild, status code not 200")
      console.log(response.status)
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
