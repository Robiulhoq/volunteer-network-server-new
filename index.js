const express = require('express')
const app = express()
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const port = 4000


app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9ov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
  const collection = client.db("volunteer").collection("userinfo");
  const ragisterUserCollection = client.db("volunteer").collection("ragisteruser");
    
  app.post('/addEvent', (req, res) =>{
      const event = req.body;
      collection.insertMany(event)
      .then(result => {
          res.send(result)
      })
  });

  app.post('/ragisterinfo',(req, res) =>{
      const user = req.body;
      ragisterUserCollection.insertOne(user)
      .then(result =>{
          res.send(result)
      })
  })
  app.get('/ragistation/:id', (req, res) =>{
      collection.find({id: req.params.id})
         .toArray((err, documents) => {
             res.send(documents[0])
         })   
  })

  app.get('/ragisteruser', (req, res) =>{
    ragisterUserCollection.find({email: req.query.email})
    .toArray((err, documents) =>{
        res.send(documents)
    })
  })
  app.delete('/delateevent', (req, res) =>{
    ragisterUserCollection.deleteOne({id: req.query.id})
    .then(result =>{
        res.send(result.deletedCount > 0)
    })
  })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)