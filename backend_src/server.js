const express = require('express');  // Import express to create the server
const simpleGit = require('simple-git');  // Import simple-git for Git operations
const path = require('path');  // Import path module to handle file paths
const fs = require('fs');  // Import file system module to interact with the file system
const { exec, spawn } = require('child_process');  // Import exec and spawn for running shell commands
const app = express();  // Initialize the Express app
const git = simpleGit();  // Initialize simple-git for Git operations
const cors = require('cors');
const cloneDirectory = path.join(__dirname, 'cloned_repos');  // Define the path where repositories will be cloned

// If the 'cloned_repos' directory doesn't exist, create it
if (!fs.existsSync(cloneDirectory)) {
  fs.mkdirSync(cloneDirectory);
}



app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend URL if it's different
  methods: ['GET', 'POST'],
}));


// Use body-parser middleware to parse JSON request body
app.use(express.json());

app.post('/clone-repo', async (req, res) => {
  const { repoUrl } = req.body;  // Get the repository URL from the request body
  
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });  // If no repo URL is provided, return an error
  }

  const repoName = repoUrl.split('/').pop();  // Get the repository name from the URL (e.g., "repoName" from "https://github.com/owner/repoName")
  const localRepoPath = path.join(cloneDirectory, repoName);  // Define the local path where the repo will be cloned

  try {
    console.log(`Cloning repository ${repoUrl}...`);
    await git.clone(repoUrl, localRepoPath);  // Clone the repository using simple-git

    // Change the directory to the cloned repo
    process.chdir(localRepoPath);

    console.log('Installing dependencies...');
    exec('npm install', (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: `Error installing dependencies: ${stderr || err}` });
      }

      console.log('Dependencies installed successfully');

      // Start the project (assuming it's a Node.js project with "npm run dev" or equivalent)
      const devProcess = spawn('npm', ['run', 'dev']);  // Use spawn to run the process in the background

      // Log output from the process (for debugging purposes)
      devProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      devProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      // Inform the client that the process is running
      devProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Project started successfully');
        } else {
          console.error(`Project failed to start with code ${code}`);
        }
      });

      // Respond back to the client immediately
      res.json({ message: 'Repository cloned, dependencies installed, and project started in the background!' });
    });
  } catch (error) {
    console.error('Error cloning repository:', error);
    res.status(500).json({ error: 'Error cloning repository' });
  }
});

const port = 5000;  // Define the port where the backend will run
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
