import { CreateBucketCommand, 
    PutObjectCommand, 
    CopyObjectCommand,
    ListObjectsCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteBucketCommand,
    S3Client,
    } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs'
import 'dotenv/config'


const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_ID,
    },
    region: 'us-east-1'

});

async function createBucket(bucketName){
  const createbucket = new CreateBucketCommand({
    Bucket: bucketName,
  });

  try {
    const { Location } = await client.send(createbucket);
    console.log(`Bucket created with location ${Location}`);
  } catch (err) {
    console.error(err);
  }
};

async function uploadFile(){
    const uploadfile = new PutObjectCommand({
        Bucket: 'arturo-first-bucket',
        Key: 'texts3.txt',
        Body: 'Thanks for be here'
    })

    try {
        const response = await client.send(uploadfile)
        console.log(response)
    } catch (err) {
        console.error(err)
    }
}

async function copyFile(){
    const copyfile = new CopyObjectCommand({
        CopySource: 'arturo-first-bucket/texts3.txt',
        Bucket: 'arturo-bucket',
        Key: 'testfromotherbucket.txt'
    })
    try{
        const response = await client.send(copyfile)
        console.log(response)
    } catch (err) {
        console.error(err)
    }
}

async function listBucketObjects(){
    const listbucketobjects = new ListObjectsCommand({
        Bucket: 'arturo-bucket'
    })
    try {
        const response = await client.send(listbucketobjects)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

async function getBucketObjects(){
    const getbucketobjects = new GetObjectCommand ({
        Bucket: 'arturo-bucket',
        Key: 'testfromotherbucket.txt',
    })
    try {
        const response = await client.send(getbucketobjects);
            
        // Save the object to a local file
        const fileStream = fs.createWriteStream('localfile-s3.txt');
        response.Body.pipe(fileStream);
    
        fileStream.on('close', () => {
            console.log('File downloaded and saved to local-file.txt');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function presignedURL(){
    const getObject = new GetObjectCommand({
        Bucket: 'arturo-bucket',
        Key: 'testfromotherbucket.txt',
    })

    try {
        const url = await getSignedUrl(client, getObject, {expiresIn: 100})    
        console.log(url)
    } catch (err) {
        console.log(err)
    }
}

async function deleteBucketObjects () {
    const deletebucketobjects =  new DeleteObjectsCommand({
        Bucket: 'arturo-bucket', 
        Delete: {
            Objects: [{Key: 'testfromotherbucket.txt'}]
        }
    })

    try {
        const response = await client.send(deletebucketobjects)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

async function deleteBucket() {
    const deletebucket = new DeleteBucketCommand ({
        Bucket: 'arturo-bucket'
    })

    const response = await client.send(deletebucket)
    console.log(response)
}

//OBS: Execute one by one


//createBucket('arturo-first-bucket')
//uploadFile()
//createBucket('arturo-bucket')
//copyFile()
//listBucketObjects()
//getBucketObjects()
//presignedURL()
//deleteBucketObjects()
//deleteBucket()