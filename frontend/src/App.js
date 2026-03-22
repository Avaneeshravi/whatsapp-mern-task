/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WhatsApp Web â€” Professional Replica
   Complete, no conflicts, no missing rules
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ TOKENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
:root {
  --teal: #00a884;
  --teal-dk: #008f72;
  --green: #25d366;
  --dark: #075e54;
  --sent-bg: #d9fdd3;
  --recv-bg: #ffffff;
  --bg: #f0f2f5;
  --chat-bg: #efeae2;
  --blue-tick: #53bdeb;
  --gray-tick: #8696a0;
  --t1: #111b21;
  --t2: #667781;
  --border: #e9edef;
  --hover: #f5f6f6;
  --active-bg: #ebebeb;
  --white: #ffffff;
  --shadow-msg: 0 1px 0.5px rgba(11, 20, 26, .13);
  --radius-msg: 7.5px;
}

/* â”€â”€ RESET â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, Ubuntu, sans-serif;
  background: #dadbd3;
  color: var(--t1);
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input {
  font-family: inherit;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   AUTH
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(180deg, var(--dark) 0 33%, var(--bg) 33%);
}

.auth-form {
  background: var(--white);
  padding: 48px 40px 36px;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .18);
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.auth-logo h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--dark);
}

.auth-sub {
  font-size: 13px;
  color: var(--t2);
  margin-bottom: 24px;
}

.auth-form input {
  width: 100%;
  padding: 11px 14px;
  margin-bottom: 12px;
  border: 1.5px solid #d1d7db;
  border-radius: 8px;
  font-size: 15px;
  color: var(--t1);
  outline: none;
  transition: border-color .2s;
}

.auth-form input:focus {
  border-color: var(--teal);
}

.auth-form>button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: var(--green);
  color: #fff;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .8px;
  text-transform: uppercase;
  margin-top: 6px;
  transition: background .2s, transform .1s;
}

.auth-form>button[type="submit"]:hover {
  background: #22c55e;
}

.auth-form>button[type="submit"]:active {
  transform: scale(.98);
}

.toggle-auth {
  display: block;
  margin-top: 18px;
  font-size: 13.5px;
  color: var(--teal);
  cursor: pointer;
}

.toggle-auth:hover {
  text-decoration: underline;
}

.error-text {
  color: #e53935;
  font-size: 12.5px;
  width: 100%;
  margin-top: -6px;
  margin-bottom: 12px;
  text-align: left;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SHELL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--white);
}

.mobile-only {
  display: none !important;
}

/* ——————————————————————————————————————————————————————————————————
   NAV RAIL  (far left, 60 px)
—————————————————————————————————————————————————————————————————— */
.nav-rail {
  width: 60px;
  height: 100vh;
  background: var(--white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 14px;
  flex-shrink: 0;
  z-index: 10;
}

.nav-rail-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-rail-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: auto;
}

.nav-label {
  display: none;
}

.nav-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  border-radius: 50%;
  transition: background .15s;
  position: relative;
}

.nav-icon:hover {
  background: #f0f2f5;
}

.nav-icon.active {
  background: #f0f2f5;
  color: var(--t1);
}

/* Active chats tab — green dot indicator */
.nav-icon.active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--teal);
  border-radius: 50%;
}

.meta-gradient-nav {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3dd1ff 0%, #4d55ff 50%, #b245ff 100%);
}



.profile-nav-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* ——————————————————————————————————————————————————————————————————
   SIDEBAR  (chat list)
—————————————————————————————————————————————————————————————————— */
.sidebar {
  width: 380px;
  min-width: 300px;
  max-width: 420px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--white);
  flex-shrink: 0;
  overflow: hidden;
}

/* ——— Sidebar header ——— */
.sidebar-header {
  height: 60px;
  padding: 0 10px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  flex-shrink: 0;
  border-bottom: 1px solid transparent;
  /* spacing trick */
}

/* ——— Profile Sidebar ——— */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  background: #f0f2f5;
  animation: slideRight .2s ease-out;
}

@keyframes slideRight {
  from {
    transform: translateX(-10%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.status-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 16px;
  background: var(--white);
  color: var(--t1);
}

.status-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--t1);
  letter-spacing: -.2px;
}

.profile-header {
  background: #008069;
  height: 110px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 16px;
  gap: 20px;
  color: #fff;
}

.profile-header h2 {
  font-size: 19px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.profile-scroll {
  flex: 1;
  overflow-y: auto;
}

.profile-pic-section {
  display: flex;
  justify-content: center;
  padding: 28px 0;
}

.profile-pic-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #dfe5e7;
}

.profile-pic-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-pic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(84, 101, 111, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity .2s;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  gap: 8px;
  padding: 10px;
}

.profile-pic-wrapper:hover .profile-pic-overlay {
  opacity: 1;
}

.profile-section {
  background: #fff;
  padding: 14px 30px;
  box-shadow: 0 1px 3px rgba(11, 20, 26, .05);
}

.section-gap {
  margin-top: 10px;
}

.profile-label {
  color: var(--teal);
  font-size: 14px;
  margin-bottom: 12px;
}

.profile-value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  color: #3b4a54;
}

.profile-value-row span {
  flex: 1;
  word-break: break-word;
}

.profile-value-row button {
  color: #8696a0;
  padding: 4px;
}

.profile-value-row button:hover {
  color: var(--teal);
}

.pencil-icon {
  color: #8696a0;
}

