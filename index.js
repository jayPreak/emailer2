// Import express into our project
const express = require("express");

// Import multer
const multer = require("multer");

// Creating an instance of express function
const app = express();

// The port we want our project to run on
const PORT = 3000;

// Express should add our path -middleware
app.use(express.static("public"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Multer file storage
const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./attachments");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// Middleware to get attachments
const attachmentUpload = multer({
  storage: Storage,
}).single("attachment");

// Root directory -homepage
app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

// Route to handle sending mails
app.post("/send_email", (req, res) => {
  attachmentUpload(req, res, function (error) {
    if (error) {
      console.log(err);
      return res.send("Error uploading file");
    } else {
      const recipient = req.body.email;
      const subject = req.body.subject;
      const message = req.body.message;
      const attachmentPath = req.file.path;
      console.log("recipient", recipient);
      console.log("subject", subject);
      console.log("message", message);
      console.log("attachmentPath", attachmentPath);
      
      
      // After the last console.log(attachmentPath) in the else statement
      
      // Connecting to gmail service
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "your gmail address",
          pass: "your gmail password",
          clientId: "your gmail client id",
          clientSecret: "your gmail client secret token",
          refreshToken: "gmail refresh token",
        },
      });
      
      // e-mail option
      let mailOptions = {
        from: "your gmail address",
        to: "your recipient email address",
        subject: "e-mail subject",
        text: "e-mail body",
      };
      
      // Method to send e-mail out
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("Email sent successfully");
        }
      });
      
    }
  });
});

// Express allows us to listen to the port and trigger a console.log() when you visit the port
app.listen(PORT, () => {
  console.log(`Server is currently 🏃‍♂️ on port ${PORT}`);
});