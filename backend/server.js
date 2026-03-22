const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Ensure you ran: npm install @google/generative-ai
require('dotenv').config();

const app = express();
// Increase the limit for JSON/URL-encoded data to handle Base64 images
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    maxHttpBufferSize: 1e8 // Increase socket buffer size for files (approx 100MB)
});

// --- AI CONFIGURATION ---
// Make sure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are a helpful AI assistant. Keep your responses extremely short, direct, and natural. Do not mention that you are a clone or who built you unless explicitly asked. Avoid marketing language. Just answer the user's question simply."
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ Connection Error:", err));

// --- MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    displayName: { type: String },
    bio: { type: String, default: 'Hey there! I am using WhatsApp.' },
    profilePic: { type: String },
    isOnline: { type: Boolean, default: false }
}));

const Message = mongoose.model('Message', new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    receiverType: { type: String, default: 'user' },
    text: { type: String },
    file: { type: String },
    fileType: { type: String },
    fileName: { type: String },
    isRead: { type: Boolean, default: false },
    reaction: { type: String },
    replyTo: { type: Object },
    isEdited: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
}));

const Group = mongoose.model('Group', new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: '' },
    members: [{ type: String }],
    admin: { type: String },
    createdAt: { type: Date, default: Date.now }
}));

const StatusUpdate = mongoose.model('StatusUpdate', new mongoose.Schema({
    username: { type: String, required: true },
    type: { type: String, enum: ['image', 'text'], required: true },
    content: { type: String, required: true },
    bgColor: { type: String },
    caption: { type: String },
    viewers: [{ type: String }],
    createdAt: { type: Date, default: Date.now, expires: 86400 }
}));