.profile-edit-row {
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--teal);
  padding-bottom: 4px;
}

.profile-edit-row input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 17px;
  color: #3b4a54;
}

.profile-edit-row button {
  color: #8696a0;
  display: flex;
  align-items: center;
}

.profile-edit-row button:hover {
  color: var(--teal);
}

.profile-hint {
  display: block;
  font-size: 14px;
  color: #8696a0;
  margin-top: 14px;
}

/* ——— Contact Info Sidebar ——— */
.contact-info-sidebar {
  width: 400px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  animation: slideRight .2s ease-out;
  flex-shrink: 0;
  border-left: 1px solid var(--border);
}

.ci-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  background: #008069;
  color: #fff;
}

.ci-header h2 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.ci-scroll {
  flex: 1;
  overflow-y: auto;
}

.ci-profile-section {
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  box-shadow: 0 1px 3px rgba(11, 20, 26, .05);
  margin-bottom: 10px;
}

.ci-avatar-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
}

.ci-avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ci-profile-section h2 {
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 4px;
  color: #111b21;
}

.ci-profile-section p {
  font-size: 16px;
  color: #54656f;
  margin: 0;
}

.ci-search-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: var(--teal);
  cursor: pointer;
  padding: 10px 24px;
  border-radius: 10px;
  transition: background 0.2s;
}

.ci-search-btn:hover {
  background: #f5f6f6;
}

.ci-search-btn svg {
  margin-bottom: 8px;
  background: #f0f2f5;
  padding: 12px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
}

.ci-search-btn span {
  font-size: 14px;
}

.ci-media-grid {
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
  overflow-x: auto;
}

.ci-media-grid img {
  width: 90px;
  height: 90px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.ci-section {
  background: var(--white);
  padding: 14px 30px;
  box-shadow: 0 1px 3px rgba(11, 20, 26, .05);
  margin-bottom: 10px;
}

/* ——— Settings Sidebar ——— */
.settings-sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--white);
  animation: slideRight .2s ease-out;
}

.settings-header {
  height: 110px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 16px;
  gap: 20px;
  color: #fff;
  background: #008069;
  border-bottom: 1px solid var(--border);
}

.settings-header h2 {
  font-size: 19px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.settings-search {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--white);
}

.settings-search-box {
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 8px;
  padding: 6px 12px;
  gap: 8px;
}

.settings-search-box input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 14px;
}

.settings-profile-row {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 15px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}

.settings-profile-row:hover {
  background: #f5f6f6;
}

.settings-profile-row .profile-avatar {
  width: 82px;
  height: 82px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.settings-profile-row .profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings-list {
  flex: 1;
  overflow-y: auto;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
}

.settings-item:hover {
  background: #f5f6f6;
}

.settings-item-icon {
  color: #54656f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-item-text {
  display: flex;
  flex-direction: column;
}

.settings-item-text .title {
  font-size: 16px;
  color: #111b21;
}

.settings-item-text .desc {
  font-size: 14px;
  color: #54656f;
  margin-top: 2px;
}

.settings-item.active {
  background: #f0f2f5;
}

.settings-item.text-red .settings-item-icon,
.settings-item.text-red .settings-item-text .title {
  color: #ea0038;
}

/* ——— Settings Detail Pane ——— */
.settings-detail-pane {
  flex: 1;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
}

.settings-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8696a0;
}

.settings-empty-state svg {
  margin-bottom: 20px;
}

.settings-empty-state h2 {
  font-size: 28px;
  font-weight: 300;
  color: #41525d;
}

.settings-blocked-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--white);
}

.settings-blocked-list h2 {
  font-size: 19px;
  font-weight: 500;
  color: #111b21;
  padding: 24px 30px;
  margin: 0;
  border-bottom: 1px solid var(--border);
}

.blocked-user-row {
  display: flex;
  align-items: center;
  padding: 16px 30px;
  gap: 15px;
  border-bottom: 1px solid var(--border);
}

.blocked-user-row span {
  font-size: 16px;
  color: #111b21;
  flex: 1;
}

.blocked-user-row button {
  color: var(--teal);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
}

.blocked-user-row button:hover {
  background: #f0f2f5;
}

.ci-label {
  color: #54656f;
  font-size: 14px;
  margin-bottom: 8px;
}

/* ——— New Chat Sidebar ——— */
.new-chat-sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--white);
  animation: slideRight .2s ease-out;
}

.new-chat-header {
  height: 110px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 16px;
  gap: 20px;
  color: #fff;
  background: #008069;
}

