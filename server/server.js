 // server.js
 const express = require('express');
 const bodyParser = require('body-parser');
 const Pusher = require('pusher');
 const axios = require('axios');
 //beginning of the file
 const PORT = process.env.PORT || 5000;
 const app = express();
 const path = require('path');

 const buildPath = path.join(__dirname, '..', 'build');
 app.use(express.static(buildPath));

 app.use(bodyParser.json());

 app.post('/update-editor', (req, res) => {
     pusher.trigger('editor', 'code-update', {
         ...req.body,
     });

     res.status(200).send('OK');
 });

 require('dotenv').config({ path: '.env' });


 const pusher = new Pusher({
     appId: process.env.PUSHER_APP_ID,
     key: process.env.PUSHER_APP_KEY,
     secret: process.env.PUSHER_APP_SECRET,
     cluster: process.env.PUSHER_APP_CLUSTER,
     useTLS: true,
 });

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 app.listen(PORT, () => {
     console.log(`server started on port ${PORT}`);
 });