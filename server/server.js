// construct an express server
const express = require("express");
const upload = require("express-fileupload");
const app = express();
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const Vision = require("@google-cloud/vision");
const vision = new Vision.ImageAnnotatorClient();
const { Translate } = require("@google-cloud/translate").v2;
var helmet = require("helmet");
var compression = require("compression");
const fs = require("fs");
const os = require("os");
const cors = require('cors')

const storage = new Storage({
  projectId: "<YOUR PROJECT ID>",
  keyFilename: path.join(__dirname, "<PATH TO YOUR GCP PROJECT KEYFILE>"),
});

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(helmet());
app.use(compression()); //Compress all routes
app.use(cors());
app.use(upload());
// app.use(express.static("uploads"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/api', (req, res) => {
  console.log('api invoked, nodemon is updating');
  res.json({
    msg: 'Welcome to the API'
  })
})


app.post('/api', (req, res) => {
  if (req.files) {

    //validate file type and size
    const file = req.files.File;
    const fileType = file.mimetype;
    const fileSize = file.size;

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      return res.status(400).json({
        msg: "Invalid file type. Only jpg and png are allowed",
      });
    }
    if (fileSize > 10000000) {
      return res.status(400).json({
        msg: "File size too large. Max size is 10MB",
      });
    }


    
    const filename = file.name;
    const inputLang = req.body.inlanguages;
    const outputLang = req.body.outlanguages;
    const bucketName = "<YOUR BUCKET NAME>";
    const fileName = filename;
    const destFileName = fileName;
    const translate = new Translate();
    const target = `${outputLang}`;
    const tmpDir = os.tmpdir();

    // move uploaded file to uploads folder
    function writeFile() {
      const filePath = path.join(tmpDir, `${fileName}`);
      fs.writeFileSync(filePath, file.data);
      console.log("file written");
    }

    // upload to GCP
    async function uploadFile() {
      // const filePath = path.join(__dirname, `/uploads/${fileName}`);
      const tempDir = os.tmpdir();
      console.log("temp der is  " + tempDir);
      fs.readdir(tmpDir, (err, files) => {
        if (err) throw err;
        console.log("tag " + files[0]);
      });
      const filePath = path.join(tmpDir, `/${fileName}`);

      console.log("upload file invoked");

      try {
        await storage.bucket(bucketName).upload(filePath, {
          destination: destFileName,
        });

        console.log(`${filePath} uploaded to ${bucketName}`);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    // detect text from image using Google Vision API

    async function detectText(fileName) {
      console.log("detect text invoked");

      const request = {
        requests: [
          {
            image: {
              source: {
                imageUri: `gs://<YOUR BUCKET NAME>/${fileName}`,
              },
            },
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION",
              },
            ],
            imageContext: {
              languageHints: [`${inputLang}`],
            },
          },
        ],
      };

      const [result] = await vision.batchAnnotateImages(request);
      const detections = result.responses[0].fullTextAnnotation;
      return detections.text;
    }

    // translate text from image using Google Translate API
    async function translateText(text) {
      console.log("translate text invoked");

      let [translations] = await translate.translate(text, target);
      translations = Array.isArray(translations)
        ? translations
        : [translations];

      return translations[0];
    }

    async function callThemAll() {
      const wFile = writeFile();
      const uFile = await uploadFile();
      const dText = await detectText(fileName);
      const tText = await translateText(dText);
      res.json({
        detections: dText,
        translations: tText,
      })
    }

    callThemAll();
  } else {
    res.send("No file selected");
  }
  
  
})

app.post("/", (req, res) => {
  if (req.files) {

    const file = req.files.file;
    const fileType = file.mimetype;
    const fileSize = file.size;

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      return res.status(400).json({
        msg: "Invalid file type. Only jpg and png are allowed",
      });
    }
    if (fileSize > 10000000) {
      return res.status(400).json({
        msg: "File size too large. Max size is 10MB",
      });
    }
    console.log(req.files.file);
    // const file = req.files.file;
    const filename = file.name;
    const inputLang = req.body.inlanguages;
    const outputLang = req.body.outlanguages;
    console.log(filename);
    const bucketName = "<YOUR BUCKET NAME>";
    const fileName = filename;
    const destFileName = fileName;
    const translate = new Translate();
    const target = `${outputLang}`;
    const tmpDir = os.tmpdir();

    // move uploaded file to uploads folder
    function writeFile() {
      const filePath = path.join(tmpDir, `${fileName}`);
      fs.writeFileSync(filePath, file.data);
      console.log("file written");
    }

    // upload to GCP
    async function uploadFile() {
      // const filePath = path.join(__dirname, `/uploads/${fileName}`);
      const tempDir = os.tmpdir();
      console.log("temp der is  " + tempDir);
      fs.readdir(tmpDir, (err, files) => {
        if (err) throw err;
        console.log("tag " + files[0]);
      });
      const filePath = path.join(tmpDir, `/${fileName}`);

      console.log("upload file invoked");

      try {
        await storage.bucket(bucketName).upload(filePath, {
          destination: destFileName,
        });

        console.log(`${filePath} uploaded to ${bucketName}`);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    // detect text from image using Google Vision API

    async function detectText(fileName) {
      console.log("detect text invoked");

      const request = {
        requests: [
          {
            image: {
              source: {
                imageUri: `gs://<YOUR BUCKET NAME>/${fileName}`,
              },
            },
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION",
              },
            ],
            imageContext: {
              languageHints: [`${inputLang}`],
            },
          },
        ],
      };

      const [result] = await vision.batchAnnotateImages(request);
      const detections = result.responses[0].fullTextAnnotation;
      return detections.text;
    }

    // translate text from image using Google Translate API
    async function translateText(text) {
      console.log("translate text invoked");

      let [translations] = await translate.translate(text, target);
      translations = Array.isArray(translations)
        ? translations
        : [translations];

      return translations[0];
    }

    async function callThemAll() {
      const wFile = writeFile();
      const uFile = await uploadFile();
      const dText = await detectText(fileName);
      const tText = await translateText(dText);
      res.render("result", { text: tText, detections: dText });
    }

    callThemAll();
  } else {
    res.send("No file selected");
  }
});

// listen to port 3000
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