.new-chat-header h2 {
  font-size: 19px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.new-chat-search {
  padding: 8px 12px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

.new-chat-search-box {
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 8px;
  padding: 6px 12px;
  gap: 8px;
}

.new-chat-search-box input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 14px;
}

.new-chat-scroll {
  flex: 1;
  overflow-y: auto;
}

.new-chat-action {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 15px;
  cursor: pointer;
}

.new-chat-action:hover {
  background: #f5f6f6;
}

.new-chat-icon {
  width: 49px;
  height: 49px;
  background: #008069;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.new-chat-text {
  font-size: 16px;
  color: #111b21;
}

/* ——— Group Selection Chips ——— */
.group-chips-container {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 16px;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.group-chip {
  display: flex;
  align-items: center;
  background: #e9edef;
  border-radius: 16px;
  padding: 4px 8px 4px 4px;
  gap: 6px;
}

.group-chip img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.group-chip span {
  font-size: 13px;
  color: #111b21;
}

.group-chip button {
  background: none;
  border: none;
  color: #8696a0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.group-fab {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #00a884;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border: none;
}

.group-fab:hover {
  background: #06cf9c;
}

/* ——— Group Detail Upload ——— */
.group-info-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  flex: 1;
  background: #f0f2f5;
}

.group-icon-upload {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #dfe5e7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
}

.group-icon-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-icon-overlay {
  position: absolute;
  inset: 0;
  background: rgba(84, 101, 111, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity .2s;
  text-align: center;
  gap: 8px;
}

.group-icon-upload:hover .group-icon-overlay {
  opacity: 1;
}

.group-name-input-container {
  width: 100%;
  border-bottom: 2px solid #008069;
}

.group-name-input-container input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 16px;
  outline: none;
  color: #111b21;
}

.ci-value {
  font-size: 17px;
  color: #111b21;
}

.status-section-title {
  padding: 24px 24px 12px;
  color: #54656f;
  font-size: 14px;
  background-color: white;
  border-top: 1px solid var(--border);
}

.ci-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  font-size: 17px;
  color: #111b21;
  border-bottom: 1px solid var(--border);
}

.ci-action-row:last-child {
  border-bottom: none;
}

.ci-action-row:hover {
  background: #f5f6f6;
  margin: 0 -30px;
  padding: 16px 30px;
}

.ci-action-row.text-red {
  color: #ea0038;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}

.sidebar-title {
  font-size: 19px;
  font-weight: 500;
  color: #00a884;
  letter-spacing: -.2px;
}

.sidebar-actions {
  display: flex;
  align-items: center;
  gap: 0;
}

.hdr-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  border-radius: 50%;
  transition: background .15s;
}

.hdr-btn:hover {
  background: var(--bg);
}

/* ——— Search ——— */
.search-wrap {
  padding: 7px 12px 0;
  background: var(--white);
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f2f5;
  height: 36px;
  border-radius: 8px;
  padding: 0 14px;
  color: var(--t2);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--t1);
  outline: none;
}

.search-box input::placeholder {
  color: var(--t2);
}

/* ——— Filter chips ——— */
.filter-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px 7px;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

.fchip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: 20px;
  background: #f0f2f5;
  color: #54656f;
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background .15s;
  line-height: 1;
}

.fchip:hover {
  background: #e3e5e8;
}

.fchip-on {
  background: #e7fce3;
  color: #008069;
}

.fchip-badge {
  background: var(--green);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 5px;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fchip-num {
  color: var(--t2);
  font-size: 12px;
}

.fchip-plus {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #54656f;
}

.fchip-plus:hover {
  background: #e3e5e8;
}

/* ——— Chat list ——— */
.user-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.user-list::-webkit-scrollbar {
  width: 5px;
}

.user-list::-webkit-scrollbar-thumb {
  background: #d1d7db;
  border-radius: 3px;
}

/* â”€â”€ Individual user row â”€â”€ */
.user-item {
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 16px 0 14px;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background .12s;
  position: relative;
}

.user-item:hover {
  background: var(--hover);
}

.user-item.active {
  background: var(--active-bg);
}

/* â”€â”€ Avatar â”€â”€ */
.profile-avatar {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.profile-avatar.small {
  width: 40px;
  height: 40px;
}

/* Meta AI gradient ring */
.meta-circle {
  border-radius: 50%;
  background: linear-gradient(135deg, #3dd1ff 0%, #4d55ff 50%, #b245ff 100%);
  padding: 2.5px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.meta-gradient {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1024px-Meta_Platforms_Inc._logo.svg.png');
  background-size: 58%;
  background-repeat: no-repeat;
  background-position: center;
}

/* â”€â”€ User info block â”€â”€ */
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
}

.user-info-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
}

.user-info-bot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
}

/* Name */
.uname {
  font-size: 16px;
  font-weight: 400;
  color: var(--t1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.uname-meta {
  color: #6d00cc;
  font-weight: 600;
}

/* Time â€” right-aligned, matches screenshot */
.utime {
  font-size: 11.5px;
  color: var(--t2);
  white-space: nowrap;
  flex-shrink: 0;
}

.utime-unread {
  color: var(--green);
  font-weight: 600;
}

/* Preview text */
.umsg {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 13.5px;
  color: var(--t2);
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.umsg-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.umsg-meta {
  font-size: 13px;
  color: var(--t2);
}

/* Double-tick SVG in list */
.tick-svg {
  flex-shrink: 0;
  color: var(--gray-tick);
}

.tick-svg.tick-blue {
  color: var(--blue-tick);
}

/* Unread badge */
.ubadge {
  background: var(--green);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  flex-shrink: 0;
  line-height: 1;
}

@keyframes popIn {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }

  70% {
    transform: scale(1.18);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: popIn .28s cubic-bezier(.34, 1.56, .64, 1) both;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CHAT WINDOW
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--chat-bg);
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-size: 412px 749px;
  min-width: 0;
  overflow: hidden;
}

/* â”€â”€ Chat header â”€â”€ */
.chat-header {
  height: 60px;
  padding: 0 6px 0 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 5;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
  transition: background .15s;
}

.chat-header-left:hover {
  background: rgba(0, 0, 0, .04);
}

.chat-header-info {
  min-width: 0;
}

.chat-header-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--t1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.online-status {
  margin: 0;
  font-size: 12.5px;
  color: var(--t2);
}

.online-status.typing-text {
  color: var(--teal);
  font-weight: 500;
}

.chat-header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-icon {
  color: #54656f;
  padding: 9px;
  border-radius: 50%;
  transition: background .15s;
  box-sizing: content-box;
}

.header-icon:hover {
  background: rgba(0, 0, 0, .06);
}

.mobile-back-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #54656f;
  transition: background .15s;
}

.mobile-back-btn:hover {
  background: rgba(0, 0, 0, .06);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MESSAGES AREA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.messages-area {
  flex: 1;
  padding: 16px 7% 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, .18);
  border-radius: 3px;
}

/* â”€â”€ Message row (wrapper for bubble + swipe hint) â”€â”€ */
.msg-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 2px;
}

.row-sent {
  justify-content: flex-end;
}

.row-recv {
  justify-content: flex-start;
}

/* â”€â”€ Swipe arrow hint â”€â”€ */
.swipe-hint {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s;
  background: rgba(255, 255, 255, .92);
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .15);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-sent .swipe-hint {
  left: 4px;
}

.row-recv .swipe-hint {
  right: 4px;
}

/* â”€â”€ Bubble â”€â”€ */
.message {
  position: relative;
  max-width: 62%;
  padding: 6px 10px 8px;
  border-radius: var(--radius-msg);
  font-size: 14.2px;
  line-height: 19px;
  color: var(--t1);
  box-shadow: var(--shadow-msg);
  word-break: break-word;
  user-select: text;
}

.message.sent {
  background: var(--sent-bg);
  border-top-right-radius: 0;
  align-self: flex-end;
}

.message.received {
  background: var(--recv-bg);
  border-top-left-radius: 0;
  align-self: flex-start;
}

.message.meta-msg {
  background: #f0f2f5;
  border-left: 3.5px solid #3062f9;
}

/* Bubble tail */
.message.sent::before {
  content: '';
  position: absolute;
  top: 0;
  right: -8px;
  width: 8px;
  height: 12px;
  background: var(--sent-bg);
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.message.received::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 8px;
  height: 12px;
  background: var(--recv-bg);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.message.image-only {
  padding: 3px;
}

/* â”€â”€ Hover action bar (Reply + Edit) â”€â”€ */
.bubble-actions {
  position: absolute;
  top: -34px;
  display: none;
  align-items: center;
  gap: 2px;
  background: var(--white);
  border-radius: 20px;
  padding: 4px 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .14);
  z-index: 10;
  white-space: nowrap;
}

.row-sent .bubble-actions {
  right: 0;
}

.row-recv .bubble-actions {
  left: 0;
}

.message:hover .bubble-actions {
  display: flex;
}

.bact-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  transition: background .12s;
}

