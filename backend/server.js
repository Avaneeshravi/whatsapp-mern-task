const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ override: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    maxHttpBufferSize: 1e8
});

// ─────────────────────────────────────────────────────────────
// AI CONFIGURATION — tries Gemini first, falls back gracefully
// ─────────────────────────────────────────────────────────────
let aiModel = null;
let aiProvider = null;

console.log('🔑 GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);

async function initAI() {
    // ── Option 1: Google Gemini ──────────────────────────────
    if (process.env.GEMINI_API_KEY) {
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            // Updated model names for 2025
            const modelsToTry = [
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-1.5-flash',
                'gemini-1.5-pro',
            ];

            for (const modelName of modelsToTry) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            maxOutputTokens: 400,
                            temperature: 0.8,
                        }
                    });
                    // Quick test call to verify the model works
                    const test = await model.generateContent('Say "ok" in one word.');
                    const testText = test.response.text();
                    if (testText) {
                        aiModel = model;
                        aiProvider = 'gemini';
                        console.log(`✅ Gemini AI ready — model: ${modelName}`);
                        break;
                    }
                } catch (modelErr) {
                    console.warn(`⚠️  Model ${modelName} failed: ${modelErr.message}`);
                }
            }

            if (!aiModel) {
                console.error('❌ All Gemini models failed. Check your API key quota.');
            }
        } catch (err) {
            console.error('❌ Failed to init Gemini:', err.message);
        }
    } else {
        console.warn('⚠️  GEMINI_API_KEY is not set in environment variables!');
    }

    // ── Option 2: OpenAI (if OPENAI_API_KEY is set) ──────────
    if (!aiModel && process.env.OPENAI_API_KEY) {
        try {
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            aiModel = openai;
            aiProvider = 'openai';
            console.log('✅ OpenAI ready as fallback AI');
        } catch (err) {
            console.error('❌ Failed to init OpenAI:', err.message);
        }
    }

    if (!aiModel) {
        console.warn('⚠️  No AI provider configured — set GEMINI_API_KEY in your .env');
    }
}

initAI();

// ─────────────────────────────────────────────────────────────
// DATABASE
// ─────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// ─────────────────────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────────────────────
const User = mongoose.model('User', new mongoose.Schema({
    username:    { type: String, unique: true, required: true },
    password:    { type: String, required: true },
    mobile:      { type: String, required: true },
    email:       { type: String },
    displayName: { type: String },
    bio:         { type: String, default: 'Hey there! I am using WhatsApp.' },
    profilePic:  { type: String },
    isOnline:    { type: Boolean, default: false }
}));

const Message = mongoose.model('Message', new mongoose.Schema({
    sender:       { type: String, required: true },
    receiver:     { type: String, required: true },
    receiverType: { type: String, default: 'user' },
    text:         { type: String },
    file:         { type: String },
    fileType:     { type: String },
    fileName:     { type: String },
    isRead:       { type: Boolean, default: false },
    reaction:     { type: String },
    replyTo:      { type: Object },
    isEdited:     { type: Boolean, default: false },
    timestamp:    { type: Date, default: Date.now }
}));

const Group = mongoose.model('Group', new mongoose.Schema({
    name:      { type: String, required: true },
    icon:      { type: String, default: '' },
    members:   [{ type: String }],
    admin:     { type: String },
    createdAt: { type: Date, default: Date.now }
}));

const StatusUpdate = mongoose.model('StatusUpdate', new mongoose.Schema({
    username:  { type: String, required: true },
    type:      { type: String, enum: ['image', 'text'], required: true },
    content:   { type: String, required: true },
    bgColor:   { type: String },
    caption:   { type: String },
    viewers:   [{ type: String }],
    createdAt: { type: Date, default: Date.now, expires: 86400 }
}));

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────
app.get('/',       (req, res) => res.json({ status: 'ok', ai: !!aiModel, provider: aiProvider }));
app.get('/health', (req, res) => res.json({ status: 'ok', ai: !!aiModel, provider: aiProvider }));

