import bodyParser from 'body-parser'
import axios from 'axios'
const express = require('express')
const app = express()
app.use(bodyParser.json())
app.post('/', function (req, res) {
    const payload = req.body
    console.log('%s', payload) 
    const model = payload.model
    const paragraph = payload.paragraph
    res.json({ tableData: [{
        model: "Azure",
        organization: ['Northrop Grumman Systems Corporation, a Delaware corporation', 'CIFF Business Enterprises LLC (CIFF BE) a Maryland corporation', 'CIFF Technology Corporation, (CIFF TC) a British Virgin Islands Corporation'],
        date: ['2016-05-02', '2016-05-02'],
        address: ['2340 Dulles Corner Blvd, Herndon VA, 20171', '270 C St., Solomons, MD 20688', 'Mill Mall Tower, 2nd Floor, Wickhams Cay 1, Road Town, Tortola']
    }, {
        model: "Spacy",
        organization: ['Herndon VA', 'British Virgin Islands Corporation', 'CIFF Technology Corporation', 'CIFF Business Enterprises LLC', 'C St.,', 'Wickhams Cay 1', 'Northrop Grumman Information Systems Sector', 'Defense Systems Division', 'Northrop Grumman Systems Corporation', 'NG', 'NON', 'the “Party', 'Discloser'],
        date: ['2016-05-12', '2015-01-02'],
        address: ['Delaware', 'Solomons', 'Tortola', 'Maryland', 'British Virgin Islands', 'Floor']
    },{
        model: "NLTK",
        organization: ['AGREEMENT', 'Northrop Grumman Systems Corporation', 'Delaware', 'Defense Systems Division', 'Dulles Corner Blvd', 'Herndon VA', 'CIFF Business Enterprises', 'CIFF', 'CIFF Technology Corporation', 'CIFF', 'Virgin Islands Corporation', 'Wickhams Cay', 'Road Town'],
        date: ['20688', '2340', '20171'],
        address: ['Northrop', 'Maryland', 'Solomons', 'British', 'Tortola', 'British']
    }
    ] });
  })
// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}