.bact-btn:hover {
  background: var(--bg);
}

/* â”€â”€ Reply quote inside bubble â”€â”€ */
.reply-bubble {
  border-left: 3px solid var(--teal);
  background: rgba(0, 0, 0, .06);
  border-radius: 0 6px 6px 0;
  padding: 5px 9px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.reply-bubble-sender {
  font-size: 12px;
  font-weight: 600;
  color: var(--teal);
}

.reply-bubble-text {
  font-size: 12.5px;
  color: var(--t2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* â”€â”€ Edited label â”€â”€ */
.edited-tag {
  font-size: 10.5px;
  color: var(--t2);
  margin-right: 3px;
  font-style: italic;
}

/* â”€â”€ Msg meta (time + ticks) â”€â”€ */
.msg-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
  font-size: 11px;
  color: var(--gray-tick);
}

.ticks {
  font-size: 14px;
  color: var(--gray-tick);
  letter-spacing: -3px;
  line-height: 1;
}

.ticks.read {
  color: var(--blue-tick);
}

/* â”€â”€ Media â”€â”€ */
.image-msg-wrapper {
  position: relative;
  display: inline-flex;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 2px;
}

.chat-image {
  max-width: 100%;
  max-height: 280px;
  border-radius: 6px;
  display: block;
  cursor: pointer;
  object-fit: cover;
}

.image-msg-meta {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 0, 0, 0.35);
  padding: 2px 7px;
  border-radius: 12px;
  font-size: 11px;
  color: #fff;
}

.image-msg-meta .ticks {
  color: #fff;
}

.image-msg-meta .ticks.read {
  color: #53bdeb;
}

.file-attachment {
  background: rgba(0, 0, 0, .05);
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.audio-msg {
  padding-top: 4px;
  margin-bottom: 4px;
}

.custom-audio-player {
  height: 36px;
  outline: none;
  max-width: 250px;
  border-radius: 18px;
}

.file-attachment a {
  color: var(--teal);
  text-decoration: none;
  font-weight: 500;
  font-size: 13.5px;
}

.file-attachment a:hover {
  text-decoration: underline;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   REPLY / EDIT BANNERS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.action-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--white);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  animation: bannerIn .18s ease both;
}

@keyframes bannerIn {
  from {
    transform: translateY(8px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.banner-bar {
  width: 3px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.reply-color .banner-bar {
  background: var(--teal);
}

.edit-color .banner-bar {
  background: #f59e0b;
}

.banner-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.banner-title {
  font-size: 13px;
  font-weight: 600;
}

.reply-color .banner-title {
  color: var(--teal);
}

.edit-color .banner-title {
  color: #f59e0b;
}

.banner-preview {
  font-size: 13px;
  color: var(--t2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  transition: background .15s;
  flex-shrink: 0;
}

.banner-close:hover {
  background: var(--bg);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INPUT AREA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.input-area-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.emoji-picker-popup {
  position: absolute;
  bottom: 70px;
  left: 14px;
  z-index: 100;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.attach-menu {
  position: absolute;
  bottom: 70px;
  left: 14px;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 100;
  min-width: 220px;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.attach-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.15s;
}

.attach-item:hover {
  background: var(--hover);
}

.attach-item span {
  font-size: 14px;
  color: var(--t1);
  font-weight: 500;
}

.attach-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-doc {
  background: #7f66ff;
}

.bg-photo {
  background: #007bfc;
}

.bg-camera {
  background: #d3396d;
}

.bg-audio {
  background: #eb5822;
}

.active-icon {
  background: rgba(0, 0, 0, .06);
}

.recording-bar {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 16px;
  gap: 12px;
  background: var(--white);
  height: 42px;
  border-radius: 8px;
}

.record-pulse {
  width: 10px;
  height: 10px;
  background: #d32f2f;
  border-radius: 50%;
  animation: recPulse 1s infinite alternate;
}

@keyframes recPulse {
  from {
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    transform: scale(1.2);
    opacity: 1;
  }
}

.record-time {
  font-variant-numeric: tabular-nums;
  font-size: 15px;
  color: var(--t1);
}

.stop-rec-btn:hover {
  background: #fee2e2;
}

.input-area {
  min-height: 64px;
  padding: 6px 14px;
  background: var(--bg);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  flex-shrink: 0;
  transition: background .15s;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, .06);
}

.input-area input:not([type="file"]) {
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  background: var(--white);
  color: var(--t1);
  min-width: 0;
}

.input-area input::placeholder {
  color: var(--t2);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
  transition: background .2s, transform .1s;
}

.send-btn:hover {
  background: var(--teal-dk);
}

.send-btn:active {
  transform: scale(.92);
}

.send-btn svg {
  width: 22px;
  height: 22px;
  transform: translateX(2px);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NO CHAT SELECTED  (right panel, matches screenshot)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.no-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  position: relative;
}

.no-chat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 450px;
  padding: 0 24px 64px;
}

.no-chat-title {
  font-size: 23px;
  font-weight: 400;
  color: var(--t1);
  margin: 14px 0 8px;
  line-height: 1.35;
}

.no-chat-desc {
  font-size: 14px;
  color: var(--t2);
  line-height: 21px;
  margin-bottom: 22px;
}

.dl-btn {
  background: var(--green);
  color: #fff;
  padding: 9px 28px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 30px;
  transition: background .2s;
}

.dl-btn:hover {
  background: #22c55e;
}

/* Quick action cards (Send document / Add contact / Ask Meta AI) */
.quick-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.qa-btn {
  width: 112px;
  height: 82px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.emoji-picker-popup {
  position: absolute;
  bottom: 70px;
  left: 14px;
  z-index: 100;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.attach-menu {
  position: absolute;
  bottom: 70px;
  left: 14px;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 100;
  min-width: 220px;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.attach-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.15s;
}

.attach-item:hover {
  background: var(--hover);
}

.attach-item span {
  font-size: 14px;
  color: var(--t1);
  font-weight: 500;
}

.attach-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-doc {
  background: #7f66ff;
}

.bg-photo {
  background: #007bfc;
}

.bg-camera {
  background: #d3396d;
}

.bg-audio {
  background: #eb5822;
}

.active-icon {
  background: rgba(0, 0, 0, .06);
}

.recording-bar {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 16px;
  gap: 12px;
  background: var(--white);
  height: 42px;
  border-radius: 8px;
}

.record-pulse {
  width: 10px;
  height: 10px;
  background: #d32f2f;
  border-radius: 50%;
  animation: recPulse 1s infinite alternate;
}

@keyframes recPulse {
  from {
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    transform: scale(1.2);
    opacity: 1;
  }
}

.record-time {
  font-variant-numeric: tabular-nums;
  font-size: 15px;
  color: var(--t1);
}

.stop-rec-btn:hover {
  background: #fee2e2;
}

.input-area {
  min-height: 64px;
  padding: 6px 14px;
  background: var(--bg);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  flex-shrink: 0;
  transition: background .15s;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, .06);
}

.input-area input:not([type="file"]) {
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  background: var(--white);
  color: var(--t1);
  min-width: 0;
}

.input-area input::placeholder {
  color: var(--t2);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
  transition: background .2s, transform .1s;
}

.send-btn:hover {
  background: var(--teal-dk);
}

.send-btn:active {
  transform: scale(.92);
}

.send-btn svg {
  width: 22px;
  height: 22px;
  transform: translateX(2px);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NO CHAT SELECTED  (right panel, matches screenshot)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.no-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  position: relative;
}

.no-chat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 450px;
  padding: 0 24px 64px;
}

.no-chat-title {
  font-size: 23px;
  font-weight: 400;
  color: var(--t1);
  margin: 14px 0 8px;
  line-height: 1.35;
}

.no-chat-desc {
  font-size: 14px;
  color: var(--t2);
  line-height: 21px;
  margin-bottom: 22px;
}

.dl-btn {
  background: var(--green);
  color: #fff;
  padding: 9px 28px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 30px;
  transition: background .2s;
}

.dl-btn:hover {
  background: #22c55e;
}

/* Quick action cards (Send document / Add contact / Ask Meta AI) */
.quick-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.qa-btn {
  width: 112px;
  height: 82px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--t2);
  transition: background .15s, box-shadow .15s;
  cursor: pointer;
}

.qa-btn:hover {
  background: var(--bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
}

.meta-sm-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3dd1ff 0%, #4d55ff 50%, #b245ff 100%);
}

/* Lock + encryption footer */
.enc-footer {
  position: absolute;
  bottom: 22px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--gray-tick);
}

.msg-row {
  position: relative;
  display: flex;
  width: 100%;
}

.input-area-wrapper {
  position: relative;
  width: 100%;
  z-index: 100;
}

/* â•â•â•â•â•â•â•â••â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RESPONSIVE  (â‰¤ 768 px)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
@media (max-width: 768px) {
  .nav-rail {
    display: none;
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .app-container.chat-active .sidebar {
    display: none;
  }

  .app-container:not(.chat-active) .chat-window {
    display: none;
  }

  .chat-window {
    width: 100%;
  }

  .mobile-back-btn {
    display: flex;
  }

  .chat-header {
    padding: 0 6px;
  }

  .messages-area {
    padding: 12px 3% 8px;
  }

  .message {
    max-width: 85%;
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ADVANCED CLONE FEATURES (OVERLAYS, DROPDOWNS, DIVIDERS)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.global-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  cursor: default;
}

.date-divider {
  display: flex;
  justify-content: center;
  margin: 12px 0 6px;
  position: relative;
  z-index: 10;
}

.date-divider span {
  background: var(--white);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--t2);
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, .13);
  text-transform: uppercase;
}

.msg-menu-btn {
  position: absolute;
  top: 2px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .9) 40%, #fff);
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  z-index: 5;
}

.message:hover .msg-menu-btn {
  display: flex;
}

.message.sent .msg-menu-btn {
  background: linear-gradient(90deg, transparent, var(--sent-bg) 40%, var(--sent-bg));
}

.dropdown-menu {
  position: absolute;
  top: 28px;
  right: 0;
  background: var(--white);
  box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 100;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  animation: popIn .15s ease;
}

.dropdown-item {
  padding: 10px 16px;
  font-size: 14.5px;
  color: var(--t1);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: var(--hover);
}

.forward-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, .75);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.forward-modal {
  background: var(--white);
  width: 380px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.forward-header {
  padding: 16px 20px;
  font-size: 17px;
  font-weight: 500;
  color: var(--t1);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forward-list {
  max-height: 320px;
  overflow-y: auto;
}

.forward-list .user-item {
  height: 64px;
}

/* Sidebar Chat Menu */
.user-item {
  position: relative;
}

.chat-menu-btn {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 28px;
  height: 28px;
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  border-radius: 50%;
  background: var(--hover);
  z-index: 10;
}

.user-item:hover .chat-menu-btn {
  display: flex;
}

.chat-dropdown {
  top: 46px;
  right: 18px;
  width: 200px;
  z-index: 100;
  font-size: 14.5px;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Message React Btn */
.msg-react-btn {
  position: absolute;
  top: 2px;
  right: 30px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .9) 40%, #fff);
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  z-index: 5;
}

.message:hover .msg-react-btn {
  display: flex;
}

.message.sent .msg-react-btn {
  background: linear-gradient(90deg, transparent, var(--sent-bg) 40%, var(--sent-bg));
}

.tick-blue {
  color: var(--blue-tick) !important;
}

.tick-grey {
  color: var(--gray-tick) !important;
}

/* â”€â”€ Dropdown Menus â”€â”€ */
.dropdown-menu {
  position: absolute;
  top: 100%;
  background: var(--white);
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26), 0 2px 10px rgba(0, 0, 0, 0.16);
  padding: 9px 0;
  min-width: 160px;
  z-index: 1000 !important;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 24px;
  font-size: 14.5px;
  color: var(--t1);
  cursor: pointer;
  transition: background .15s;
}

.dropdown-item:hover {
  background: var(--hover);
}

/* â”€â”€ Inline Reactions â”€â”€ */
.reaction-picker-container {
  position: absolute;
  top: -50px;
  z-index: 1000 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .15);
  border-radius: 8px;
}

.picker-right {
  right: 0;
}

.picker-left {
  left: 0;
}

.msg-reaction {
  position: absolute;
  bottom: -12px;
  right: 4px;
  background: var(--white);
  border-radius: 12px;
  padding: 3px 6px;
  font-size: 13.5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--white);
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message.image-only .msg-react-btn {
  right: 32px;
  top: 4px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
}

.message.image-only .msg-menu-btn {
  right: 6px;
  top: 4px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
}

/* Status Base Styling */
.status-sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
}

.status-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 16px;
  background: var(--white);
  color: var(--t1);
}