// Status
app.post('/api/status', async (req, res) => {
    try {
        const { username, type, content, bgColor, caption } = req.body;
        const s = new StatusUpdate({ username, type, content, bgColor, caption });
        await s.save();
        res.json(s);
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
        res.json({ success: true, viewers: status?.viewers || [] });
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

// Auth
app.post('/api/auth', async (req, res) => {
    const { username, password, mobile, email } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, password, mobile: mobile || '0000000000', email });
            await user.save();
        } else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.status(200).json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Users
app.get('/api/users/:currentUser', async (req, res) => {
    try {
        const users = await User.find({}, 'username mobile isOnline displayName bio profilePic');
        const result = await Promise.all(users.map(async (u) => {
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
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:username/profile', async (req, res) => {
    const { displayName, bio, profilePic } = req.body;
    try {
        const fields = {};
        if (displayName !== undefined) fields.displayName = displayName;
        if (bio !== undefined) fields.bio = bio;
        if (profilePic !== undefined) fields.profilePic = profilePic;
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { $set: fields },
            { new: true }
        );
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Messages
app.get('/api/messages/:u1/:u2', async (req, res) => {
    try {
        const { u1, u2 } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: u1, receiver: u2 },
                { sender: u2, receiver: u1 },
                { receiver: u2, receiverType: 'group' }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { sender, receiver, receiverType, text, file, fileType, fileName, replyTo } = req.body;
        if ((!text && !file) || !sender || !receiver)
            return res.status(400).json({ error: 'Invalid request' });
        const msg = new Message({ sender, receiver, receiverType: receiverType || 'user', text, file, fileType, fileName, replyTo, isRead: false });
        const saved = await msg.save();
        if (receiverType === 'group') {
            const group = await Group.findById(receiver);
            if (group?.members) group.members.forEach(m => io.to(m).emit('receive_message', saved));
        } else {
            io.to(receiver).emit('receive_message', saved);
            if (sender !== receiver) io.to(sender).emit('receive_message', saved);
        }
        res.status(201).json(saved);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Groups
app.post('/api/groups', async (req, res) => {
    try {
        const { name, icon, members, admin } = req.body;
        const g = new Group({ name, icon, members, admin });
        await g.save();
        res.json(g);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/groups/:username', async (req, res) => {
    try {
        const groups = await Group.find({ members: req.params.username });
        const mapped = await Promise.all(groups.map(async g => {
            const groupId = g._id.toString();
            const unreadCount = await Message.countDocuments({
                receiver: groupId, receiverType: 'group',
                isRead: false, sender: { $ne: req.params.username }
            });
            const lastMessage = await Message.findOne({
                receiver: groupId, receiverType: 'group'
            }).sort({ timestamp: -1 });
            return {
                _id: g._id, username: groupId,
                displayName: g.name, profilePic: g.icon,
                isGroup: true, bio: `Group • ${g.members.length} members`,
                members: g.members, admin: g.admin, unreadCount, lastMessage
            };
        }));
        res.json(mapped);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/groups/:id/exit', async (req, res) => {
    try {
        const { username } = req.body;
        const g = await Group.findById(req.params.id);
        if (!g) return res.status(404).json({ error: 'Group not found' });
        g.members = g.members.filter(m => m !== username);
        await g.save();
        res.json(g);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/groups/:id/add', async (req, res) => {
    try {
        const { newMembers } = req.body;
        const g = await Group.findById(req.params.id);
        if (!g) return res.status(404).json({ error: 'Group not found' });
        g.members = [...new Set([...g.members, ...newMembers])];
        await g.save();
        res.json(g);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────
// META AI REPLY — robust, with retry logic
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Meta AI, a friendly WhatsApp assistant built by Meta. 
Keep responses short, warm and conversational — 1 to 3 sentences unless the user asks for more.
Never say you are Gemini, GPT, or made by Google or OpenAI.`;

async function generateAIResponse(userText) {
    if (!aiModel) throw new Error('NO_AI');

    if (aiProvider === 'gemini') {
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userText}\nMeta AI:`;
        const result = await aiModel.generateContent(prompt);
        const text = result.response.text().trim();
        if (!text) throw new Error('EMPTY_RESPONSE');
        return text;
    }

    if (aiProvider === 'openai') {
        const completion = await aiModel.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user',   content: userText }
            ],
            max_tokens: 400,
            temperature: 0.8
        });
        return completion.choices[0].message.content.trim();
    }

    throw new Error('NO_AI');
}

async function sendMetaAIReply(senderUsername, userText) {
    io.to(senderUsername).emit('display_typing', { sender: 'Meta AI', isTyping: true });

    try {
        console.log(`📨 Meta AI ← ${senderUsername}: "${userText}"`);

        let aiText;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                aiText = await generateAIResponse(userText);
                break;
            } catch (err) {
                if (attempt === 2) throw err;
                console.warn(`⚠️  Attempt ${attempt} failed: ${err.message} — retrying…`);
                await new Promise(r => setTimeout(r, 1500));
            }
        }

        console.log(`✅ Meta AI → ${senderUsername}: "${aiText.substring(0, 80)}"`);

        const reply = new Message({ sender: 'Meta AI', receiver: senderUsername, text: aiText, isRead: false });
        await reply.save();

        io.to(senderUsername).emit('display_typing', { sender: 'Meta AI', isTyping: false });
        io.to(senderUsername).emit('receive_message', reply);

    } catch (err) {
        console.error('❌ Meta AI Error:', err.message);
        io.to(senderUsername).emit('display_typing', { sender: 'Meta AI', isTyping: false });

        let errorText;
        if (err.message === 'NO_AI') {
            errorText = '⚠️ Meta AI is not configured. Please set GEMINI_API_KEY in the server environment variables.';
        } else if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
            errorText = '⚠️ I\'m getting too many requests. Please wait a moment and try again!';
        } else if (err.message?.includes('SAFETY')) {
            errorText = '⚠️ I can\'t respond to that due to safety guidelines.';
        } else if (err.message?.includes('API_KEY') || err.message?.includes('key')) {
            errorText = '⚠️ Invalid API key. Please check your GEMINI_API_KEY environment variable.';
        } else {
            errorText = `⚠️ Meta AI error: ${err.message}. Please check server logs.`;
        }

        const errReply = new Message({ sender: 'Meta AI', receiver: senderUsername, text: errorText, isRead: false });
        await errReply.save();
        io.to(senderUsername).emit('receive_message', errReply);
    }
}

// ─────────────────────────────────────────────────────────────
// SOCKET LOGIC
// ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    socket.on('user_login', async (username) => {
        socket.userId = username;
        socket.join(username);
        await User.findOneAndUpdate({ username }, { isOnline: true });
        io.emit('user_status_update', { username, isOnline: true });
        console.log(`👤 Login: ${username}`);
    });

    socket.on('typing_status', ({ sender, receiver, isTyping }) => {
        io.to(receiver).emit('display_typing', { sender, isTyping });
    });

    socket.on('mark_read', async ({ messageId, sender }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { isRead: true });
            io.to(sender).emit('message_read_confirmed', messageId);
        } catch (err) { console.error('Read Error:', err.message); }
    });

    socket.on('delete_message', async (messageId) => {
        try {
            await Message.findByIdAndDelete(messageId);
            io.emit('message_deleted', messageId);
        } catch (err) { console.error('Delete Error:', err.message); }
    });

    socket.on('react_message', async ({ messageId, reaction, receiver, sender }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { reaction });
            io.to(receiver).emit('message_reacted', { messageId, reaction });
            if (sender !== receiver) io.to(sender).emit('message_reacted', { messageId, reaction });
        } catch (err) { console.error('React Error:', err.message); }
    });

    socket.on('send_message', async (data) => {
        if ((!data.text && !data.file) || !data.sender || !data.receiver) return;
        try {
            const msg = new Message({ ...data, isRead: false });
            const saved = await msg.save();

            if (data.receiverType === 'group') {
                const group = await Group.findById(data.receiver);
                if (group?.members) group.members.forEach(m => io.to(m).emit('receive_message', saved));
            } else {
                io.to(data.receiver).emit('receive_message', saved);
                if (data.sender !== data.receiver) io.to(data.sender).emit('receive_message', saved);
            }

            if (data.receiver === 'Meta AI' && data.text) {
                sendMetaAIReply(data.sender, data.text);
            }
        } catch (err) {
            console.error('❌ send_message error:', err.message);
        }
    });

    socket.on('disconnect', async () => {
        if (socket.userId) {
            await User.findOneAndUpdate({ username: socket.userId }, { isOnline: false });
            io.emit('user_status_update', { username: socket.userId, isOnline: false });
            console.log(`👤 Disconnected: ${socket.userId}`);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
