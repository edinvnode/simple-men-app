const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

async function connectToMongo() {
  try {
    mongoose.connection.on('connecting', () => {
      console.log(`MongoDB: connecting.`);
    });
    mongoose.connection.on('connected', () => {
      console.log('MongoDB: connected.');
    });
    mongoose.connection.on('disconnecting', () => {
      console.log('MongoDB: disconnecting.');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB: disconnected.');
    });

    if (
      mongoose.connection.readyState !== 1 &&
      mongoose.connection.readyState !== 2
    ) {
      const conn = await mongoose.connect('mongodb://localhost:27017/posts', {
        // <- replace connection string if necessary
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      mongooseConnection = conn.connection;
    }
  } catch (error) {
    console.log(`Error connecting to DB`, error);
  }
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

//connect to mongoDB
connectToMongo();

const schema = {
  title: String,
  description: String,
};

const Article = mongoose.model('articles', schema);

app.get('/article', async (request, response) => {
  const articles = await Article.find({});
  response.send({ data: articles });
});

app.post('/article', (request, response) => {
  const somename = Article({
    title: String(request.body.title),
    description: String(request.body.description),
  });

  somename.save();

  const title = request.body.title;
  const description = request.body.description;

  //console.log(title);
  //console.log(description);

  response.send('Data received');
});

app.delete('/article', async (request, response) => {
  await Article.deleteMany({});
  console.log('Articles deleted.');
});

app.get('/article/:articleTitle', async (request, response) => {
  const oneArticle = await Article.findOne({
    title: String(request.params.articleTitle),
  }).exec();
  //console.log(oneArticle);
  response.send({ oneArticle });
});

app.delete('/article/:articleTitle', async (request, response) => {
  const deletedArticle = await Article.deleteOne({
    title: request.params.articleTitle,
  });
  console.log(deletedArticle);
});

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});
