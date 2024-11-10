<h1>UHSPACE Data Hub by HEX at UHM - Next.js with Firebase Hosting and AWS EC2</h1>

<h2>Overview</h2>
<p>This project is a Next.js web application called <strong>UHSPACE Data Hub</strong>, which stands for "Unlocking Hawaii's Solutions for Personalized Analytics and Collaborative Engagement". This README will guide you through the development, build, and deployment process.</p>
<p><strong>Final Deployed Website:</strong> https://uhspace.org</p>
<p><strong>Temporary Administrator Access for Judging</strong> (Available Only on 11/11/2024):</p> 
<ul>
  <li>Go to the footer of the homepage, on the bottom right, and click on the 'Admin Portal' logo.
  <li><strong>Email:</strong> defaultadmin@hacc2024.com</li> 
  <li><strong>Password:</strong> HACC2024</li> 
</ul> 
<p><strong>Important Notice:</strong> This login is exclusively for judges to review the project on 11/11/2024. Access will be removed promptly on 11/12/2024 to ensure the security and integrity of our systems. Please be assured that this temporary login does not compromise any sensitive data or system functionality. Thank you for your understanding and cooperation during the evaluation period.</p>

<hr />

<h2>Table of Contents</h2>
<ol>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#development">Development</a></li>
  <li><a href="#building-the-project">Building the Project</a></li>
  <li><a href="#exporting-static-files">Exporting Static Files</a></li>
  <li><a href="#deploying-to-firebase-hosting">Deploying to Firebase Hosting</a></li>
</ol>

<hr />

<h2 id="prerequisites">Prerequisites</h2>
<p>Make sure you have the following installed on your system:</p>
<ul>
  <li><a href="https://nodejs.org/en/">Node.js</a> (v16.x or later)</li>
  <li><a href="https://firebase.google.com/docs/cli">Firebase CLI</a></li>
  <li>A Firebase project (You can create one at the <a href="https://console.firebase.google.com/">Firebase Console</a>)</li>
</ul>

<hr />

<h2 id="installation">1. Installation</h2>
<p>To set up the project, follow these steps:</p>

<h3>Clone the repository</h3>
<pre>
<code>
git clone https://github.com/HACC2024/HEX.git
cd HEX
</code>
</pre>

<h3>Install Dependencies</h3>
<p>Run the following command to install the required dependencies:</p>

<pre><code>npm install</code></pre>

<p>This will install all dependencies listed in <code>package.json</code>.</p>

<hr />

<h2 id="development">2. Development</h2>
<p>To run the project in development mode:</p>

<pre><code>npm run dev</code></pre>

<ul>
  <li>The app will start on <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</li>
  <li>Any changes you make in the code will automatically trigger hot-reloading.</li>
</ul>

<hr />

<h2 id="building-the-project">3. Building the Project</h2>
<p>To create a production build, run:</p>

<pre><code>npm run build</code></pre>

<p>This command will generate an optimized production build of your Next.js app.</p>

<hr />

<h2 id="exporting-static-files">4. Exporting Static Files</h2>
<p>Next.js provides a feature to export your project as static files. This is crucial for deploying the app to Firebase Hosting. With the recent updates in Next.js, you do not need to run <code>npm run export</code>. Instead, the build process itself (using <code>npm run build</code>) automatically prepares your application for static export based on your configuration in <code>next.config.mjs</code>.</p>

<p>This will export your static site to the <code>out</code> directory.</p>

<hr />

<h2 id="deploying-to-firebase-hosting">5. Deploying to Firebase Hosting</h2>
<p>Follow these steps to deploy the project on Firebase Hosting:</p>

<h3>5.1. Initialize Firebase Hosting</h3>
<p>If you haven't initialized Firebase Hosting for this project yet, run the following command:</p>

<pre><code>firebase init hosting</code></pre>

<p>During this step:</p>
<ul>
  <li>Select your Firebase project.</li>
  <li>Set <code>out</code> as the public directory (the directory where static files are generated).</li>
  <li>Choose <strong>No</strong> for "Single-page app" configuration.</li>
</ul>

<h3>5.2. Deploy the Project</h3>
<p>Once your static files are generated in the <code>out</code> directory and Firebase is initialized, deploy the project with:</p>

<pre><code>firebase deploy</code></pre>

<p>Firebase will deploy your application, and you will receive a URL where you can view the live project.</p>

<hr />

<h2>Additional Notes</h2>
<ul>
  <li><strong>Firebase SDK</strong>: If you are using Firebase services (e.g., Authentication, Firestore), make sure to install and configure the Firebase SDK.</li>
  <li><strong>Environment Variables</strong>: Ensure you are using <code>.env</code> files to manage sensitive information such as API keys, Firebase credentials, etc.</li>
</ul>

<pre><code>
Example .env file:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
</code></pre>

<p><strong>GitHub Workflow</strong>: You can also set up automatic deployments to Firebase Hosting using GitHub Actions.</p>

<hr />

<h2>License</h2>
<p>This project is licensed under the <a href="./LICENSE">MIT License</a>.</p>

<hr />

<h2>Contact</h2>
<p>For any questions or issues, feel free to contact our team at <a href="mailto:your-email@example.com">uhspacehub@gmail.com</a>.</p>

<hr />

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

<h2>Flask-Backend API</h2>

<p>Backend Prod: https://uhspace.org</p>
<p>Backend Dev: http://127.0.0.1:5000</p>

<p><strong>Note:</strong> If the Chatbot is giving CORS issues, visit:</p>
<ul>
    <li><a href="http://api.uhspace.org" target="_blank">http://api.uhspace.org</a></li>
    <li><a href="http://hex-chatbots-2141489768.us-east-2.elb.amazonaws.com/" target="_blank">http://hex-chatbots-2141489768.us-east-2.elb.amazonaws.com/</a></li>
</ul>
<p>The pages should display: <em>"Welcome to the Flask Chatbot API!"</em></p>

<p><strong>1) If not, check if the EC2 Instance is active:</strong></p>
<ul>
    <li>Log in to the AWS Console and connect to the instance through the console or via SSH.</li>
    <li>Run <code>curl http://18.224.7.0:5000</code>, replacing <code>18.224.7.0</code> with the instance’s public IP. It should return the Flask Chatbot API welcome message.</li>
</ul>

<p><strong>2) If the pages above do not render correctly, set up a new Load Balancer on the EC2 instance:</strong></p>
<ul>
    <li>Set up listeners on <strong>HTTP Port 80</strong> and <strong>HTTPS Port 443</strong>.</li>
    <li>Create a Target Group for <strong>Port 5000</strong>.</li>
    <li>Assign the SSL/TLS Certificate for <strong>uhspace.org</strong>.</li>
    <li>Edit the Nginx configuration with <code>sudo vim /etc/nginx/conf.d/uhspace.conf</code>.</li>
    <li>Update the <code>location /api</code> block with <code>proxy_pass http://new-load-balancer-DNS-name</code>.</li>
    <li>Test the configuration with <code>sudo nginx -t</code>.</li>
    <li>If there are no errors, restart Nginx with <code>sudo systemctl restart nginx</code>.</li>
    <li>Check the status of Nginx with <code>sudo systemctl status nginx</code>. It should display an active status.</li>
</ul>