// --- ROUTES ---
app.post('/api/status', async (req, res) => {
    try {
        const { username, type, content, bgColor, caption } = req.body;
        const newStatus = new StatusUpdate({ username, type, content, bgColor, caption });
        await newStatus.save();
        res.json(newStatus);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/status/view', async (req, res) => {
    try {
        const { statusId, viewerUsername } = req.body;
        const status = await StatusUpdate.findById(statusId);
        if (status && status.username !== viewerUsername) {
            if (!status.viewers) status.viewers = [];
            if (!status.viewers.includes(viewerUsername)) {
                status.viewers.push(viewerUsername);
                await status.save();
            }
        }
        res.json({ success: true, viewers: status.viewers });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/status', async (req, res) => {
    try {
        const statuses = await StatusUpdate.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: 1 });
        res.json(statuses);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/auth', async (req, res) => {
    const { username, password, mobile, email } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, password, mobile, email });
            await user.save();
        } else if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        res.status(200).json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/:currentUser', async (req, res) => {
    try {
        const users = await User.find({}, 'username mobile isOnline displayName bio profilePic');
        const usersWithNotifications = await Promise.all(users.map(async (u) => {
            const unreadCount = await Message.countDocuments({
                sender: u.username, receiver: req.params.currentUser, isRead: false
            });
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: u.username, receiver: req.params.currentUser },
                    { sender: req.params.currentUser, receiver: u.username }
                ]
            }).sort({ timestamp: -1 });
            return { ...u._doc, unreadCount, lastMessage };
        }));
        res.json(usersWithNotifications);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:username/profile', async (req, res) => {
    const { displayName, bio, profilePic } = req.body;
    try {
        const updateFields = {};
        if (displayName !== undefined) updateFields.displayName = displayName;
        if (bio !== undefined) updateFields.bio = bio;
        if (profilePic !== undefined) updateFields.profilePic = profilePic;

        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { $set: updateFields },
            { new: true }
        );
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:u1/:u2', async (req, res) => {
    try {
        const u1 = req.params.u1;
        const u2 = req.params.u2;
        const messages = await Message.find({
            $or: [
                { sender: u1, receiver: u2 },
                { sender: u2, receiver: u1 },
                { receiver: u2, receiverType: 'group' }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { sender, receiver, receiverType, text, file, fileType, fileName, replyTo } = req.body;
        // Handle invalid request: Empty message check
        if ((!text && !file) || !sender || !receiver) {
            return res.status(400).json({ error: 'Invalid request: Sender, receiver, and content are required' });
        }
        
        const newMessage = new Message({
            sender, receiver, receiverType: receiverType || 'user', text, file, fileType, fileName, replyTo, isRead: false
        });
        const savedMessage = await newMessage.save();
        
        // Optionally emit via sockets for real-time sync if connected
        if (receiverType === 'group') {
            const group = await Group.findById(receiver);
            if (group && group.members) {
                group.members.forEach(member => io.to(member).emit('receive_message', savedMessage));
            }
        } else {
            io.to(receiver).emit('receive_message', savedMessage);
            if (sender !== receiver) io.to(sender).emit('receive_message', savedMessage);
        }
        
        res.status(201).json(savedMessage);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Group Routes
app.post('/api/groups', async (req, res) => {
    try {
        const { name, icon, members, admin } = req.body;
        const newGroup = new Group({ name, icon, members, admin });
        await newGroup.save();
        res.json(newGroup);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/groups/:username', async (req, res) => {
    try {
        const groups = await Group.find({ members: req.params.username });
        // Map groups to appear like users for the frontend abstraction
        const mappedGroups = await Promise.all(groups.map(async g => {
            const groupId = g._id.toString();
            const unreadCount = await Message.countDocuments({
                receiver: groupId,
                receiverType: 'group',
                isRead: false,
                sender: { $ne: req.params.username }
            });
            const lastMessage = await Message.findOne({
                receiver: groupId,
                receiverType: 'group'
            }).sort({ timestamp: -1 });

            return {
                _id: g._id,
                username: groupId,
                displayName: g.name,
                profilePic: g.icon,
                isGroup: true,
                bio: `Group • ${g.members.length} members`,
                members: g.members,
                admin: g.admin,
                unreadCount,
                lastMessage
            };
        }));
        res.json(mappedGroups);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/groups/:id/exit', async (req, res) => {
    try {
        const { username } = req.body;
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        
        group.members = group.members.filter(m => m !== username);
        await group.save();
        res.json(group);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/groups/:id/add', async (req, res) => {
    try {
        const { newMembers } = req.body; // array of usernames
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        
        const uniqueMembers = [...new Set([...group.members, ...newMembers])];
        group.members = uniqueMembers;
        await group.save();
        res.json(group);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SOCKET LOGIC ---
io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    socket.on('user_login', async (username) => {
        socket.userId = username;
        socket.join(username);
        await User.findOneAndUpdate({ username }, { isOnline: true });
        io.emit('user_status_update', { username, isOnline: true });
    });

    // 1. TYPING NOTIFICATION
    socket.on('typing_status', ({ sender, receiver, isTyping }) => {
        io.to(receiver).emit('display_typing', { sender, isTyping });
    });

    // 2. BLUE TICK LOGIC
    socket.on('mark_read', async ({ messageId, sender }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { isRead: true });
            io.to(sender).emit('message_read_confirmed', messageId);
        } catch (err) { console.error("Read Error:", err); }
    });

    // 3. DELETE MESSAGE
    socket.on('delete_message', async (messageId) => {
        try {
            await Message.findByIdAndDelete(messageId);
            io.emit('message_deleted', messageId);
        } catch (err) { console.error("Delete Error:", err); }
    });

    // 3.5 REACT MESSAGE
    socket.on('react_message', async ({ messageId, reaction, receiver, sender }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { reaction });
            io.to(receiver).emit('message_reacted', { messageId, reaction });
            if (sender !== receiver) io.to(sender).emit('message_reacted', { messageId, reaction });
        } catch (err) { console.error("React Error:", err); }
    });

    // 4. SEND MESSAGE
    socket.on('send_message', async (data) => {
        if ((!data.text && !data.file) || !data.sender || !data.receiver) return;

        const newMessage = new Message({ ...data, isRead: false });
        const savedMessage = await newMessage.save();

        if (data.receiverType === 'group') {
            const group = await Group.findById(data.receiver);
            if (group && group.members) {
                group.members.forEach(member => {
                    io.to(member).emit('receive_message', savedMessage);
                });
            }
        } else {
            io.to(data.receiver).emit('receive_message', savedMessage);
            if (data.sender !== data.receiver) {
                io.to(data.sender).emit('receive_message', savedMessage);
            }
        }

        // --- UPDATED ADVANCED AI LOGIC ---
        if (data.receiver === "Meta AI" && data.text) {
            try {
                // Trigger typing indicator for AI
                io.to(data.sender).emit('display_typing', { sender: "Meta AI", isTyping: true });

                // Call Gemini 2.5 Flash
                const result = await aiModel.generateContent(data.text);
                const aiText = result.response.text();

                const aiReply = new Message({
                    sender: "Meta AI",
                    receiver: data.sender,
                    text: aiText,
                    isRead: false
                });
                await aiReply.save();

                // End typing and send the real AI reply
                io.to(data.sender).emit('display_typing', { sender: "Meta AI", isTyping: false });
                io.to(data.sender).emit('receive_message', aiReply);

            } catch (error) {
                console.error("❌ Gemini API Error:", error);
                io.to(data.sender).emit('display_typing', { sender: "Meta AI", isTyping: false });

                const errorReply = new Message({
                    sender: "Meta AI",
                    receiver: data.sender,
                    text: "I'm having a minor update in my brain. Try asking me again!",
                    isRead: false
                });
                io.to(data.sender).emit('receive_message', errorReply);
            }
        }
    });

    socket.on('disconnect', async () => {
        if (socket.userId) {
            await User.findOneAndUpdate({ username: socket.userId }, { isOnline: false });
            io.emit('user_status_update', { username: socket.userId, isOnline: false });
        }
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
