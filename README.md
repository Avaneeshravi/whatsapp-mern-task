# WhatsApp Clone - Full Stack Project

A full-stack WhatsApp Web clone focused on real-time chat functionality, group communication, and dynamic status updates. Built with React.js frontend, Node.js + Express backend, MongoDB database, and Socket.IO for seamless real-time WebSocket capabilities.

## Technical Stack & Features
**Frontend:** React.js, React Router, Socket.IO Client, Axios, CSS Modules
**Backend:** Node.js, Express, Socket.IO, Google Gemini AI Integration
**Database:** MongoDB Atlas (Mongoose Object Modeling)

### Key Capabilities
- Real-time instant messaging using WebSockets with online/offline tracking.
- Group chat generation securely managing complex many-to-many communications.
- Split screen optimizations mapping directly to the official responsive mobile breakpoints.
- Meta AI integration to simulate interactive smart queries.
- End-to-end status story viewing systems including blur environments, progression tracking, and view aggregations.
- Sent/Received visual distinction complete with emoji reaction anchors mapped per message.

## Setup Instructions

### Environment Variables
You will need to configure environmental constants for the backend server logic:
1. Navigate to the `/backend` directory.
2. Create a `.env` file.
3. Supply the following keys:
```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/whatsapp-clone?retryWrites=true&w=majority

# Port for Backend Instance (Defaults to 5000)
PORT=5000

# Google Gemini Analytics Key (For Meta AI queries)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Starting the Database 
The application leverages MongoDB natively. You can either use a locally hosted MongoDB instance and swap `MONGO_URI` to `mongodb://localhost:27017/whatsapp-clone` or configure a free MongoDB Atlas instance. Setup your cluster on Atlas, add `0.0.0.0/0` to Network Access, and inject your URI. 

### Running Locally
To launch the projects concurrently on your local machine:

1. **Start the Backend Node Server**
```bash
cd backend
npm install
node server.js
```
*The API and Websocket server will deploy to `http://localhost:5000`*

2. **Start the Frontend React Interface**
```bash
cd frontend
npm install
npm start
```
*The UI will launch on `http://localhost:3000`*

## Usage
Simply sign up with a new username/password combo. Because it tracks users natively, create two separate browsers or use Incognito mode to simulate separate users talking to each other instantly.
