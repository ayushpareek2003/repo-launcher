const express = require('express'); 
const simpleGit = require('simple-git'); 
const path = require('path');  
const fs = require('fs'); 
const { exec, spawn } = require('child_process');  
const app = express(); 
const git = simpleGit(); 

const cloneDirectory = path.join(__dirname, 'cloned_repos'); 
import express from "express";
import { S3 } from "aws-sdk";



const s3 = new S3({
  accessKeyId: "7ea9c3f8c7f0f26f0d21c5ce99d1ad6a",
  secretAccessKey: "b4df203781dd711223ce931a2d7ca269cdbf81bb530de4548474584951b798be",
  endpoint: "https://e21220f4758c0870ba9c388712d42ef2.s3.aws.com"
})




const app = express();

app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);


app.use(express.json());

app.post('/clone-repo', async (req, res) => {
  const { repoUrl } = req.body;  // Get the repository URL from the request body
  
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' }); =
  }

  const repoName = repoUrl.split('/').pop();  
  const localRepoPath = path.join(cloneDirectory, repoName);  

  try {
    console.log(`Cloning repository ${repoUrl}...`);
    await git.clone(repoUrl, localRepoPath);  

    
    
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "cloud_project",
        Key: `dist/${id}${filePath}`
    }).promise();
    

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    res.send(contents.Body);
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "cloud_project",
        Key: fileName,
    }).promise();


    console.log('Installing dependencies...');
    exec('npm install', (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: `Error installing dependencies: ${stderr || err}` });
      }

      console.log('Dependencies installed successfully');

      
      const devProcess = spawn('npm', ['run', 'dev']);  

     
      devProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      devProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

     
      devProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Project started successfully');
        } else {
          console.error(`Project failed to start with code ${code}`);
        }
      });

      res.json({ message: 'Repository cloned, dependencies installed, and project started in the background!' });
    });
  } catch (error) {
    console.error('Error cloning repository:', error);
    res.status(500).json({ error: 'Error cloning repository' });
  }
});

const port = 5000;  
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
