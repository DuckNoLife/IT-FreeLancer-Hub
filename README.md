🚀 Elite Freelance Hub

Elite Freelance Hub is a premium full-stack platform that connects top-tier IT freelancers with high-quality clients. Built with the MEVN Stack (MongoDB, Express.js, Vue 3, Node.js), it features a luxury dark-themed UI, secure payments via Stripe, real-time Google authentication, and transactional email notifications via Brevo.

🌐 Live Demo

The project is currently deployed on Render:

🖥️ Frontend (Static Site): https://elite-freelance-hub.onrender.com

⚙️ Backend (Web Service): https://elite-freelancer-hub.onrender.com

✨ Key Features

🔐 Advanced Authentication:

Secure Login/Register (JWT).

Google OAuth 2.0 Integration for one-click login.

Password Reset flow via Email (integrated with Brevo).

💼 Job Marketplace:

Clients: Post jobs, manage applications, and "Unlock" freelancer contact info.

Freelancers: Browse jobs, filter by skills, and submit proposals.

💳 Stripe Payments (Sandbox):

PRO Membership: Upgrade account for lifetime benefits (3 job posts limit, badges).

Premium Listings: Pay to boost a job post to the top of the search results.

🛡️ Reputation System:

Freelancers earn reputation points upon successful job completion.

📧 Notifications:

Transactional emails for account security and updates.

🛠️ Tech Stack

Component

Technology

Frontend

Vue 3, Vite, Bootstrap 5, FontAwesome

Backend

Node.js, Express.js

Database

MongoDB Atlas (Mongoose)

Authentication

JWT, Google Auth Library

Payments

Stripe API & Webhooks

Email Service

Brevo (formerly Sendinblue)

Deployment

Render (Static Site + Web Service)

Version Control

GitHub

⚙️ Local Installation & Setup

Follow these steps to run the project locally.

1. Clone the Repository

git clone [https://github.com/your-username/Elite-Freelancer-Hub.git](https://github.com/your-username/Elite-Freelancer-Hub.git)
cd Elite-Freelancer-Hub


2. Backend Configuration (Server)

Navigate to the server folder and install dependencies:

cd server
npm install


Create a .env file in the server/ root. Fill in the following variables:

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173  # URL of your frontend (Localhost or Render URL)

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/elitehub

# Security
JWT_SECRET=your_super_secret_jwt_key

# Google Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=no-reply@elitehub.com
FROM_NAME="Elite Support"

# Stripe Payments (Test Mode)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...


Run the backend:

npm run dev


3. Frontend Configuration (Client)

Navigate to the client folder and install dependencies:

cd ../client
npm install


Create a .env file in the client/ root. These variables are exposed to the browser via Vite:

# API Connection
VITE_API_URL=http://localhost:5000/api

# Google Auth (Must match the one in Backend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id


Run the frontend:

npm run dev


🚀 Deployment Guide (Render)

This project is fully optimized for Render.

Backend (Web Service)

Connect your GitHub repo to Render.

Select the server folder as the Root Directory.

Build Command: npm install

Start Command: node server.js

Environment Variables: Add all variables listed in the Backend .env section above.

Note: Set CLIENT_URL to your deployed Frontend URL (e.g., https://elite-freelance-hub.onrender.com).

Frontend (Static Site)

Connect the same repo.

Select the client folder as the Root Directory.

Build Command: npm install && npm run build

Publish Directory: dist

Environment Variables:

VITE_API_URL: Your deployed Backend URL + /api (e.g., https://elite-freelancer-hub.onrender.com/api).

VITE_GOOGLE_CLIENT_ID: Your Google Client ID.

🧪 Testing Payments (Stripe)

Since this project uses Stripe in Test Mode:

Use the generic test card numbers provided by Stripe (e.g., 4242 4242 4242 4242).

Webhooks: To ensure features like "PRO Upgrade" work automatically after payment, you must configure the Stripe Webhook URL in your Stripe Dashboard to point to your deployed backend (e.g., https://your-backend.onrender.com/webhook).

🤝 Contributing

Contributions, issues, and feature requests are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License

Distributed under the MIT License.