.status-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--t1);
  letter-spacing: -.2px;
}

.status-my-row {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  background: white;
}

.status-add-badge {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 18px;
  height: 18px;
  background: #00a884;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

.status-section-title {
  padding: 24px 24px 12px;
  color: #54656f;
  font-size: 14px;
  background-color: white;
  border-top: 1px solid var(--border);
}

.status-ring {
  background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #00a884, #00a884) border-box;
  border: 2px solid transparent;
}

.status-list-scroll {
  flex: 1;
  overflow-y: auto;
  background: white;
}

/* Status Viewer Right Pane */
.status-viewer-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  height: 100%;
}

.status-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  color: #8696a0;
  height: 100%;
  justify-content: center;
}

.status-empty-box h2 {
  font-size: 30px;
  color: #41525d;
  margin: 0px 0 16px;
  font-weight: 300;
}

.status-empty-box p {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 30px;
  color: #667781;
}

.status-empty-box .enc-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-top: auto;
  margin-bottom: 40px;
}

/* ── STATUS COMPOSER & VIEWER ── */
.status-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #0b141a;
  color: #fff;
  overflow: hidden;
}

.status-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: transparent;
  z-index: 1001;
}

.status-top-bar .icon-btn {
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}

.status-top-bar .icon-btn:hover {
  background: rgba(0, 0, 0, 0.4);
}

