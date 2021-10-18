const express = require('express')
const app = express()

require('dotenv').config()


const multer = require('multer')
const upload = multer()


var path = require('path');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var AWS = require('aws-sdk');
const { response } = require('express')
const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: process.env.AWS_REGION
})
AWS.config = config
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'CompanyTable'

app.get('/', function (req, res) {
  const params = {
    TableName: tableName
  }
  docClient.scan(params, (err, data) => {
    if (err) {
      res.send('Có lỗi xảy ra trong quá trình lấy dữ liệu');
    }
    else {
      // for (let index = 0; index < data.Items.length; index++) {
      //     const element = data.Items[index]
      //     element.index = index+1
      //     console.log(element)

      // }
      res.render('index', { data: data.Items })
    }
  })


})
app.post('/', upload.fields([]), function (req, res) {
  console.log(req.body.comanyName)
  const { companyName, avatar } = req.body
  const params = {
    TableName: tableName,
    Item: {
      companyName: companyName,
      avatar: avatar


    }
  }
  docClient.put(params, (err, data) => {
    if (err) {
      res.send('Có lỗi xảy ra trong quá trình lấy dữ liệu')
    }
    else {
      return res.redirect('/');
    }
  })

})
app.get('/:name', function (req, res) {
  let name = req.params.name
  res.send(name)
})
app.post('/delete', upload.fields([]), function (req, res) {
  let {companyName} = req.body
  console.log(companyName)
  const params = {
    TableName: tableName,
    Key: {
      companyName: companyName
    }
  }
  docClient.delete(params, (err, data) => {
    if (err) {
      res.send('Có lỗi xảy ra trong quá trình lấy dữ liệu')
    }
    else {
      return res.redirect('/');
    }


  })
});

app.listen(3000)

/**  delete với nhiều checkbox (type="checkbox" name="data[i].id")
app.post('/delete', upload.fields([]), function (req, res) {
  const listDelete = Object.keys(req.body)
  console.log(listDelete)
  function onDeleteItem(index) {

    const params = {
      TableName: tableName,
      Key: {
        id: listDelete[index]
      }
    }
    docClient.delete(params, (err, data) => {
      if (err) {
        res.send('Có lỗi xảy ra trong quá trình lấy dữ liệu')
      }
      else {
        if(index>0){
          onDeleteItem(index-1)
        }
        else {
          return res.redirect('/');}

      }
    })
  }
  onDeleteItem(listDelete.length-1)


});
*/