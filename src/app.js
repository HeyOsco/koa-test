// Library Imports
const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router = require('@koa/router');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { createReadStream } = require('fs');

// Create Koa App
const app = new Koa();

// Enable Multipart Uploads 
app.use(
  koaBody({
    multipart: true
  })
);

// Create New Router
const router = new Router();

// Initialize the S3 client
const s3Client = new S3Client({ 
  region: "test-region", // TODO: UPDATE
});

// --- ROUTES --- ///

// Health Check Endpoint
router.get('/health', async (ctx) => {
  ctx.body = 'ディーズヌート';
});

// File Upload Endpoint
router.post('/upload', async (ctx) => {
  console.log(ctx.request.files)
  const file = ctx.request.files.file; // access the uploaded file from the form
  console.log(file)
  const { filepath, originalFilename } = file; // get file path and name
  console.log("path:" + filepath)
  console.log("name:" + originalFilename)

  // Set upload parameters for S3
  const uploadParams = {
    Bucket: "test-bucket", // TODO: UPDATE
    Key: originalFilename, 
    Body: createReadStream(filepath), // use createReadStream to read file data from the local path
  };

  try {
    // Upload file to S3
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("Upload success", data);

    ctx.body = { message: 'Upload success!', data: data };
  } catch (error) {
    console.log("Error", error);

    ctx.status = 500;
    ctx.body = { message: 'Error uploading file', error: error };
  }
});

// Setup Middleware
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
  console.log('Server ready!');
});