.status-composer-tools {
  display: flex;
  gap: 16px;
}

.status-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.status-textarea {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 36px;
  text-align: center;
  width: 100%;
  resize: none;
  font-family: inherit;
  line-height: 1.4;
}

.status-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.status-image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.status-bottom-bar {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  min-height: 80px;
}

.status-caption-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  color: #fff;
  font-size: 15px;
  width: 60%;
  outline: none;
  text-align: center;
}

.status-caption-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.status-send-btn {
  position: absolute;
  right: 24px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
  border: none;
  cursor: pointer;
}

.status-send-btn:hover {
  background: #00bfa5;
}

.status-send-btn:active {
  transform: scale(0.95);
}

.status-send-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  transform: none;
}

/* Viewer specific */
.viewer-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.viewer-container {
  width: 100%;
  max-width: 550px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.status-blur-bg {
  position: absolute;
  top: -10%;
  left: -10%;
  right: -10%;
  bottom: -10%;
  background-size: cover;
  background-position: center;
  filter: blur(50px);
  opacity: 0.6;
  z-index: 1;
}

.viewer-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  cursor: pointer;
  transition: background 0.2s;
}

.viewer-nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.viewer-nav-left {
  left: 40px;
}

.viewer-nav-right {
  right: 40px;
}

.viewer-top-left-actions {
  position: absolute;
  top: 20px;
  left: 24px;
  z-index: 20;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-top-right-actions {
  position: absolute;
  top: 20px;
  right: 24px;
  z-index: 20;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-top-left-actions:hover,
.viewer-top-right-actions:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.qa-btn:hover {
  background: var(--bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
}

.meta-sm-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3dd1ff 0%, #4d55ff 50%, #b245ff 100%);
}

.enc-footer {
  position: absolute;
  bottom: 22px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--gray-tick);
}

@media (max-width: 768px) {
  .nav-rail {
    display: none !important;
  }

  .sidebar {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  .app-container.chat-active .sidebar {
    display: none !important;
  }

  .app-container:not(.chat-active) .chat-window {
    display: none !important;
  }

  .chat-window {
    width: 100% !important;
  }

  .mobile-back-btn {
    display: flex !important;
  }

  .chat-header {
    padding: 0 6px;
  }

  .messages-area {
    padding: 12px 3% 8px;
  }

  .message {
    max-width: 85%;
  }
}

.global-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  cursor: default;
}

.date-divider {
  display: flex;
  justify-content: center;
  margin: 12px 0 6px;
  position: relative;
  z-index: 10;
}

.date-divider span {
  background: var(--white);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--t2);
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, .13);
  text-transform: uppercase;
}

