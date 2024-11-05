# Project Submission Form Open-Ended Questions

## What Inspired Us
Our team, HEX, was inspired by the growing demand for accessible open data solutions that empower students and researchers at UH Manoa to make data-driven decisions. We wanted to create a platform that simplifies complex data processing and enables users of all technical backgrounds to gain actionable insights, fostering a more data-centric culture on campus.

## What Our Solution Does
**UHSPACE Data Hub** is a web-based platform designed to enable users to upload, analyze, and visualize CSV data effortlessly. It offers automated data analysis, interactive data filtering, and exportable visualizations, all backed by two AI chatbot assistants. These assistants help users navigate the platform and provide data insights, with each response limited to the dataset selected by the user for precise and relevant feedback.

## Explore Your Data With Ease
To enhance the user experience in data gathering, we implemented a user interface that simplifies navigation and allows users to bookmark datasets for easy access later. This feature enables users to explore their data with ease, ensuring they can return to important datasets without hassle.

## How It Was Built
We developed UHSPACE Data Hub using **Next.js** for the frontend, with **Firebase Hosting** for deployment. Key Firebase services—**Authentication**, **Storage**, and **Realtime Database**—enable secure data handling and user management. The backend API, hosted on **AWS EC2**, is managed with **Nginx** and protected by **SSL/TLS** encryption via an **Elastic Load Balancer**. **Recaptcha v2** further secures sensitive forms against bot activity.

For a seamless and responsive UI/UX, we implemented a **light mode and dark mode** with smooth transitions across all pages. User preferences are stored in local storage, ensuring design consistency across sessions and providing an intuitive experience for all users.

## Challenges We Ran Into
Our team faced challenges with secure API request handling and managing CORS policies without compromising user experience. Configuring the AWS EC2 instance and Load Balancer for secure, high-performance operations required extensive testing and adjustments. Ensuring smooth transitions between light and dark modes while maintaining design coherence across pages was another challenge we overcame through careful UI optimization.

## What We Learned
Through this project, we gained experience in combining Firebase with Next.js to build secure, scalable web applications. We also deepened our understanding of AWS infrastructure management and security. Developing user-centric features like automated analysis, chatbot assistants, and UI/UX transitions taught us valuable lessons in user experience design.

## Tools and Resources Used
- **Frameworks & Libraries:** Next.js, Firebase SDK
- **Cloud Services:** Firebase Hosting, AWS EC2, AWS Certificate Manager
- **Security:** Recaptcha v2, SSL/TLS, Nginx, Firebase Security Rules
- **Additional Tools:** GitHub Actions for CodeQL Advanced Security Check, Docker for containerization

## Use of Generative AI
**Did you use Generative AI?** Yes  
We leveraged Generative AI to refine design elements and troubleshoot technical implementations. ChatGPT offered insights on integrating Firebase with Next.js and AWS, helping us address CORS issues, form validation, and improve chatbot interactions.

## Security Considerations for UHSPACE Data Hub
UHSPACE Data Hub implements a multi-layered security approach to protect user data and platform integrity:

- **Data Security:** Sensitive Firebase configurations are stored in environment variables, securing credentials. Firebase security rules enforce access control based on user authentication.
  
- **Backend Security:** The backend API, hosted on AWS EC2, is safeguarded by Nginx configured with HTTPS. SSL termination is managed by an Elastic Load Balancer, and Recaptcha v2 protects form submissions from bot interference.
  
- **User Authentication & Privacy:** Firebase Authentication restricts data access, ensuring only authenticated users can interact with protected resources.
  
- **File Handling and Validation:** Before files are uploaded, users must create an account, after which Recaptcha v2 is employed to prevent spamming bots. Nginx configurations also limit file sizes, preventing excessively large files from consuming our AI model tokens and protecting platform resources.
  
- **Double-Layered Retrieval-Augmented Generation (RAG) Process:** UHSPACE Data Hub’s chatbot system operates through a double-layered RAG model to provide focused and secure responses. After users select a file from a dropdown, responses are limited to data within that file, ensuring targeted insights. A backend AI agent further refines responses by adding contextual enhancements, ensuring both relevance and data security.
  
- **UI/UX Customization with Light and Dark Modes:** To enhance user experience, we developed both light and dark modes, stored in local storage to maintain consistency across pages. Smooth transitions provide a fluid and cohesive UI/UX experience, giving users control over their preferred viewing mode.

These combined security protocols provide strong data privacy, secure access control, and consistent design for a reliable and engaging user experience on UHSPACE Data Hub.
