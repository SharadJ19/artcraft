# Art & Craft Supplies E-commerce

A full-stack e-commerce website for art and craft supplies built with the MERN stack.

## Features

- User Authentication (JWT)
- Product Management
- Shopping Cart
- Order Processing
- Admin Dashboard
- Image Upload
- Responsive Design

## Tech Stack

- Frontend:
  - React
  - React Router
  - Axios
  - Tailwind CSS
  - React Toastify

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Multer (File Upload)

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB Atlas Account
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add your configuration:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Create an `uploads` directory in the backend folder:
   ```bash
   mkdir uploads
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Register a new user account
2. Login with your credentials
3. Browse products and add them to cart
4. Proceed to checkout and place orders
5. Admin users can access the dashboard to manage products and orders

## Admin Account

To create an admin account, register normally and then manually update the user's role to "admin" in the MongoDB database.

## License

MIT

## Deployment Instructions for Render.com

### Prerequisites
- A [Render.com](https://render.com) account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for the database)
- Your project pushed to a GitHub repository

### Steps to Deploy

1. **Create a MongoDB Atlas Database**
   - Sign up or log in to MongoDB Atlas
   - Create a new cluster (the free tier works fine for starting)
   - Set up a database user with a secure password
   - Whitelist all IP addresses (0.0.0.0/0) for simplicity, or only Render.com's IPs for production
   - Get your MongoDB connection string

2. **Prepare Your Repository**
   - Make sure your project is pushed to GitHub
   - The current setup is already optimized for Render deployment

3. **Deploy on Render.com**
   - Log in to Render.com
   - Click "New" > "Web Service"
   - Select your GitHub repository
   - Configure the web service:
     - **Name**: Choose a name for your service
     - **Environment**: Node
     - **Root Directory**: Leave blank
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Plan Type**: Choose an appropriate plan (Free works for testing)
   
   - Add the following environment variables:
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `JWT_SECRET` = A random string for JWT token generation
     - `PORT` = `10000` (Render's default port is 10000)

4. **Wait for Deployment**
   - Render will automatically deploy your application
   - You'll get a URL for your application when deployment is complete

### Troubleshooting Tips

If you encounter issues with the deployment:

1. **Double `/api` prefix issue**: 
   - If you're seeing 404 errors with URLs like `/api/api/auth/login`, make sure your API configurations are correct.
   - The frontend should make requests to `/api/auth/login` endpoints
   - The API baseURL in production should be set to an empty string (not `/api`)

2. **Static file serving**:
   - Ensure the production path in `backend/server.js` correctly points to `../frontend/dist` for serving static files
   - Verify the NODE_ENV variable is set to 'production' on Render.com

3. **MongoDB Connection**:
   - Make sure your MongoDB connection string is properly URL encoded in the environment variables
   - Check that your IP whitelist in MongoDB Atlas includes Render.com's IP addresses

4. **Render Logs**:
   - Check the logs in the Render dashboard for specific error messages
   - You can enable automatic redeploys when you push changes to your GitHub repository

## Development

To run this application locally:

1. Install all dependencies:
   ```
   npm run install:all
   ```

2. Run the backend:
   ```
   npm run dev:backend
   ```

3. In a new terminal, run the frontend:
   ```
   npm run dev:frontend
   ```

4. Access the application at http://localhost:5173 