.msg-menu-btn {
  position: absolute;
  top: 2px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .9) 40%, #fff);
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  z-index: 5;
}

.message:hover .msg-menu-btn {
  display: flex;
}

.message.sent .msg-menu-btn {
  background: linear-gradient(90deg, transparent, var(--sent-bg) 40%, var(--sent-bg));
}

.forward-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, .75);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.forward-modal {
  background: var(--white);
  width: 380px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: popIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.forward-header {
  padding: 16px 20px;
  font-size: 17px;
  font-weight: 500;
  color: var(--t1);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forward-list {
  max-height: 320px;
  overflow-y: auto;
}

.forward-list .user-item {
  height: 64px;
}

.user-item {
  position: relative;
}

.chat-menu-btn {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 28px;
  height: 28px;
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  border-radius: 50%;
  background: var(--hover);
  z-index: 10;
}

.user-item:hover .chat-menu-btn {
  display: flex;
}

.chat-dropdown {
  top: 46px;
  right: 18px;
  width: 200px;
  z-index: 100;
  font-size: 14.5px;
  opacity: 1 !important;
  visibility: visible !important;
}

.msg-react-btn {
  position: absolute;
  top: 2px;
  right: 30px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .9) 40%, #fff);
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  z-index: 5;
}

.message:hover .msg-react-btn {
  display: flex;
}

.message.sent .msg-react-btn {
  background: linear-gradient(90deg, transparent, var(--sent-bg) 40%, var(--sent-bg));
}

.tick-blue {
  color: var(--blue-tick) !important;
}

.tick-grey {
  color: var(--gray-tick) !important;
}

/*  Dropdown Menus  */
.dropdown-menu {
  position: absolute;
  top: 100%;
  background: var(--white);
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26), 0 2px 10px rgba(0, 0, 0, 0.16);
  padding: 9px 0;
  min-width: 160px;
  z-index: 1000 !important;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 24px;
  font-size: 14.5px;
  color: var(--t1);
  cursor: pointer;
  transition: background .15s;
}

.dropdown-item:hover {
  background: var(--hover);
}

/*  Inline Reactions  */
.reaction-picker-container {
  position: absolute;
  top: -50px;
  z-index: 1000 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .15);
  border-radius: 8px;
}

.picker-right {
  right: 0;
}

.picker-left {
  left: 0;
}

