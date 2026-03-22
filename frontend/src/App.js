import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_URL);
const professionalColors = ["E3F2FD", "F1F8E9", "FFF3E0", "F3E5F5", "E8F5E9", "E0F2F1", "EFEBE9"];

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [editProfileField, setEditProfileField] = useState(null);
  const [editProfileValue, setEditProfileValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOppositeUserTyping, setIsOppositeUserTyping] = useState(false);
  const [activeNav, setActiveNav] = useState('chats');
  const [statuses, setStatuses] = useState([]);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatStep, setNewChatStep] = useState('list');
  const [createGroupMembers, setCreateGroupMembers] = useState([]);
  const [createGroupName, setCreateGroupName] = useState('');
  const [createGroupIcon, setCreateGroupIcon] = '';

  /* ── NEW UI STATE ──────────────────────────────────────── */
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [composingStatus, setComposingStatus] = useState(null);
  const [viewingStatuses, setViewingStatuses] = useState(null);
  const [statusProgress, setStatusProgress] = useState(0);
  const statusProgressRef = useRef(null);
  const [showViewersModal, setShowViewersModal] = useState(false);

  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [activeChatMenu, setActiveChatMenu] = useState(null);
  const [reactingMsg, setReactingMsg] = useState(null);
  const [forwardingMsg, setForwardingMsg] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('whatsapp_favs')) || []; }
    catch { return []; }
  });
  const [starredMsgs, setStarredMsgs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('whatsapp_starred')) || []; }
    catch { return []; }
  });

  /* Sidebar Action States */
  const [archivedUsers, setArchivedUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_arch')) || []; } catch { return []; } });
  const [mutedUsers, setMutedUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_mute')) || []; } catch { return []; } });
  const [pinnedUsers, setPinnedUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_pin')) || []; } catch { return []; } });
  const [customUnreadUsers, setCustomUnreadUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_unread')) || []; } catch { return []; } });
  const [blockedUsers, setBlockedUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_block')) || []; } catch { return []; } });
  const [deletedChats, setDeletedChats] = useState(() => { try { return JSON.parse(localStorage.getItem('wa_delchat')) || []; } catch { return []; } });
  const [pinnedMsg, setPinnedMsg] = useState(null);

  // Real-time typing indicators
  const [typingUsers, setTypingUsers] = useState({});

  const toggleArrayState = (username, stateVal, setter, key) => {
    setter(prev => {
      const arr = prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username];
      localStorage.setItem(key, JSON.stringify(arr));
      return arr;
    });
  };

  const toggleFavorite = (username) => {
    setFavorites(prev => {
      const newFavs = prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username];
      localStorage.setItem('whatsapp_favs', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const toggleStar = (msgId) => {
    setStarredMsgs(prev => {
      const newStarred = prev.includes(msgId) ? prev.filter(k => k !== msgId) : [...prev, msgId];
      localStorage.setItem('whatsapp_starred', JSON.stringify(newStarred));
      return newStarred;
    });
  };

  const askMetaAI = (text) => {
    if (!text) return;
    socket.emit('send_message', {
      sender: user,
      receiver: 'Meta AI',
      text: `Context: "${text}"\nWhat do you think about this?`,
    });
    setSelectedUser('Meta AI');
  };

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const profilePicInputRef = useRef(null);

  /* Swipe state stored in refs (avoids re-render on every px) */
  const touchStartX = useRef({});
  const mouseStartX = useRef({});
  const isDragging = useRef({});
  const bubbleRefs = useRef({});

  /* ── HELPERS ───────────────────────────────────────────── */
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image too large! Max 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const payload = { profilePic: reader.result };
        const res = await axios.put(`/api/users/${user}/profile`, payload);
        setCurrentUserData(res.data);
      } catch (err) { console.error('Failed to update profile pic', err); }
    };
    reader.readAsDataURL(file);
  };

  const saveProfileField = async () => {
    try {
      const payload = {
        displayName: editProfileField === 'name' ? editProfileValue : currentUserData?.displayName,
        bio: editProfileField === 'bio' ? editProfileValue : currentUserData?.bio
      };
      const res = await axios.put(`/api/users/${user}/profile`, payload);
      setCurrentUserData(res.data);
      setEditProfileField(null);
    } catch (err) { console.error('Failed to update profile', err); }
  };

  const clearChat = () => {
    if (!selectedUser) return;
    if (window.confirm(`Clear chat with ${selectedUser}?`)) {
      setMessages(messages.filter(m => !(m.sender === selectedUser || m.receiver === selectedUser)));
    }
  };

  const getAvatarColor = (name) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return professionalColors[Math.abs(h) % professionalColors.length];
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  /* ── FETCH ─────────────────────────────────────────────── */
  const fetchUsers = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/users/${user}`);
      let allUsers = res.data;
      try {
        const grpRes = await axios.get(`/api/groups/${user}`);
        allUsers = [...allUsers, ...grpRes.data];
      } catch (e) { }
      setUsers(allUsers);

      try {
        const statRes = await axios.get('/api/status');
        setStatuses(statRes.data);
      } catch (e) { }

    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user) {
      if (window.location.pathname === '/login' || window.location.pathname === '/') navigate('/chat');
      fetchUsers();
    } else {
      if (window.location.pathname !== '/login') navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedUser && user) {
      setIsOppositeUserTyping(false);

      // ⚡ OPTIMISTIC UI: Clear the unread badge instantly
      setUsers(prev => prev.map(u => u.username === selectedUser ? { ...u, unreadCount: 0 } : u));
      
      axios.get(`/api/messages/${user}/${selectedUser}`)
        .then(res => {
          setMessages(res.data);
          res.data.forEach(m => {
            if ((m.sender === selectedUser || (m.receiverType === 'group' && m.receiver === selectedUser && m.sender !== user)) && !m.isRead)
              socket.emit('mark_read', { messageId: m._id, sender: m.sender });
          });
          fetchUsers();
        });
    }
  }, [selectedUser, user]);

  // Keep-alive ping to prevent connection drop during short backgrounding
  useEffect(() => {
    const keepAlive = setInterval(() => {
      axios.get(`/api/ping`).catch(() => {});
    }, 45000); // 45 seconds
    return () => clearInterval(keepAlive);
  }, []);

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      if (msg.sender === 'Meta AI' && selectedUser === 'Meta AI') setIsTyping(false);

      const isDirectMatch = (msg.sender === user && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === user);
      const isGroupMatch = msg.receiverType === 'group' && msg.receiver === selectedUser;

      if (isDirectMatch || isGroupMatch) {
        setMessages(prev => [...prev, msg]);
        if ((msg.receiver === user && selectedUser === msg.sender) || (msg.receiverType === 'group' && msg.receiver === selectedUser && msg.sender !== user))
          socket.emit('mark_read', { messageId: msg._id, sender: msg.sender });
      }

      if (msg.receiver === user || msg.sender === user || msg.receiverType === 'group') fetchUsers();
    });
    socket.on('display_typing', ({ sender, isTyping }) => {
      if (sender === selectedUser) setIsOppositeUserTyping(isTyping);
      setTypingUsers(prev => ({ ...prev, [sender]: isTyping }));
    });
    socket.on('message_read_confirmed', (id) => {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    });
    socket.on('message_reacted', ({ messageId, reaction }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reaction } : m));
    });
    socket.on('user_status_update', fetchUsers);
    socket.on('message_deleted', (id) => {
      setMessages(prev => prev.filter(m => m._id !== id));
      fetchUsers();
    });
    return () => {
      socket.off('receive_message');
      socket.off('display_typing');
      socket.off('message_read_confirmed');
      socket.off('message_reacted');
      socket.off('user_status_update');
      socket.off('message_deleted');
    };
  }, [user, selectedUser]);

  const navigateStatus = useCallback((dir) => {
    setViewingStatuses(prev => {
      if (!prev) return null;
      const newIdx = prev.currentIndex + dir;
      if (newIdx >= 0 && newIdx < prev.items.length) {
        return { ...prev, currentIndex: newIdx };
      }
      return null;
    });
    setStatusProgress(0);
  }, []);

  useEffect(() => {
    if (viewingStatuses && !viewingStatuses.isPaused) {
      statusProgressRef.current = setInterval(() => {
        setStatusProgress(p => {
          if (p >= 100) {
            navigateStatus(1);
            return 0;
          }
          return p + 1; // 1% per 50ms = 5 sec total
        });
      }, 50);
    } else {
      clearInterval(statusProgressRef.current);
    }
    return () => clearInterval(statusProgressRef.current);
  }, [viewingStatuses?.isPaused, viewingStatuses?.currentIndex, navigateStatus]);

  // Record a view when viewing someone else's status
  useEffect(() => {
    if (viewingStatuses && viewingStatuses.username !== user) {
      const currentStatus = viewingStatuses.items[viewingStatuses.currentIndex];
      if (currentStatus && !currentStatus.viewers?.includes(user)) {
        axios.put('/api/status/view', {
          statusId: currentStatus._id,
          viewerUsername: user
        }).catch(err => console.error(err));
      }
    }
  }, [viewingStatuses?.currentIndex, viewingStatuses?.username, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── TYPING ────────────────────────────────────────────── */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (selectedUser && selectedUser !== 'Meta AI') {
      socket.emit('typing_status', { sender: user, receiver: selectedUser, isTyping: true });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing_status', { sender: user, receiver: selectedUser, isTyping: false });
      }, 2000);
    }
  };

  /* ── VOICE RECORDER ────────────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit('send_message', {
            sender: user, receiver: selectedUser,
            receiverType: users.find(u => u.username === selectedUser)?.isGroup ? 'group' : 'user',
            text: '',
            file: reader.result,
            fileType: 'audio',
            fileName: 'Voice message.webm',
            replyTo: replyTo ? { sender: replyTo.sender, text: replyTo.text, fileType: replyTo.fileType } : null,
          });
          setReplyTo(null);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordTimerRef.current);
    }
  };

  /* ── FILE ──────────────────────────────────────────────── */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large! Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      socket.emit('send_message', {
        sender: user, receiver: selectedUser,
        receiverType: users.find(u => u.username === selectedUser)?.isGroup ? 'group' : 'user',
        text: '',
        file: reader.result,
        fileType: file.type.startsWith('image') ? 'image' : 'file',
        fileName: file.name,
      });
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  };

  /* ── SEND / EDIT ───────────────────────────────────────── */
  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    if (editingMsg) {
      /* Optimistic UI-only edit */
      setMessages(prev => prev.map(m =>
        m._id === editingMsg._id ? { ...m, text: input, isEdited: true } : m
      ));
      setEditingMsg(null);
      setInput('');
      return;
    }

    if (selectedUser === 'Meta AI') setIsTyping(true);
    else socket.emit('typing_status', { sender: user, receiver: selectedUser, isTyping: false });

    socket.emit('send_message', {
      sender: user,
      receiver: selectedUser,
      receiverType: users.find(u => u.username === selectedUser)?.isGroup ? 'group' : 'user',
      text: input,
      replyTo: replyTo
        ? { sender: replyTo.sender, text: replyTo.text, fileType: replyTo.fileType }
        : null,
    });
    setInput('');
    setReplyTo(null);
  };

  /* ── REPLY / EDIT helpers ──────────────────────────────── */
  const startReply = (msg) => { setReplyTo(msg); setEditingMsg(null); inputRef.current?.focus(); };
  const cancelReply = () => setReplyTo(null);
  const startEdit = (msg) => { setEditingMsg(msg); setReplyTo(null); setInput(msg.text); inputRef.current?.focus(); };
  const cancelEdit = () => { setEditingMsg(null); setInput(''); };

  /* ── SWIPE helpers (shared logic) ─────────────────────── */
  const applySwipe = (msgId, dx, isSent) => {
    const el = bubbleRefs.current[msgId];
    if (!el) return;
    const clamped = isSent
      ? Math.max(-72, Math.min(0, dx))   /* sent: swipe left  */
      : Math.max(0, Math.min(72, dx));   /* recv: swipe right */
    el.style.transform = `translateX(${clamped}px)`;
    el.style.transition = 'none';
    /* reveal swipe-arrow hint class */
    const hint = el.parentElement?.querySelector('.swipe-hint');
    if (hint) hint.style.opacity = Math.abs(clamped) > 20 ? '1' : '0';
  };

  const commitSwipe = (msgId, dx, isSent, msg) => {
    const el = bubbleRefs.current[msgId];
    if (el) { el.style.transform = 'translateX(0)'; el.style.transition = 'transform 0.25s ease'; }
    const hint = el?.parentElement?.querySelector('.swipe-hint');
    if (hint) hint.style.opacity = '0';
    if ((isSent && dx < -55) || (!isSent && dx > 55)) startReply(msg);
  };

  /* Touch */
  const onTouchStart = (e, msgId) => { touchStartX.current[msgId] = e.touches[0].clientX; };
  const onTouchMove = (e, msgId, isSent) => {
    const dx = e.touches[0].clientX - (touchStartX.current[msgId] || 0);
    applySwipe(msgId, dx, isSent);
  };
  const onTouchEnd = (e, msgId, isSent, msg) => {
    const dx = e.changedTouches[0].clientX - (touchStartX.current[msgId] || 0);
    commitSwipe(msgId, dx, isSent, msg);
  };

  /* Mouse (desktop) */
  const onMouseDown = (e, msgId) => { mouseStartX.current[msgId] = e.clientX; isDragging.current[msgId] = true; };
  const onMouseMove = (e, msgId, isSent) => {
    if (!isDragging.current[msgId]) return;
    applySwipe(msgId, e.clientX - (mouseStartX.current[msgId] || 0), isSent);
  };
  const onMouseUp = (e, msgId, isSent, msg) => {
    if (!isDragging.current[msgId]) return;
    isDragging.current[msgId] = false;
    commitSwipe(msgId, e.clientX - (mouseStartX.current[msgId] || 0), isSent, msg);
  };

  /* ── FILTER & SEARCH ───────────────────────────────────── */
  const filterTabs = ['All', 'Unread', 'Favourites', 'Groups'];
  const totalUnread = users.filter(u => u.username !== user && ((u.unreadCount || 0) > 0 || customUnreadUsers.includes(u.username))).length;
  const unreadGroupsCount = users.filter(u => u.isGroup && u.username !== user && ((u.unreadCount || 0) > 0 || customUnreadUsers.includes(u.username))).length;

  const filteredList = users
    .filter(u => {
      if (u.username === user || u.username === 'Meta AI') return false;
      if (deletedChats.includes(u.username)) return false;
      if (archivedUsers.includes(u.username) && activeFilter !== 'Archived') return false;
      if (searchQuery && !u.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeFilter === 'Unread') return (u.unreadCount || 0) > 0 || customUnreadUsers.includes(u.username);
      if (activeFilter === 'Favourites') return favorites.includes(u.username);
      if (activeFilter === 'Archived') return archivedUsers.includes(u.username);
      if (activeFilter === 'Groups') return u.isGroup;
      return true;
    })
    .sort((a, b) => {
      const pinA = pinnedUsers.includes(a.username);
      const pinB = pinnedUsers.includes(b.username);
      if (pinA && !pinB) return -1;
      if (!pinA && pinB) return 1;
      return new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0);
    });



  const handleLogout = () => {
    setUser(null);
    setCurrentUserData(null);
    setSelectedUser(null);
    setShowSettings(false);
    setSelectedSetting(null);
    setAuthData({ username: '', password: '', mobile: '', email: '' });
  };

  const handleCreateGroup = async () => {
    if (!createGroupName || createGroupMembers.length === 0) return;
    try {
      await axios.post('/api/groups', {
        name: createGroupName,
        icon: createGroupIcon,
        members: [...createGroupMembers, user],
        admin: user
      });
      setShowNewChat(false);
      setNewChatStep('list');
      setCreateGroupMembers([]);
      setCreateGroupName('');
      setCreateGroupIcon('');
      fetchUsers();
    } catch (err) { console.error('Failed to create group', err); }
  };

  const handleExitGroup = async () => {
    if (window.confirm(`Exit this group?`)) {
      try {
        await axios.put(`/api/groups/${selectedUser}/exit`, { username: user });
        setShowContactInfo(false);
        setSelectedUser(null);
        fetchUsers();
      } catch (err) { console.error('Failed to exit group', err); }
    }
  };

  const handleAddMember = async (newUsername) => {
    try {
      await axios.put(`/api/groups/${selectedUser}/add`, { newMembers: [newUsername] });
      setShowAddMemberModal(false);
      fetchUsers();
    } catch (err) { console.error('Failed to add member', err); }
  };

  const handleStatusUpload = async (type, content, bgColor = null, caption = '') => {
    try {
      await axios.post('/api/status', { username: user, type, content, bgColor, caption });
      fetchUsers();
      let statRes = await axios.get('/api/status');
      setStatuses(statRes.data);
      setComposingStatus(null);
    } catch (e) { console.error('Failed to upload status', e); }
  };

  const handleStatusFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setComposingStatus({ type: 'image', content: event.target.result, caption: '' });
    reader.readAsDataURL(file);
    setShowStatusMenu(false);
    e.target.value = null;
  };

  const handleStatusTextTrigger = () => {
    const colors = ['#08826b', '#25d366', '#d32f2f', '#7b1fa2', '#1976d2', '#e65100'];
    setComposingStatus({ type: 'text', content: '', bgColor: colors[0], caption: '' });
    setShowStatusMenu(false);
  };
  /* ══════════════════════════════════════════════════════════
     APP ROUTES
  ══════════════════════════════════════════════════════════ */
  return (
    <Routes>
      <Route path="/login" element={!user ? <AuthScreen setUser={setUser} setCurrentUserData={setCurrentUserData} socket={socket} setStatuses={setStatuses} /> : <Navigate to="/chat" />} />
      <Route path="/chat" element={
        user ? (
          <div className={`app-container ${selectedUser ? 'chat-active' : ''}`}>
            {/* ── STATUS COMPOSER OVERLAY ── */}
            {composingStatus && (
              <div className="status-fullscreen-overlay" style={{ backgroundColor: composingStatus.type === 'text' ? composingStatus.bgColor : '#0b141a' }}>
                <div className="status-top-bar">
                  <button className="icon-btn" onClick={() => setComposingStatus(null)}>
                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19.8 5.8l-1.6-1.6-6.2 6.2-6.2-6.2-1.6 1.6 6.2 6.2-6.2 6.2 1.6 1.6 6.2-6.2 6.2 6.2 1.6-1.6-6.2-6.2z" /></svg>
                  </button>
                  {composingStatus.type === 'text' && (
                    <div className="status-composer-tools">
                      <button className="icon-btn"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0z" /></svg></button>
                      <button className="icon-btn" style={{ fontWeight: 'bold' }}>T</button>
                      <button className="icon-btn" onClick={() => {
                        const colors = ['#08826b', '#25d366', '#d32f2f', '#7b1fa2', '#1976d2', '#e65100'];
                        const nextColor = colors[(colors.indexOf(composingStatus.bgColor) + 1) % colors.length];
                        setComposingStatus({ ...composingStatus, bgColor: nextColor });
                      }}>
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-1 5.478 5.478 0 0 1-1.49-8.49A8.974 8.974 0 0 0 12 3zm0 18a9 9 0 1 1 9-9 9.098 9.098 0 0 1-.1 1.36A7.376 7.376 0 0 0 12 21z" /></svg>
                      </button>
                    </div>
                  )}
                  {composingStatus.type === 'image' && (
                    <div className="status-composer-tools">
                      <button className="icon-btn"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159z" /></svg></button>
                    </div>
                  )}
                </div>

                <div className="status-content-area">
                  {composingStatus.type === 'text' ? (
                    <textarea
                      className="status-textarea"
                      placeholder="Type a status"
                      autoFocus
                      value={composingStatus.content}
                      onChange={e => setComposingStatus({ ...composingStatus, content: e.target.value })}
                    />
                  ) : (
                    <img src={composingStatus.content} alt="preview" className="status-image-preview" />
                  )}
                </div>

                <div className="status-bottom-bar">
                  {composingStatus.type === 'image' && (
                    <input
                      className="status-caption-input"
                      placeholder="Add a caption"
                      autoFocus
                      value={composingStatus.caption}
                      onChange={e => setComposingStatus({ ...composingStatus, caption: e.target.value })}
                    />
                  )}
                  {composingStatus.type === 'text' && !composingStatus.content.trim() ? (
                    <button className="status-send-btn" style={{ right: 'auto', left: '24px', background: 'rgba(0,0,0,0.4)', width: 'auto', borderRadius: '20px', padding: '0 16px' }} disabled>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Status (1 excluded)</span>
                    </button>
                  ) : null}
                  <button
                    className="status-send-btn"
                    disabled={composingStatus.type === 'text' && !composingStatus.content.trim()}
                    onClick={() => handleStatusUpload(composingStatus.type, composingStatus.content, composingStatus.bgColor, composingStatus.caption)}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* ── STATUS VIEWER OVERLAY ── */}
            {viewingStatuses && (
              <div className="status-fullscreen-overlay" style={{ backgroundColor: '#000' }}>
                {viewingStatuses.items[viewingStatuses.currentIndex].type === 'image' && (
                  <div className="status-blur-bg" style={{ backgroundImage: `url(${viewingStatuses.items[viewingStatuses.currentIndex].content})` }}></div>
                )}

                <button className="viewer-top-left-actions icon-btn" onClick={() => { setViewingStatuses(null); clearInterval(statusProgressRef.current); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                </button>
                <button className="viewer-top-right-actions icon-btn" onClick={() => { setViewingStatuses(null); clearInterval(statusProgressRef.current); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                </button>

                {/* Navigation Arrows */}
                <div className="viewer-nav-btn viewer-nav-left" onClick={(e) => { e.stopPropagation(); navigateStatus(-1); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" /></svg>
                </div>
                <div className="viewer-nav-btn viewer-nav-right" onClick={(e) => { e.stopPropagation(); navigateStatus(1); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" transform="rotate(180 12 12)" /></svg>
                </div>

                <div className="viewer-wrapper">
                  <div className="viewer-container" style={{ backgroundColor: viewingStatuses.items[viewingStatuses.currentIndex].type === 'text' ? (viewingStatuses.items[viewingStatuses.currentIndex].bgColor || '#000') : 'transparent' }}>

                    <div className="status-progress-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '10px 16px' }}>
                      {viewingStatuses.items.map((item, idx) => (
                        <div key={idx} className="status-progress-bar" style={{ height: '2px', background: 'rgba(255,255,255,0.4)', borderRadius: '1px', flex: 1, margin: '0 2px' }}>
                          <div className="status-progress-fill" style={{
                            height: '100%', background: '#fff', transition: 'width 0.1s linear',
                            width: idx < viewingStatuses.currentIndex ? '100%' : idx === viewingStatuses.currentIndex ? `${statusProgress}%` : '0%'
                          }}></div>
                        </div>
                      ))}
                    </div>

                    <div className="status-top-bar" style={{ position: 'absolute', top: '15px', left: 0, right: 0, zIndex: 30, paddingTop: '10px', paddingBottom: 0 }}>
                      <div className="viewer-header-info" style={{ marginLeft: '12px' }}>
                        <img src={users.find(u => u.username === viewingStatuses.username)?.profilePic || `https://ui-avatars.com/api/?name=${viewingStatuses.username}&background=${getAvatarColor(viewingStatuses.username)}&color=fff&bold=true`} alt="Profile" />
                        <div className="viewer-header-text">
                          <span className="name" style={{ fontWeight: 500, fontSize: '15px' }}>{viewingStatuses.username === user ? 'You' : users.find(u => u.username === viewingStatuses.username)?.displayName || viewingStatuses.username}</span>
                          <span className="time" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{formatTime(viewingStatuses.items[viewingStatuses.currentIndex].createdAt)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginRight: '12px' }}>
                        <button className="icon-btn" style={{ background: 'transparent' }} onClick={() => setViewingStatuses({ ...viewingStatuses, isPaused: !viewingStatuses.isPaused })}>
                          {viewingStatuses.isPaused ? (
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="status-content-area" style={{ padding: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseDown={() => setViewingStatuses({ ...viewingStatuses, isPaused: true })}
                      onMouseUp={() => setViewingStatuses({ ...viewingStatuses, isPaused: false })}
                      onMouseLeave={() => setViewingStatuses({ ...viewingStatuses, isPaused: false })}>
                      {/* Click zones */}
                      <div style={{ position: 'absolute', top: '10%', left: 0, bottom: '15%', width: '30%', zIndex: 20, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigateStatus(-1); }}></div>
                      <div style={{ position: 'absolute', top: '10%', right: 0, bottom: '15%', width: '30%', zIndex: 20, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigateStatus(1); }}></div>

                      {viewingStatuses.items[viewingStatuses.currentIndex].type === 'text' ? (
                        <div style={{ fontSize: '36px', textAlign: 'center', maxWidth: '90%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', padding: '20px' }}>
                          {viewingStatuses.items[viewingStatuses.currentIndex].content}
                        </div>
                      ) : (
                        <img src={viewingStatuses.items[viewingStatuses.currentIndex].content} className="status-image-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="status" />
                      )}
                    </div>

                    <div className="viewer-bottom-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '0 0 16px 0', width: '100%' }}>
                      {viewingStatuses.items[viewingStatuses.currentIndex].caption && (
                        <div className="viewer-caption" style={{ fontSize: '15px', textAlign: 'center', margin: '0 auto 16px', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '16px', display: 'inline-block' }}>
                          {viewingStatuses.items[viewingStatuses.currentIndex].caption}
                        </div>
                      )}

                      {viewingStatuses.username === user ? (
                        <div className="viewer-eye-count" onClick={(e) => { e.stopPropagation(); setShowViewersModal(true); setViewingStatuses({ ...viewingStatuses, isPaused: true }); }} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                          <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{viewingStatuses.items[viewingStatuses.currentIndex].viewers?.length || 0}</span>
                        </div>
                      ) : (
                        <div className="viewer-reply-area" style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="icon-btn" style={{ color: '#fff', cursor: 'pointer' }}><svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" /></svg></div>
                          <div className="viewer-reply-pill" style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: '24px', padding: '8px 16px', gap: '12px' }}>
                            <input
                              placeholder="Type a reply..."
                              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '15px' }}
                              onClick={(e) => {
                                setViewingStatuses({ ...viewingStatuses, isPaused: true });
                                e.stopPropagation();
                              }}
                              onBlur={() => setViewingStatuses({ ...viewingStatuses, isPaused: false })}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  const isGroup = users.find(u => u.username === viewingStatuses.username)?.isGroup || false;
                                  socket.emit('send_message', {
                                    sender: user, receiver: viewingStatuses.username,
                                    receiverType: isGroup ? 'group' : 'user',
                                    text: e.target.value,
                                    replyTo: { sender: viewingStatuses.username, text: 'Status update', fileType: viewingStatuses.items[viewingStatuses.currentIndex].type }
                                  });
                                  e.target.value = '';
                                  setViewingStatuses(null); clearInterval(statusProgressRef.current);
                                  setSelectedUser(viewingStatuses.username);
                                }
                              }}
                            />
                          </div>
                          <div className="icon-btn" style={{ color: '#fff', cursor: 'pointer' }}><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" /></svg></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {showViewersModal && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50vh', background: '#202c33', zIndex: 2000, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#e9edef' }}>Viewed by {viewingStatuses.items[viewingStatuses.currentIndex].viewers?.length || 0}</span>
                      <button className="icon-btn" onClick={() => { setShowViewersModal(false); setViewingStatuses({ ...viewingStatuses, isPaused: false }); }} style={{ color: '#8696a0' }}>
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                      </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                      {viewingStatuses.items[viewingStatuses.currentIndex].viewers?.length > 0 ? (
                        viewingStatuses.items[viewingStatuses.currentIndex].viewers.map((viewer, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '15px', color: '#e9edef' }}>
                            <img src={`https://ui-avatars.com/api/?name=${viewer}&background=${getAvatarColor(viewer)}&color=fff&bold=true`} alt="viewer" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            <div style={{ fontSize: '16px' }}>{viewer}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8696a0', fontSize: '15px', height: '100%' }}>
                          No views yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Global Overlay to close menus */}
            {(showEmojiPicker || showAttachMenu || activeMsgMenu || forwardingMsg || activeChatMenu || reactingMsg) && (
              <div className="global-overlay" onClick={() => {
                setShowEmojiPicker(false);
                setShowAttachMenu(false);
                setActiveMsgMenu(null);
                setActiveChatMenu(null);
                setReactingMsg(null);
                if (forwardingMsg) setForwardingMsg(null);
              }}></div>
            )}

            {/* ── 1. NAV RAIL ─────────────────────────────────────── */}
            <div className="nav-rail">
              <div className="nav-rail-top">
                <div className={`nav-icon ${activeNav === 'chats' ? 'active' : ''}`} title="Chats" onClick={() => setActiveNav('chats')}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19.005 3.175H4.674c-1.642 0-2.975 1.333-2.975 2.975v11.701c0 1.642 1.333 2.975 2.975 2.975h14.331c1.642 0 2.975-1.333 2.975-2.975V6.15c0-1.642-1.333-2.975-2.975-2.975zm-7.165 15.035c-3.591 0-6.502-2.911-6.502-6.502s2.911-6.502 6.502-6.502 6.502 2.911 6.502 6.502-2.911 6.502-6.502 6.502z" /></svg>
                  <span className="nav-label">Chats</span>
                </div>
                <div className={`nav-icon ${activeNav === 'status' ? 'active' : ''}`} title="Updates" onClick={() => setActiveNav('status')}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.75.75 0 0 1 1.061-1.061 7.663 7.663 0 1 0 0-10.837.75.75 0 0 1-1.06-1.06 9.163 9.163 0 1 1 6.52 15.66z" /></svg>
                  <span className="nav-label">Updates</span>
                </div>
                <div className={`nav-icon ${activeNav === 'communities' ? 'active' : ''} desktop-only`} title="Communities" onClick={() => setActiveNav('communities')}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                  <span className="nav-label">Communities</span>
                </div>
                <div className={`nav-icon ${activeNav === 'calls' ? 'active' : ''} desktop-only`} title="Calls" onClick={() => setActiveNav('calls')}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                  <span className="nav-label">Calls</span>
                </div>

                <div className="nav-icon mobile-only" title="Settings" onClick={() => { setShowSettings(!showSettings); setSelectedSetting(null); setShowProfileSidebar(false); }}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 15.516c-1.922 0-3.516-1.594-3.516-3.516S10.078 8.484 12 8.484 15.516 10.078 15.516 12 13.922 15.516 12 15.516zm7.453-2.36a7.3 7.3 0 0 0 .063-.938v-.047a7.3 7.3 0 0 0-.063-.937l2.016-1.547a.47.47 0 0 0 .11-.61l-1.922-3.234a.48.48 0 0 0-.594-.203l-2.375.938a7.8 7.8 0 0 0-1.64-.938l-.36-2.484A.47.47 0 0 0 14.22 3h-3.843a.47.47 0 0 0-.47.375l-.36 2.5a7.8 7.8 0 0 0-1.624.937l-2.39-.937a.47.47 0 0 0-.594.203L3.016 9.31a.46.46 0 0 0 .11.61l2.016 1.547a7 7 0 0 0-.063.937v.047c0 .313.016.625.063.938L3.125 14.92a.47.47 0 0 0-.11.61l1.922 3.234a.48.48 0 0 0 .594.203l2.375-.938c.5.36 1.047.672 1.64.938l.36 2.484c.063.219.25.375.47.375h3.843a.47.47 0 0 0 .47-.375l.36-2.5c.578-.265 1.125-.578 1.625-.937l2.39.937a.47.47 0 0 0 .594-.203l1.922-3.25a.46.46 0 0 0-.11-.61z" /></svg>
                  <span className="nav-label">Settings</span>
                </div>
                <div className="nav-icon profile-nav-item mobile-only" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowProfileSidebar(true)}>
                  <div style={{ width: '22px', height: '22px', backgroundColor: '#dfe5e7', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={currentUserData?.profilePic || `https://ui-avatars.com/api/?name=${user}&background=${getAvatarColor(user)}&color=fff&bold=true`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span className="nav-label">Profile</span>
                </div>
              </div>
              <div className="nav-rail-bottom">
                <div className="nav-icon" title="Settings" onClick={() => { setShowSettings(!showSettings); setSelectedSetting(null); setShowProfileSidebar(false); }}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 15.516c-1.922 0-3.516-1.594-3.516-3.516S10.078 8.484 12 8.484 15.516 10.078 15.516 12 13.922 15.516 12 15.516zm7.453-2.36a7.3 7.3 0 0 0 .063-.938v-.047a7.3 7.3 0 0 0-.063-.937l2.016-1.547a.47.47 0 0 0 .11-.61l-1.922-3.234a.48.48 0 0 0-.594-.203l-2.375.938a7.8 7.8 0 0 0-1.64-.938l-.36-2.484A.47.47 0 0 0 14.22 3h-3.843a.47.47 0 0 0-.47.375l-.36 2.5a7.8 7.8 0 0 0-1.624.937l-2.39-.937a.47.47 0 0 0-.594.203L3.016 9.31a.46.46 0 0 0 .11.61l2.016 1.547a7 7 0 0 0-.063.937v.047c0 .313.016.625.063.938L3.125 14.92a.47.47 0 0 0-.11.61l1.922 3.234a.48.48 0 0 0 .594.203l2.375-.938c.5.36 1.047.672 1.64.938l.36 2.484c.063.219.25.375.47.375h3.843a.47.47 0 0 0 .47-.375l.36-2.5c.578-.265 1.125-.578 1.625-.937l2.39.937a.47.47 0 0 0 .594-.203l1.922-3.25a.46.46 0 0 0-.11-.61z" /></svg>
                </div>
                <div className="nav-icon" title="Ask Meta AI" onClick={() => setSelectedUser('Meta AI')}>
                  <div className="meta-gradient-nav"></div>
                </div>
                <div className="nav-icon profile-nav-item" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowProfileSidebar(true)}>
                  <div style={{ width: '80%', height: '80%', backgroundColor: '#dfe5e7', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={currentUserData?.profilePic || `https://ui-avatars.com/api/?name=${user}&background=${getAvatarColor(user)}&color=fff&bold=true`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. SIDEBAR ──────────────────────────────────────── */}
            <div className="sidebar" style={{ display: activeNav === 'status' ? 'none' : 'flex' }}>
              {showSettings ? (
                <div className="settings-sidebar">
                  <div className="settings-header">
                    <button className="icon-btn" onClick={() => setShowSettings(false)}>
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                    </button>
                    <h2>Settings</h2>
                  </div>
                  <div className="settings-search">
                    <div className="settings-search-box">
                      <svg viewBox="0 0 24 24" width="18" height="18" style={{ color: '#8696a0' }}><path fill="currentColor" d="M15.009 13.805h-.636l-.227-.217c.789-.918 1.264-2.11 1.264-3.414 0-2.969-2.406-5.375-5.375-5.375s-5.375 2.406-5.375 5.375 2.406 5.375 5.375 5.375c1.305 0 2.496-.475 3.414-1.264l.217.227v.636l4.031 4.023 1.203-1.203-4.023-4.031zm-5.375 0c-1.984 0-3.594-1.61-3.594-3.594s1.61-3.594 3.594-3.594 3.594 1.61 3.594 3.594-1.61 3.594-3.594 3.594z" /></svg>
                      <input placeholder="Search settings" />
                    </div>
                  </div>

                  <div className="settings-list">
                    <div className="settings-profile-row" onClick={() => { setShowSettings(false); setShowProfileSidebar(true); }}>
                      <div className="profile-avatar">
                        <img src={currentUserData?.profilePic || `https://ui-avatars.com/api/?name=${user}&background=${getAvatarColor(user)}&color=fff&bold=true`} alt="Profile" />
                      </div>
                      <div className="settings-item-text" style={{ flex: 1 }}>
                        <span className="title" style={{ fontSize: '18px' }}>{currentUserData?.displayName || user}</span>
                        <span className="desc">✨</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17 7h-3V6c0-1.1-.9-2-2-2s-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-5 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-8H10V6h4v1z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Account</span>
                        <span className="desc">Security notifications, account info</span>
                      </div>
                    </div>

                    <div className="settings-item" onClick={() => { setSelectedSetting(selectedSetting === 'blocked' ? null : 'blocked'); }}>
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Privacy</span>
                        <span className="desc">Blocked contacts, disappearing messages</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18.8 6.4c-1.3-.8-2.9-1.2-4.5-1.2s-3.2.4-4.5 1.2c-1.3.8-2.3 1.9-2.9 3.2-1.3-.2-2.7 0-3.9.7-1.2.7-2 1.8-2.5 3.2-.2 1.2 0 2.5.5 3.6.5 1.1 1.4 2.1 2.5 2.6V20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-.5c1.1-.5 2-1.5 2.5-2.6.5-1.1.7-2.4.5-3.6-.5-1.4-1.3-2.5-2.5-3.2-1.2-.7-2.6-.9-3.9-.7-.6-1.3-1.6-2.4-2.9-3.2z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Chats</span>
                        <span className="desc">Theme, wallpaper, chat settings</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Notifications</span>
                        <span className="desc">Messages, groups, sounds</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Keyboard shortcuts</span>
                        <span className="desc">Quick actions</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title">Help and feedback</span>
                        <span className="desc">Help centre, contact us, privacy policy</span>
                      </div>
                    </div>

                    <div className="settings-item text-red" onClick={handleLogout} style={{ marginTop: '10px', paddingBottom: '30px' }}>
                      <div className="settings-item-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z" /></svg></div>
                      <div className="settings-item-text">
                        <span className="title" style={{ fontWeight: '500' }}>Log out</span>
                      </div>
                    </div>

                  </div>
                </div>
              ) : showProfileSidebar ? (
                <div className="profile-sidebar">
                  <div className="profile-header">
                    <button className="icon-btn" onClick={() => setShowProfileSidebar(false)}>
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                    </button>
                    <h2>Profile</h2>
                  </div>

                  <div className="profile-scroll">
                    <div className="profile-pic-section">
                      <input type="file" ref={profilePicInputRef} style={{ display: 'none' }} onChange={handleProfilePicChange} accept="image/*" />
                      <div className="profile-pic-wrapper" onClick={() => profilePicInputRef.current.click()}>
                        <img src={currentUserData?.profilePic || `https://ui-avatars.com/api/?name=${user}&background=${getAvatarColor(user)}&color=fff&bold=true`} alt="Profile" />
                        <div className="profile-pic-overlay">
                          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M21.016 7.424A9.973 9.973 0 0012 3c-5.522 0-10 4.478-10 10s4.478 10 10 10 10-4.478 10-10c0-1.777-.464-3.447-1.282-4.904l-1.42 1.42A7.957 7.957 0 0120 13c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c1.365 0 2.65.342 3.792.937l1.458-1.458a9.919 9.919 0 00-2.266-1.079zM15 11l-3 3-3-3h2v-4h2v4h2z" /></svg>
                          <span>CHANGE<br />PROFILE PHOTO</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-section">
                      <p className="profile-label">Your name</p>
                      {editProfileField === 'name' ? (
                        <div className="profile-edit-row">
                          <input autoFocus value={editProfileValue} onChange={e => setEditProfileValue(e.target.value)} />
                          <button onClick={saveProfileField}><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg></button>
                        </div>
                      ) : (
                        <div className="profile-value-row">
                          <span>{currentUserData?.displayName || user}</span>
                          <button onClick={() => { setEditProfileField('name'); setEditProfileValue(currentUserData?.displayName || user); }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" className="pencil-icon"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                          </button>
                        </div>
                      )}
                      <span className="profile-hint">This is not your username or pin. This name will be visible to your WhatsApp contacts.</span>
                    </div>

                    <div className="profile-section section-gap">
                      <p className="profile-label">About</p>
                      {editProfileField === 'bio' ? (
                        <div className="profile-edit-row">
                          <input autoFocus value={editProfileValue} onChange={e => setEditProfileValue(e.target.value)} />
                          <button onClick={saveProfileField}><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg></button>
                        </div>
                      ) : (
                        <div className="profile-value-row">
                          <span>{currentUserData?.bio || 'Hey there! I am using WhatsApp.'}</span>
                          <button onClick={() => { setEditProfileField('bio'); setEditProfileValue(currentUserData?.bio || 'Hey there! I am using WhatsApp.'); }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" className="pencil-icon"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="profile-section section-gap">
                      <p className="profile-label">Phone</p>
                      <div className="profile-value-row">
                        <span>{currentUserData?.mobile || '+0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : showNewChat ? (
                <div className="new-chat-sidebar">
                  <div className="new-chat-header">
                    <button className="icon-btn" style={{ color: 'white' }} onClick={() => {
                      if (newChatStep === 'group_info') setNewChatStep('select_members');
                      else if (newChatStep === 'select_members') setNewChatStep('list');
                      else setShowNewChat(false);
                    }}>
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                    </button>
                    <h2>{newChatStep === 'list' ? 'New chat' : newChatStep === 'select_members' ? 'Add group participants' : 'New group'}</h2>
                  </div>

                  {newChatStep === 'list' && (
                    <>
                      <div className="new-chat-search">
                        <div className="new-chat-search-box">
                          <svg viewBox="0 0 24 24" width="18" height="18" style={{ color: '#8696a0' }}><path fill="currentColor" d="M15.009 13.805h-.636l-.227-.217c.789-.918 1.264-2.11 1.264-3.414 0-2.969-2.406-5.375-5.375-5.375s-5.375 2.406-5.375 5.375 2.406 5.375 5.375 5.375c1.305 0 2.496-.475 3.414-1.264l.217.227v.636l4.031 4.023 1.203-1.203-4.023-4.031zm-5.375 0c-1.984 0-3.594-1.61-3.594-3.594s1.61-3.594 3.594-3.594 3.594 1.61 3.594 3.594-1.61 3.594-3.594 3.594z" /></svg>
                          <input placeholder="Search name or number" />
                        </div>
                      </div>
                      <div className="new-chat-scroll">
                        <div className="new-chat-action" onClick={() => setNewChatStep('select_members')}>
                          <div className="new-chat-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg></div>
                          <span className="new-chat-text">New group</span>
                        </div>
                        <div className="new-chat-action">
                          <div className="new-chat-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>
                          <span className="new-chat-text">New contact</span>
                        </div>
                        <div className="new-chat-action">
                          <div className="new-chat-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg></div>
                          <span className="new-chat-text">New community</span>
                        </div>
                        <div style={{ padding: '20px 30px', color: '#008069', fontWeight: 500, letterSpacing: '1px', fontSize: '14px' }}>CONTACTS ON WHATSAPP</div>
                        {users.map(u => (
                          <div key={u.username} className="user-item" onClick={() => { setShowNewChat(false); setSelectedUser(u.username); }}>
                            <div className="profile-avatar"><img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.username}&background=${getAvatarColor(u.username)}&color=fff&bold=true`} alt="Profile" /></div>
                            <div className="user-info">
                              <div className="uname" style={{ fontSize: '16px' }}>{u.displayName || u.username}</div>
                              <div className="umsg">{u.bio || 'Hey there! I am using WhatsApp.'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {newChatStep === 'select_members' && (
                    <>
                      {createGroupMembers.length > 0 && (
                        <div className="group-chips-container">
                          {createGroupMembers.map(mUsername => {
                            const mUser = users.find(x => x.username === mUsername);
                            return (
                              <div key={mUsername} className="group-chip">
                                <img src={mUser?.profilePic || `https://ui-avatars.com/api/?name=${mUsername}&background=${getAvatarColor(mUsername)}&color=fff&bold=true`} alt="Profile" />
                                <span>{mUser?.displayName || mUsername}</span>
                                <button onClick={() => setCreateGroupMembers(createGroupMembers.filter(x => x !== mUsername))}><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg></button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="new-chat-search">
                        <input type="text" placeholder="Search name or number" style={{ width: '100%', border: 'none', outline: 'none', borderBottom: '1px solid var(--border)', padding: '8px 0' }} />
                      </div>
                      <div className="new-chat-scroll" style={{ position: 'relative' }}>
                        {users.filter(u => !u.isGroup).map(u => (
                          <div key={u.username} className="user-item" onClick={() => {
                            if (createGroupMembers.includes(u.username)) setCreateGroupMembers(createGroupMembers.filter(x => x !== u.username));
                            else setCreateGroupMembers([...createGroupMembers, u.username]);
                          }}>
                            <div className="profile-avatar"><img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.username}&background=${getAvatarColor(u.username)}&color=fff&bold=true`} alt="Profile" /></div>
                            <div className="user-info" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                              <div className="uname" style={{ fontSize: '16px' }}>{u.displayName || u.username}</div>
                            </div>
                            <div style={{ minWidth: '24px', display: 'flex', justifyContent: 'center' }}>
                              {createGroupMembers.includes(u.username) && <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#00a884" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>}
                            </div>
                          </div>
                        ))}
                        {createGroupMembers.length > 0 && (
                          <button className="group-fab" onClick={() => setNewChatStep('group_info')}>
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {newChatStep === 'group_info' && (
                    <div className="group-info-body" style={{ position: 'relative' }}>
                      <div className="group-icon-upload">
                        <img src={createGroupIcon || `https://ui-avatars.com/api/?name=Group&background=dfe5e7&color=fff&bold=true`} alt="Group Icon" />
                        <div className="group-icon-overlay">
                          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M21.016 7.424A9.973 9.973 0 0012 3c-5.522 0-10 4.478-10 10s4.478 10 10 10 10-4.478 10-10c0-1.777-.464-3.447-1.282-4.904l-1.42 1.42A7.957 7.957 0 0120 13c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c1.365 0 2.65.342 3.792.937l1.458-1.458a9.919 9.919 0 00-2.266-1.079zM15 11l-3 3-3-3h2v-4h2v4h2z" /></svg>
                          <span>ADD GROUP ICON</span>
                        </div>
                      </div>
                      <div className="group-name-input-container">
                        <input autoFocus placeholder="Group subject" value={createGroupName} onChange={e => setCreateGroupName(e.target.value)} maxLength={25} />
                      </div>
                      <button className="group-fab" onClick={handleCreateGroup}>
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="sidebar-header">
                    <div className="sidebar-brand">
                      <svg viewBox="0 0 55 55" width="26" height="26">
                        <path fill="#25d366" d="M27.5 0C12.3 0 0 12.3 0 27.5c0 4.8 1.3 9.4 3.6 13.3L0 55l14.5-3.8c3.8 2 8.1 3.2 12.9 3.2C42.8 54.5 55 42.2 55 27 55 12.3 42.7 0 27.5 0z" />
                        <path fill="#fff" d="M40.9 34.4c-.7-.3-4.1-2-4.7-2.3-.6-.2-1-.3-1.4.3-.4.6-1.6 2-2 2.5-.4.4-.7.5-1.4.2-3.7-1.9-6.2-3.3-8.6-7.5-.7-1.2.7-1.1 1.9-3.6.2-.4.1-.8-.1-1.1-.2-.3-1.4-3.4-2-4.7-.5-1.2-1.1-1-1.4-1.1h-1.2c-.4 0-1.1.2-1.7.9-.6.7-2.2 2.1-2.2 5.2 0 3.1 2.2 6 2.5 6.4 3 4.6 6.5 6.6 9.8 7.5 3.5 1 3.5.7 4.2.6.8-.1 2.5-1 2.9-2 .4-.9.4-1.7.3-1.9-.2-.2-.5-.3-1.1-.5z" />
                      </svg>
                      <span className="sidebar-title">WhatsApp</span>
                    </div>
                    <div className="sidebar-actions">
                      <button className="hdr-btn" title="New chat" onClick={() => { setShowNewChat(true); setNewChatStep('list'); setCreateGroupMembers([]); setShowProfileSidebar(false); setShowSettings(false); }}>
                        <svg viewBox="0 0 24 24" width="21" height="21"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                      </button>
                      <button className="hdr-btn" title="Menu">
                        <svg viewBox="0 0 24 24" width="21" height="21"><path fill="currentColor" d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="search-wrap">
                    <div className="search-box">
                      <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0, color: '#54656f' }}>
                        <path fill="currentColor" d="M15.009 13.805h-.636l-.227-.217c.789-.918 1.264-2.11 1.264-3.414 0-2.969-2.406-5.375-5.375-5.375s-5.375 2.406-5.375 5.375 2.406 5.375 5.375 5.375c1.305 0 2.496-.475 3.414-1.264l.217.227v.636l4.031 4.023 1.203-1.203-4.023-4.031zm-5.375 0c-1.984 0-3.594-1.61-3.594-3.594s1.61-3.594 3.594-3.594 3.594 1.61 3.594 3.594-1.61 3.594-3.594 3.594z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search or start a new chat"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="filter-row">
                    {filterTabs.map(tab => (
                      <button
                        key={tab}
                        className={`fchip ${activeFilter === tab ? 'fchip-on' : ''}`}
                        onClick={() => setActiveFilter(tab)}
                      >
                        {tab === 'Unread' && totalUnread > 0 ? `Unread ${totalUnread}` : tab === 'Groups' && unreadGroupsCount > 0 ? `Groups ${unreadGroupsCount}` : tab}
                      </button>
                    ))}
                    <button className="fchip fchip-plus" title="More filters">
                      <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                    </button>
                  </div>

                  {/* Chat list */}
                  <div className="user-list">

                    {/* Meta AI row */}
                    <div
                      className={`user-item meta-ai-item ${selectedUser === 'Meta AI' ? 'active' : ''}`}
                      onClick={() => setSelectedUser('Meta AI')}
                    >
                      <div className="profile-avatar meta-circle"><div className="meta-gradient"></div></div>
                      <div className="user-info">
                        <div className="user-info-top">
                          <span className="uname uname-meta">Meta AI</span>
                        </div>
                        <span className="umsg umsg-meta">Ask Meta AI anything</span>
                      </div>
                    </div>

                    {/* User rows */}
                    {filteredList.map(u => (
                      <div key={u.username} className={`user-item ${selectedUser === u.username ? 'active' : ''}`} onClick={() => { setSelectedUser(u.username); setActiveMsgMenu(null); setShowContactInfo(false); }}>
                        <div className="profile-avatar"><img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.username}&background=${getAvatarColor(u.username)}&color=fff&bold=true`} alt="avatar" /></div>
                        <div className="user-info" style={{ paddingRight: '5px' }}>
                          <div className="user-info-top">
                            <span className="uname">{u.displayName || u.username}</span>
                            <span className="utime">{formatTime(u.lastMessage?.timestamp)}</span>
                          </div>
                          <div className="user-info-bot">
                            {typingUsers[u.username] ? (
                              <span className="typing-text" style={{ color: 'var(--teal)', fontWeight: 500, fontSize: '13px' }}>typing...</span>
                            ) : (
                              <span className="umsg" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {u.lastMessage?.sender === user && (
                                  <svg viewBox="0 0 16 15" width="16" height="15" className={(u.lastMessage.isRead || u.username === 'Meta AI') ? 'tick-blue' : 'tick-grey'}>
                                    {(u.lastMessage.isRead || u.username === 'Meta AI') ? (
                                      <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424zm-4.73 0l-.479-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                    ) : (
                                      <path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                    )}
                                  </svg>
                                )}
                                {u.lastMessage?.fileType ? (u.lastMessage.fileType === 'image' ? '📷 Photo' : u.lastMessage.fileType === 'audio' ? '🎤 Audio' : '📄 Document') : (u.lastMessage?.text || 'Tap to start chatting')}
                              </span>
                            )}

                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {mutedUsers.includes(u.username) && <svg viewBox="0 0 24 24" width="15" height="15" style={{ color: 'var(--t2)' }}><path fill="currentColor" d="M13 1.05v6.59l4 4V1l-1-1H4c-.55 0-1 .45-1 1v4.46L13 1.05zM20.71 4.5l-2.05-2.05-14.5 14.5L6.21 19H16c.55 0 1-.45 1-1v-2.09l3.71 3.7 2.05-2.05-2.05-14.18v-8.88l-2.05 2.05zM7.29 8h-3v8h4.09l4.5 4.5V11.2l-5.59-5.59zH7.29z" /></svg>}
                              {pinnedUsers.includes(u.username) && <svg viewBox="0 0 24 24" width="15" height="15" style={{ color: 'var(--t2)' }}><path fill="currentColor" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>}
                              {((u.unreadCount || 0) > 0 || customUnreadUsers.includes(u.username)) && <span className="ubadge">{(u.unreadCount || 0) > 0 ? u.unreadCount : ' '}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </>
              )}
            </div>

            {activeNav === 'status' && (
              <div className="status-sidebar">
                <div className="status-header">
                  <h2>Status</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="hdr-btn" title="Add status" onClick={(e) => { e.stopPropagation(); setShowStatusMenu(!showStatusMenu); }}>
                      <svg viewBox="0 0 24 24" width="21" height="21"><path fill="currentColor" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.75.75 0 0 1 1.061-1.061 7.663 7.663 0 1 0 0-10.837.75.75 0 0 1-1.06-1.06 9.163 9.163 0 1 1 6.52 15.66z" /><path fill="currentColor" d="M12 7.5v9m-4.5-4.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <button className="hdr-btn" title="Menu"><svg viewBox="0 0 24 24" width="21" height="21"><path fill="currentColor" d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /></svg></button>
                  </div>
                </div>
                <div className="status-my-row user-item" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => {
                  const myStatuses = statuses.filter(s => s.username === user);
                  if (myStatuses.length > 0) {
                    setViewingStatuses({ username: user, items: myStatuses, currentIndex: 0, isPaused: false });
                    setStatusProgress(0);
                  } else {
                    setShowStatusMenu(!showStatusMenu);
                  }
                }}>
                  <div className="profile-avatar">
                    <img src={currentUserData?.profilePic || `https://ui-avatars.com/api/?name=${user}&background=${getAvatarColor(user)}&color=fff&bold=true`} alt="My Status" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    {statuses.filter(s => s.username === user).length === 0 && <div className="status-add-badge"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="#fff" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg></div>}
                  </div>
                  <div className="user-info" style={{ borderBottom: 'none' }}>
                    <div className="uname" style={{ fontSize: '17px' }}>My status</div>
                    <div className="umsg">{statuses.filter(s => s.username === user).length > 0 ? `${statuses.filter(s => s.username === user).length} updates` : 'Click to add status update'}</div>
                  </div>
                  {showStatusMenu && (
                    <div className="dropdown-menu picker-right" style={{ top: '60px', left: '60px', zIndex: 100 }}>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setShowStatusMenu(false); document.getElementById('statusFileInput').click(); }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                        <span>Photos & videos</span>
                      </div>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setShowStatusMenu(false); handleStatusTextTrigger(); }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                        <span>Text</span>
                      </div>
                    </div>
                  )}
                  <input type="file" id="statusFileInput" style={{ display: 'none' }} accept="image/*,video/*" onChange={handleStatusFileSelect} onClick={e => e.stopPropagation()} />
                </div>

                {statuses.length > 0 && <div className="status-section-title">Recent</div>}
                <div className="status-list-scroll">
                  {[...new Set(statuses.map(s => s.username))].map(uname => {
                    if (uname === user) return null; // Can filter out user if you want, but WhatsApp allows viewing own. Let's keep it if we want.
                    const userStatMap = statuses.filter(s => s.username === uname);
                    if (userStatMap.length === 0) return null;
                    const latest = userStatMap[userStatMap.length - 1];
                    const statUser = users.find(u => u.username === uname);
                    return (
                      <div key={uname} className="user-item" onClick={() => {
                        setViewingStatuses({ username: uname, items: userStatMap, currentIndex: 0, isPaused: false });
                        setStatusProgress(0);
                      }}>
                        <div className="profile-avatar status-ring">
                          <img src={statUser?.profilePic || `https://ui-avatars.com/api/?name=${uname}&background=${getAvatarColor(uname)}&color=fff&bold=true`} alt="status" style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover', padding: '2px' }} />
                        </div>
                        <div className="user-info">
                          <div className="uname">{statUser?.displayName || uname}</div>
                          <div className="umsg">{new Date(latest.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Forward Modal */}
            {forwardingMsg && (
              <div className="forward-modal-overlay" onClick={() => setForwardingMsg(null)}>
                <div className="forward-modal" onClick={e => e.stopPropagation()}>
                  <div className="forward-header">
                    <span>Forward message to...</span>
                    <button className="banner-close" onClick={() => setForwardingMsg(null)}>
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                    </button>
                  </div>
                  <div className="forward-list">
                    {users.filter(u => u.username !== user && u.username !== 'Meta AI').map(u => (
                      <div key={u.username} className="user-item" onClick={() => {
                        socket.emit('send_message', {
                          sender: user, receiver: u.username,
                          text: forwardingMsg.text,
                          file: forwardingMsg.file,
                          fileType: forwardingMsg.fileType,
                          fileName: forwardingMsg.fileName
                        });
                        setForwardingMsg(null);
                        setSelectedUser(u.username);
                      }}>
                        <div className="profile-avatar small">
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#dfe5e7', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#fff" d="M12 11.52c1.9 0 3.44-1.54 3.44-3.44S13.9 4.64 12 4.64 8.56 6.18 8.56 8.08s1.54 3.44 3.44 3.44zm0 1.91c-2.54 0-7.61 1.28-7.61 3.82V19.3h15.22v-2.05c0-2.54-5.07-3.82-7.61-3.82z" /></svg>
                          </div>
                        </div>
                        <div className="user-info"><span className="uname">{u.username}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. CHAT WINDOW / SETTINGS RIGHT PANE ──────────────────────────── */}
            <div className="main-pane" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', backgroundColor: '#f0f2f5' }}>
              {activeNav === 'status' ? (
                <div className="status-viewer-wrapper">
                  <div className="status-empty-box">
                    <svg viewBox="0 0 24 24" width="80" height="80" style={{ marginBottom: '30px' }}><path fill="#bfc6c9" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                    <h2>Share status updates</h2>
                    <p>Share photos, videos and text that disappear after 24 hours.</p>
                    <div className="enc-footer"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="#8696a0" d="M12 2a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" /></svg><span>Your status updates are end-to-end encrypted</span></div>
                  </div>
                </div>
              ) : showSettings ? (
                <div className="settings-detail-pane">
                  {selectedSetting === 'blocked' ? (
                    <div className="settings-blocked-list">
                      <h2>Blocked contacts</h2>
                      {blockedUsers.length === 0 ? (
                        <div style={{ color: '#8696a0', padding: '20px 30px', fontSize: '15px' }}>No blocked contacts.</div>
                      ) : (
                        blockedUsers.map(u => (
                          <div key={u} className="blocked-user-row">
                            <div className="ci-avatar-wrapper" style={{ width: '50px', height: '50px', marginBottom: 0, flexShrink: 0 }}>
                              <img src={users.find(usr => usr.username === u)?.profilePic || `https://ui-avatars.com/api/?name=${u}&background=${getAvatarColor(u)}&color=fff&bold=true`} alt="Profile" />
                            </div>
                            <span>{users.find(usr => usr.username === u)?.displayName || u}</span>
                            <button onClick={() => toggleArrayState(u, null, setBlockedUsers, 'wa_block')}>Unblock</button>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="settings-empty-state">
                      <svg viewBox="0 0 24 24" width="60" height="60"><path fill="#c8cfd4" d="M12 15.516c-1.922 0-3.516-1.594-3.516-3.516S10.078 8.484 12 8.484 15.516 10.078 15.516 12 13.922 15.516 12 15.516zm7.453-2.36a7.3 7.3 0 0 0 .063-.938v-.047a7.3 7.3 0 0 0-.063-.937l2.016-1.547a.47.47 0 0 0 .11-.61l-1.922-3.234a.48.48 0 0 0-.594-.203l-2.375.938a7.8 7.8 0 0 0-1.64-.938l-.36-2.484A.47.47 0 0 0 14.22 3h-3.843a.47.47 0 0 0-.47.375l-.36 2.5a7.8 7.8 0 0 0-1.624.937l-2.39-.937a.47.47 0 0 0-.594.203L3.016 9.31a.46.46 0 0 0 .11.61l2.016 1.547a7 7 0 0 0-.063.937v.047c0 .313.016.625.063.938L3.125 14.92a.47.47 0 0 0-.11.61l1.922 3.234a.48.48 0 0 0 .594.203l2.375-.938c.5.36 1.047.672 1.64.938l.36 2.484c.063.219.25.375.47.375h3.843a.47.47 0 0 0 .47-.375l.36-2.5c.578-.265 1.125-.578 1.625-.937l2.39.937a.47.47 0 0 0 .594-.203l1.922-3.25a.46.46 0 0 0-.11-.61z" /></svg>
                      <h2>Settings</h2>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="chat-window" style={{ position: 'relative', flex: showContactInfo ? 1 : 'none', width: showContactInfo ? 'auto' : '100%', borderRight: showContactInfo ? '1px solid var(--border)' : 'none' }}>
                    {pinnedMsg && (
                      <div className="chat-pinned-msg" style={{ position: 'absolute', top: '60px', left: '0', right: '0', background: 'var(--white)', zIndex: 70, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" style={{ color: 'var(--t2)' }}><path fill="currentColor" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '13px', overflow: 'hidden' }}>
                          <span style={{ color: 'var(--teal)', fontWeight: 500 }}>{pinnedMsg.sender}</span>
                          <span style={{ color: 'var(--t1)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{pinnedMsg.text || 'Pinned Action'}</span>
                        </div>
                        <button className="banner-close" onClick={() => setPinnedMsg(null)}><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg></button>
                      </div>
                    )}
                    {selectedUser ? (
                      <>
                        {/* Chat header */}
                        <div className="chat-header" onClick={() => { if (selectedUser !== 'Meta AI') setShowContactInfo(!showContactInfo); }} style={{ cursor: 'pointer' }}>
                          <div className="chat-header-left"
                            onClick={(e) => { if (window.innerWidth <= 768) { e.stopPropagation(); setSelectedUser(null); } }}>
                            <button className="mobile-back-btn">
                              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                            </button>
                            <div className={`profile-avatar small ${selectedUser === 'Meta AI' ? 'meta-circle' : ''}`}>
                              {selectedUser === 'Meta AI'
                                ? <div className="meta-gradient"></div>
                                : <div style={{ width: '100%', height: '100%', backgroundColor: '#dfe5e7', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={users.find(u => u.username === selectedUser)?.profilePic || `https://ui-avatars.com/api/?name=${selectedUser}&background=${getAvatarColor(selectedUser)}&color=fff&bold=true`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              }
                            </div>
                            <div className="chat-header-info">
                              <h4>{users.find(u => u.username === selectedUser)?.displayName || selectedUser}</h4>
                              <p className={`online-status ${isOppositeUserTyping || isTyping ? 'typing-text' : ''}`}>
                                {typingUsers[selectedUser]
                                  ? <span style={{ color: 'var(--teal)', fontWeight: 500 }}>typing...</span>
                                  : (selectedUser === 'Meta AI' ? 'Llama 3 powered' : (users.find(u => u.username === selectedUser)?.bio || 'online'))}
                              </p>
                            </div>
                          </div>
                          <div className="chat-header-right" style={{ display: 'flex', gap: '8px' }}>
                            {selectedUser !== 'Meta AI' && (
                              <button className="icon-btn" title="Favourite" onClick={() => toggleFavorite(selectedUser)}>
                                <svg viewBox="0 0 24 24" width="22" height="22" className="header-icon">
                                  {favorites.includes(selectedUser) ? (
                                    <path fill="var(--teal)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  ) : (
                                    <path fill="currentColor" d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5zm0-2.33l-2.91 1.76.77-3.3-2.57-2.22 3.38-.29 1.33-3.12 1.33 3.12 3.38.29-2.57 2.22.77 3.3-2.91-1.76z" />
                                  )}
                                </svg>
                              </button>
                            )}
                            <button className="icon-btn" title="Video call">
                              <svg viewBox="0 0 24 24" width="24" height="24" className="header-icon"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                            </button>
                            <button className="icon-btn" title="Search">
                              <svg viewBox="0 0 24 24" width="24" height="24" className="header-icon"><path fill="currentColor" d="M15.009 13.805h-.636l-.227-.217c.789-.918 1.264-2.11 1.264-3.414 0-2.969-2.406-5.375-5.375-5.375s-5.375 2.406-5.375 5.375 2.406 5.375 5.375 5.375c1.305 0 2.496-.475 3.414-1.264l.217.227v.636l4.031 4.023 1.203-1.203-4.023-4.031zm-5.375 0c-1.984 0-3.594-1.61-3.594-3.594s1.61-3.594 3.594-3.594 3.594 1.61 3.594 3.594-1.61 3.594-3.594 3.594z" /></svg>
                            </button>
                            <button className="icon-btn" title="Menu">
                              <svg viewBox="0 0 24 24" width="24" height="24" className="header-icon"><path fill="currentColor" d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-area">
                          {messages.map((m, i) => {
                            const isSent = m.sender === user;
                            const key = m._id || m.timestamp || i;

                            // Date Divider Logic
                            const msgDateStr = new Date(m.timestamp).toDateString();
                            const prevDateStr = i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : null;
                            const showDateDivider = msgDateStr !== prevDateStr;
                            let dateLabel = msgDateStr;
                            const now = new Date();
                            if (msgDateStr === now.toDateString()) dateLabel = 'Today';
                            else {
                              const y = new Date(now); y.setDate(now.getDate() - 1);
                              if (msgDateStr === y.toDateString()) dateLabel = 'Yesterday';
                              else dateLabel = new Date(m.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
                            }

                            return (
                              <React.Fragment key={key}>
                                {showDateDivider && <div className="date-divider"><span>{dateLabel}</span></div>}
                                <div
                                  className={`msg-row ${isSent ? 'row-sent' : 'row-recv'}`}
                                  style={{ zIndex: (activeMsgMenu === key || (reactingMsg && reactingMsg._id === m._id)) ? 100 : 1 }}
                                >
                                  {/* Swipe reply hint arrow */}
                                  <div className="swipe-hint">
                                    <svg viewBox="0 0 24 24" width="17" height="17">
                                      <path fill="#8696a0" d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                                    </svg>
                                  </div>

                                  {/* Group Member Avatar */}
                                  {!isSent && users.find(u => u.username === selectedUser)?.isGroup && (
                                    <div className="msg-avatar" style={{ alignSelf: 'flex-start', marginRight: '8px', marginTop: '2px', cursor: 'pointer' }}>
                                      <img src={users.find(u => u.username === m.sender)?.profilePic || `https://ui-avatars.com/api/?name=${m.sender}&background=${getAvatarColor(m.sender)}&color=fff&bold=true`} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                    </div>
                                  )}

                                  {/* Bubble */}
                                  <div
                                    className={`message ${isSent ? 'sent' : 'received'} ${m.sender === 'Meta AI' ? 'meta-msg' : ''} ${m.file && m.fileType === 'image' && !m.text ? 'image-only' : ''}`}
                                    ref={el => { bubbleRefs.current[key] = el; }}
                                    onTouchStart={e => onTouchStart(e, key)}
                                    onTouchMove={e => onTouchMove(e, key, isSent)}
                                    onTouchEnd={e => onTouchEnd(e, key, isSent, m)}
                                    onMouseDown={e => onMouseDown(e, key)}
                                    onMouseMove={e => onMouseMove(e, key, isSent)}
                                    onMouseUp={e => onMouseUp(e, key, isSent, m)}
                                    onMouseLeave={e => { if (isDragging.current[key]) onMouseUp(e, key, isSent, m); }}
                                  >
                                    {/* Group Sender Name */}
                                    {!isSent && users.find(u => u.username === selectedUser)?.isGroup && (
                                      <div style={{
                                        color: ['#e542a3', '#91ab01', '#029d00', '#dfb610', '#007fac', '#1f7aec', '#b04632', '#009041', '#e06226', '#b44eab'][Math.abs(m.sender.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 10],
                                        fontSize: '12.5px', fontWeight: 500, marginBottom: '3px', lineHeight: '14px', cursor: 'pointer'
                                      }}>
                                        ~{users.find(u => u.username === m.sender)?.displayName || m.sender}
                                      </div>
                                    )}

                                    {/* Reply preview */}
                                    {m.replyTo && (
                                      <div className="reply-bubble">
                                        <span className="reply-bubble-sender">{m.replyTo.sender === user ? 'You' : m.replyTo.sender}</span>
                                        <span className="reply-bubble-text">
                                          {m.replyTo.fileType === 'image' ? '📷 Photo' :
                                            m.replyTo.fileType === 'file' ? '📄 Document' :
                                              m.replyTo.text}
                                        </span>
                                      </div>
                                    )}

                                    {m.file && m.fileType === 'image' && (
                                      <div className="image-msg-wrapper">
                                        <img src={m.file} alt="img" className="chat-image" />
                                        {!m.text && (
                                          <div className="image-msg-meta">
                                            <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</span>
                                            {isSent && (
                                              <span className="msg-status">
                                                <svg viewBox="0 0 16 15" width="16" height="15" className={(m.isRead || m.receiver === 'Meta AI') ? 'tick-blue' : 'tick-grey'}>
                                                  {(m.isRead || m.receiver === 'Meta AI') ? (
                                                    <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424zm-4.73 0l-.479-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                                  ) : (
                                                    <path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                                  )}
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {m.file && m.fileType === 'file' &&
                                      <div className="file-attachment">
                                        <a href={m.file} download={m.fileName}>📄 {m.fileName}</a>
                                      </div>}
                                    {m.file && m.fileType === 'audio' && (
                                      <div className="audio-msg">
                                        <audio controls src={m.file} className="custom-audio-player" />
                                      </div>
                                    )}
                                    {m.text && <p className="msg-text">{m.text}</p>}

                                    {!(m.file && m.fileType === 'image' && !m.text) && (
                                      <div className="msg-meta">
                                        {m.isEdited && <span className="edited-tag">edited</span>}
                                        <span className="msg-time">{new Date(m.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</span>
                                        {isSent && (
                                          <span className="msg-status">
                                            <svg viewBox="0 0 16 15" width="16" height="15" className={(m.isRead || m.receiver === 'Meta AI') ? 'tick-blue' : 'tick-grey'}>
                                              {(m.isRead || m.receiver === 'Meta AI') ? (
                                                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424zm-4.73 0l-.479-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                              ) : (
                                                <path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L3.935 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.318.318 0 0 0 .036.46l1.51 1.366c.14.127.345.127.484 0l6.059-7.789a.32.32 0 0 0-.04-.424z" />
                                              )}
                                            </svg>
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Display attached reaction */}
                                    {m.reaction && <div className="msg-reaction">{m.reaction}</div>}

                                    {/* Reaction picker mapped to this message */}
                                    {reactingMsg && reactingMsg._id === m._id && (
                                      <div className={`reaction-picker-container ${isSent ? 'picker-right' : 'picker-left'}`} onMouseDown={e => e.stopPropagation()}>
                                        <EmojiPicker
                                          onEmojiClick={(em) => {
                                            if (m._id) { socket.emit('react_message', { messageId: m._id, reaction: em.emoji, receiver: selectedUser, sender: user }); }
                                            setMessages(prev => prev.map(msg => msg._id === m._id ? { ...msg, reaction: em.emoji } : msg));
                                            setReactingMsg(null);
                                          }}
                                          reactionsDefaultOpen={true}
                                        />
                                      </div>
                                    )}

                                    {/* Reaction and Menu Buttons */}
                                    <div className="msg-react-btn" onClick={(e) => { e.stopPropagation(); setReactingMsg(m); }}>
                                      <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" /></svg>
                                    </div>
                                    <div className="msg-menu-btn" onClick={(e) => { e.stopPropagation(); setActiveMsgMenu(activeMsgMenu === key ? null : key); }}>
                                      <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6-6-6L7.4 8z" /></svg>
                                    </div>

                                    {activeMsgMenu === key && (
                                      <div className={`dropdown-menu ${isSent ? 'picker-right' : 'picker-left'}`} onMouseDown={e => e.stopPropagation()}>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); startReply(m); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M4 11.2l6-6 1.4 1.4-3.6 3.6H18c2.2 0 4 1.8 4 4v4h-2v-4c0-1.1-.9-2-2-2H7.9l3.6 3.6-1.4 1.4-6-6z" /></svg>
                                          <span>Reply</span>
                                        </div>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setReactingMsg(m); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" /></svg>
                                          <span>React</span>
                                        </div>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setForwardingMsg(m); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M19.8 11.2l-6-6-1.4 1.4 3.6 3.6H6c-2.2 0-4 1.8-4 4v4h2v-4c0-1.1.9-2 2-2h10.1l-3.6 3.6 1.4 1.4 6-6z" /></svg>
                                          <span>Forward</span>
                                        </div>
                                        {m.text && <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(m.text); alert('Copied to clipboard!'); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                                          <span>Copy</span>
                                        </div>}
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                                          <span>Pin</span>
                                        </div>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); toggleStar(key); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" /></svg>
                                          <span>{starredMsgs.includes(key) ? 'Unstar' : 'Star'}</span>
                                        </div>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); if (m._id) { socket.emit('delete_message', m._id); } setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                                          <span>Delete</span>
                                        </div>
                                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveMsgMenu(null); }}>
                                          <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                                          <span>Message info</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Reply banner */}
                        {replyTo && (
                          <div className="action-banner reply-color">
                            <div className="banner-bar"></div>
                            <div className="banner-body">
                              <span className="banner-title">{replyTo.sender === user ? 'You' : replyTo.sender}</span>
                              <span className="banner-preview">
                                {replyTo.fileType === 'image' ? '📷 Photo' :
                                  replyTo.fileType === 'file' ? '📄 Document' :
                                    replyTo.text}
                              </span>
                            </div>
                            <button className="banner-close" onClick={cancelReply}>
                              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                            </button>
                          </div>
                        )}

                        {/* Edit banner */}
                        {editingMsg && (
                          <div className="action-banner edit-color">
                            <div className="banner-bar"></div>
                            <div className="banner-body">
                              <span className="banner-title">Edit message</span>
                              <span className="banner-preview">{editingMsg.text}</span>
                            </div>
                            <button className="banner-close" onClick={cancelEdit}>
                              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                            </button>
                          </div>
                        )}

                        {/* Input */}
                        {blockedUsers.includes(selectedUser) ? (
                          <div className="blocked-banner" style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--panel-color)', color: 'var(--t2)', fontSize: '15px', borderTop: '1px solid var(--border)' }}>
                            You blocked this contact. <span style={{ color: 'var(--teal)', cursor: 'pointer' }} onClick={() => toggleArrayState(selectedUser, null, setBlockedUsers, 'wa_block')}>Tap to unblock.</span>
                          </div>
                        ) : (
                          <div className="input-area-wrapper">
                            {showEmojiPicker && (
                              <div className="emoji-picker-popup">
                                <EmojiPicker onEmojiClick={(em) => setInput(prev => prev + em.emoji)} />
                              </div>
                            )}
                            {showAttachMenu && (
                              <div className="attach-menu">
                                <div className="attach-item" onClick={() => { fileInputRef.current.accept = "*"; fileInputRef.current.click(); setShowAttachMenu(false); }}>
                                  <div className="attach-icon bg-doc"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg></div>
                                  <span>Document</span>
                                </div>
                                <div className="attach-item" onClick={() => { fileInputRef.current.accept = "image/*,video/*"; fileInputRef.current.click(); setShowAttachMenu(false); }}>
                                  <div className="attach-icon bg-photo"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg></div>
                                  <span>Photos & videos</span>
                                </div>
                                <div className="attach-item">
                                  <div className="attach-icon bg-camera"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1zM21.54 9c-.92-2.92-3.15-5.26-6.16-6.32l-3.66 6.35h9.82zM12 22c2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.06.1-4.77 8.26c.7.15 1.42.24 2.17.24zm-6.16-4.68l3.66-6.35H-.46C.46 13.92 2.69 16.26 5.7 17.32z" /></svg></div>
                                  <span>Camera</span>
                                </div>
                                <div className="attach-item">
                                  <div className="attach-icon bg-audio"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg></div>
                                  <span>Audio</span>
                                </div>
                              </div>
                            )}

                            <div className="input-area">
                              <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                                onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx,.txt" />
                              <button className={`icon-btn ${showAttachMenu ? 'active-icon' : ''}`} onClick={() => setShowAttachMenu(!showAttachMenu)} title="Attach">
                                <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                              </button>
                              <button className={`icon-btn ${showEmojiPicker ? 'active-icon' : ''}`} onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Emoji">
                                <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" /></svg>
                              </button>

                              {isRecording ? (
                                <div className="recording-bar">
                                  <div className="record-pulse"></div>
                                  <span className="record-time">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                                </div>
                              ) : (
                                <input
                                  ref={inputRef}
                                  value={input}
                                  onChange={handleInputChange}
                                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                  placeholder={editingMsg ? 'Edit message…' : 'Type a message…'}
                                  onFocus={() => { setShowEmojiPicker(false); setShowAttachMenu(false); }}
                                />
                              )}

                              {isRecording ? (
                                <button className="icon-btn stop-rec-btn" onClick={stopRecording} title="Send voice message">
                                  <svg viewBox="0 0 24 24" height="24" width="24" style={{ color: '#d32f2f' }}><path fill="currentColor" d="M16 8v8H8V8h8zm0-2H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" /></svg>
                                </button>
                              ) : input.trim() ? (
                                <button className="icon-btn" onClick={sendMessage} title="Send">
                                  <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" /></svg>
                                </button>
                              ) : (
                                <button className="icon-btn" onClick={startRecording} title="Voice message">
                                  <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.53 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z" /></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* No chat selected */
                      <div className="no-chat">
                        <div className="no-chat-card">
                          {/* Laptop illustration */}
                          <svg viewBox="0 0 220 170" width="200" height="154" style={{ marginBottom: 8 }}>
                            <rect x="20" y="12" width="180" height="118" rx="10" fill="#e8f5e9" stroke="#c8e6c9" strokeWidth="2" />
                            <rect x="32" y="24" width="156" height="94" rx="5" fill="#fff" />
                            <rect x="48" y="38" width="60" height="70" rx="4" fill="#e8f5e9" />
                            <rect x="118" y="38" width="58" height="32" rx="4" fill="#e8f5e9" />
                            <rect x="118" y="78" width="58" height="30" rx="4" fill="#e8f5e9" />
                            <path d="M0 136 h220 l-18 22 H18 Z" fill="#dde1e7" />
                            <rect x="90" y="136" width="40" height="7" rx="3.5" fill="#c5c9d0" />
                            <circle cx="136" cy="56" r="16" fill="#25d366" />
                            <path d="M130 56l5 5 9-9" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <h2 className="no-chat-title">Download WhatsApp for Windows</h2>
                          <p className="no-chat-desc">Get extra features like voice and video calling,<br />screen sharing and more.</p>
                          <button className="dl-btn">Download</button>

                          <div className="quick-actions">
                            <div className="qa-btn" onClick={() => fileInputRef.current?.click()}>
                              <svg viewBox="0 0 24 24" width="26" height="26"><path fill="#54656f" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>
                              <span>Send document</span>
                            </div>
                            <div className="qa-btn">
                              <svg viewBox="0 0 24 24" width="26" height="26"><path fill="#54656f" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                              <span>Add contact</span>
                            </div>
                            <div className="qa-btn" onClick={() => setSelectedUser('Meta AI')}>
                              <div className="meta-sm-icon"></div>
                              <span>Ask Meta AI</span>
                            </div>
                          </div>
                        </div>

                        <div className="enc-footer">
                          <svg viewBox="0 0 24 24" width="12" height="12"><path fill="#8696a0" d="M12 2a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" /></svg>
                          <span>Your personal messages are end-to-end encrypted</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── 4. CONTACT INFO SIDEBAR ───────────────────────── */}
                  {showContactInfo && selectedUser && selectedUser !== 'Meta AI' && (
                    <div className="contact-info-sidebar">
                      <div className="ci-header">
                        <button className="icon-btn" onClick={() => setShowContactInfo(false)}>
                          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        </button>
                        <h2>Contact info</h2>
                      </div>

                      <div className="ci-scroll">
                        <div className="ci-profile-section">
                          <div className="ci-avatar-wrapper">
                            <img src={users.find(u => u.username === selectedUser)?.profilePic || `https://ui-avatars.com/api/?name=${selectedUser}&background=${getAvatarColor(selectedUser)}&color=fff&bold=true`} alt="Profile" />
                          </div>
                          <h2>{users.find(u => u.username === selectedUser)?.displayName || selectedUser}</h2>
                          <p>{users.find(u => u.username === selectedUser)?.mobile || '+00 0000 0000'}</p>

                          <div className="ci-search-btn">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.009 13.805h-.636l-.227-.217c.789-.918 1.264-2.11 1.264-3.414 0-2.969-2.406-5.375-5.375-5.375s-5.375 2.406-5.375 5.375 2.406 5.375 5.375 5.375c1.305 0 2.496-.475 3.414-1.264l.217.227v.636l4.031 4.023 1.203-1.203-4.023-4.031zm-5.375 0c-1.984 0-3.594-1.61-3.594-3.594s1.61-3.594 3.594-3.594 3.594 1.61 3.594 3.594-1.61 3.594-3.594 3.594z" /></svg>
                            <span>Search</span>
                          </div>
                        </div>

                        {users.find(u => u.username === selectedUser)?.isGroup && (
                          <div className="ci-section" style={{ padding: 0 }}>
                            {showAddMemberModal ? (
                              <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                                  <button className="icon-btn" onClick={() => setShowAddMemberModal(false)}><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></button>
                                  <h2 style={{ fontSize: '16px', margin: 0 }}>Add members</h2>
                                </div>
                                {users.filter(u => !u.isGroup && u.username !== user && !(users.find(x => x.username === selectedUser)?.members || []).includes(u.username)).map(u => (
                                  <div key={u.username} className="user-item" onClick={() => handleAddMember(u.username)}>
                                    <div className="profile-avatar"><img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.username}&background=${getAvatarColor(u.username)}&color=fff&bold=true`} alt="Profile" /></div>
                                    <div className="user-info"><div className="uname" style={{ fontSize: '16px' }}>{u.displayName || u.username}</div></div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                <div style={{ padding: '14px 30px', color: '#111b21', fontSize: '14px' }}>{users.find(u => u.username === selectedUser)?.members?.length || 0} members</div>
                                <div className="user-item" onClick={() => setShowAddMemberModal(true)}>
                                  <div className="profile-avatar" style={{ backgroundColor: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm4 9h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" /></svg>
                                  </div>
                                  <div className="user-info" style={{ borderBottom: 'none' }}>
                                    <div className="uname" style={{ fontSize: '16px' }}>Add member</div>
                                  </div>
                                </div>
                                {(users.find(u => u.username === selectedUser)?.members || []).map(mUsername => {
                                  const mUser = users.find(x => x.username === mUsername);
                                  return (
                                    <div key={mUsername} className="user-item" style={{ cursor: 'default' }}>
                                      <div className="profile-avatar"><img src={mUser?.profilePic || `https://ui-avatars.com/api/?name=${mUsername}&background=${getAvatarColor(mUsername)}&color=fff&bold=true`} alt="Profile" /></div>
                                      <div className="user-info">
                                        <div className="uname" style={{ fontSize: '16px' }}>{mUser?.displayName || mUsername} {mUsername === user ? '(You)' : ''}</div>
                                        <div className="umsg">{mUser?.bio || 'Hey there! I am using WhatsApp.'}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        )}

                        <div className="ci-section">
                          <p className="ci-label">About</p>
                          <div className="ci-value">{users.find(u => u.username === selectedUser)?.bio || 'Hey there! I am using WhatsApp.'}</div>
                        </div>

                        <div className="ci-section">
                          <div className="ci-action-row" style={{ borderBottom: 'none' }}>
                            <span>Media, links and docs</span>
                            <span style={{ fontSize: '14px', color: '#8696a0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {messages.filter(m => (m.sender === selectedUser || m.receiver === selectedUser) && m.file).length}
                              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                            </span>
                          </div>
                          <div className="ci-media-grid">
                            {messages.filter(m => (m.sender === selectedUser || m.receiver === selectedUser) && m.file && m.fileType === 'image').slice(0, 3).map((m, i) => (
                              <img key={i} src={m.file} alt="media" />
                            ))}
                          </div>
                        </div>

                        <div className="ci-section">
                          <div className="ci-action-row">
                            <span>Starred messages</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" style={{ color: '#8696a0' }}><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                          </div>
                        </div>

                        <div className="ci-section">
                          <div className="ci-action-row" onClick={() => toggleArrayState(selectedUser, null, setMutedUsers, 'wa_mute')}>
                            <span>Mute notifications</span>
                            <input type="checkbox" checked={mutedUsers.includes(selectedUser)} readOnly />
                          </div>
                          <div className="ci-action-row" onClick={() => toggleFavorite(selectedUser)}>
                            <span>{favorites.includes(selectedUser) ? 'Remove from favourites' : 'Add to favourites'}</span>
                            <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                          </div>
                        </div>

                        <div className="ci-section ci-destructive">
                          {users.find(u => u.username === selectedUser)?.isGroup ? (
                            <>
                              <div className="ci-action-row text-red" onClick={clearChat}>
                                <span>Clear chat</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 16h4v2h-4v-2zm0-8h7v2h-7V8zm0 4h6v2h-6v-2zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12V5z" /></svg>
                              </div>
                              <div className="ci-action-row text-red" onClick={handleExitGroup}>
                                <span>Exit group</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-9-2l6-6-6-6v4H6v4h4v4z" /></svg>
                              </div>
                              <div className="ci-action-row text-red" onClick={() => alert('Group reported.')}>
                                <span>Report group</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 3H6c-.55 0-1 .45-1 1v15c0 .55.45 1 1 1s1-.45 1-1v-6h5.33l.4-1H19c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1h-3.6z" /></svg>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="ci-action-row text-red" onClick={clearChat}>
                                <span>Clear chat</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 16h4v2h-4v-2zm0-8h7v2h-7V8zm0 4h6v2h-6v-2zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12V5z" /></svg>
                              </div>
                              <div className="ci-action-row text-red" onClick={() => { toggleArrayState(selectedUser, null, setBlockedUsers, 'wa_block'); setShowContactInfo(false); }}>
                                <span>{blockedUsers.includes(selectedUser) ? `Unblock ${selectedUser}` : `Block ${selectedUser}`}</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" /></svg>
                              </div>
                              <div className="ci-action-row text-red" onClick={() => { if (window.confirm('Delete chat?')) { clearChat(); setSelectedUser(null); setShowContactInfo(false); } }}>
                                <span>Delete chat</span>
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        ) : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
  );
}

export default App;
