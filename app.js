// Import the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const app = express();
const mongoConnect = require('./database').mongoConnect;
const getDb = require('./database').getDb;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

class Email {
  constructor(email) {
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection('emails')
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const postAddEmail = (req, res, next) => {
  const email = req.body.email;

  const emailDb = new Email(email);
  emailDb.save().then((result) => {
    transporter.sendMail({
      to: email,
      from: 'info@emmetcharm.com',
      subject: 'Emmet Charm - Your calendar is ready to be downloaded',
      html: '<h1>Email bol poslany</h1>',
    });
    res.sendFile(path.join(__dirname, 'views', 'thank-you.html'));
  }).catch(err => {
    console.log(err);
  });
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/thank-you', postAddEmail);

app.use('/index.html', (req, res) => {
  res.redirect('/');
});
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'views', '404.html'));
});

// Set up the MongoDB connection using Mongoose
/* mongoose.connect('mongodb+srv://skyedown:Oo5AXRNGoyDYqdm3@emmet-charm.rpk5pfn.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

bntOw8bEJkZxj1gQ
*/

// Start the server using a template string
mongoConnect(() => {
  app.listen(3000);
});