.msg-reaction {
  position: absolute;
  bottom: -12px;
  right: 4px;
  background: var(--white);
  border-radius: 12px;
  padding: 3px 6px;
  font-size: 13.5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--white);
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message.image-only .msg-react-btn {
  right: 32px;
  top: 4px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
}

.message.image-only .msg-menu-btn {
  right: 6px;
  top: 4px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
}

/* Status Base Styling */
.status-sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
}

.status-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 16px;
  background: var(--white);
  color: var(--t1);
}

.status-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--t1);
  letter-spacing: -.2px;
}

.status-my-row {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  background: white;
}

.status-add-badge {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 18px;
  height: 18px;
  background: #00a884;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

.status-section-title {
  padding: 24px 24px 12px;
  color: #54656f;
  font-size: 14px;
  text-transform: uppercase;
  background-color: white;
  border-top: 1px solid var(--border);
}

.status-ring {
  background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #00a884, #00a884) border-box;
  border: 2px solid transparent;
}

.status-list-scroll {
  flex: 1;
  overflow-y: auto;
  background: white;
}

/* Status Viewer Right Pane */
.status-viewer-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  height: 100%;
}

.status-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  color: #8696a0;
  height: 100%;
  justify-content: center;
}

.status-empty-box h2 {
  font-size: 30px;
  color: #41525d;
  margin: 0px 0 16px;
  font-weight: 300;
}

.status-empty-box p {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 30px;
  color: #667781;
}

.status-empty-box .enc-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-top: auto;
  margin-bottom: 40px;
}

/*  STATUS COMPOSER & VIEWER  */
.status-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #0b141a;
  color: #fff;
  overflow: hidden;
}

.status-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: transparent;
  z-index: 1001;
}

.status-top-bar .icon-btn {
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}

.status-top-bar .icon-btn:hover {
  background: rgba(0, 0, 0, 0.4);
}

.status-composer-tools {
  display: flex;
  gap: 16px;
}

.status-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.status-textarea {
  background: transparent;
  border: none;
  border-radius: 8px;
  outline: none;
  color: #fff;
  font-size: 36px;
  text-align: center;
  width: 100%;
  height: auto;
  min-height: 150px;
  resize: none;
  font-family: inherit;
  line-height: 1.4;
}

.status-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.status-image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.status-bottom-bar {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  min-height: 80px;
}

.status-caption-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  color: #fff;
  font-size: 15px;
  width: 60%;
  outline: none;
  text-align: center;
}

.status-caption-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.status-send-btn {
  position: absolute;
  right: 24px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
  border: none;
  cursor: pointer;
}

.status-send-btn:hover {
  background: #00bfa5;
}

.status-send-btn:active {
  transform: scale(0.95);
}

.status-send-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  transform: none;
}

/* Viewer specific */
.viewer-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.viewer-container {
  width: 100%;
  max-width: 550px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.status-blur-bg {
  position: absolute;
  top: -10%;
  left: -10%;
  right: -10%;
  bottom: -10%;
  background-size: cover;
  background-position: center;
  filter: blur(50px);
  opacity: 0.6;
  z-index: 1;
}

.viewer-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  cursor: pointer;
  transition: background 0.2s;
}

.viewer-nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.viewer-nav-left {
  left: 40px;
}

.viewer-nav-right {
  right: 40px;
}

.viewer-top-left-actions {
  position: absolute;
  top: 20px;
  left: 24px;
  z-index: 20;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-top-right-actions {
  position: absolute;
  top: 20px;
  right: 24px;
  z-index: 20;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-top-left-actions:hover,
.viewer-top-right-actions:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app-container {
    display: block;
    /* Disable flex row/column issues */
    position: relative;
  }

  .nav-rail {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 70px !important;
    flex-direction: row !important;
    border-right: none !important;
    border-top: 1px solid var(--border) !important;
    padding: 0 !important;
    z-index: 10000 !important;
    display: flex !important;
    background-color: var(--white) !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .nav-icon.desktop-only {
    display: none !important;
  }

  .nav-icon.mobile-only {
    display: flex !important;
  }

  .nav-rail-top {
    flex-direction: row !important;
    width: 100vw !important;
    height: 100% !important;
    display: flex !important;
    justify-content: space-around !important;
    align-items: center !important;
    gap: 0 !important;
  }

  .nav-rail-bottom {
    display: none !important;
  }

  .nav-icon {
    width: auto !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    border-radius: 0 !important;
    gap: 4px !important;
    flex: 1 !important;
    /* Stretch icons evenly */
    color: #54656f !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .nav-icon:hover {
    background: transparent !important;
  }

  .nav-icon.active {
    background: transparent !important;
  }

  .nav-icon.active::after {
    display: none !important;
  }

  .nav-label {
    display: block !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    visibility: visible !important;
    opacity: 1 !important;
    color: inherit;
  }

  .nav-icon.active .nav-label {
    color: var(--t1) !important;
  }

  .sidebar,
  .status-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 70px);
    /* Leave room for bottom nav */
    max-width: none;
  }

  /* Hide the main-pane entirely if not inside a chat */
  .app-container:not(.chat-active) .main-pane {
    display: none !important;
  }

  /* Hide the sidebar and nav-rail when a chat is open */
  .chat-active .sidebar,
  .chat-active .status-sidebar,
  .chat-active .nav-rail {
    display: none !important;
  }

  .chat-active .main-pane {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* Full screen for active chat */
    display: flex !important;
  }
}
