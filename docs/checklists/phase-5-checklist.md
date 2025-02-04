# Phase 5: Notifications & Engagement

According to [user-flow.md], notifications and nudges keep users accountable and encourage regular posting. This phase includes implementing push notifications or in-app alerts.

---

## Features & Tasks

### 1. Real-Time Notifications
- [ ] BACKEND: Configure Firebase Cloud Messaging (FCM) or a similar service for push notifications.  
- [ ] FRONTEND: Set up device token retrieval and user opt-in for notifications (iOS/Android).  
- [ ] BACKEND: Trigger notifications for new group posts, comments, mentions, etc.

### 2. In-App Notification System
- [ ] FRONTEND: Build a notification center screen or dropdown that lists all recent alerts (group invites, likes, comments, etc.).  
- [ ] BACKEND: Store notifications in Firestore with references to the target user for real-time updates.  
- [ ] FRONTEND: Mark notifications as read/unread and show a badge count in the app’s header/tab.

### 3. Engagement Nudges
- [ ] FRONTEND: Offer “Remind me to post” toggles or scheduled prompts for accountability (daily/weekly).  
- [ ] BACKEND: Use Cloud Functions or scheduling to send friendly nudges if no post is detected for X days.  
- [ ] FRONTEND: Provide relevant UI modals or toast messages encouraging user engagement.

### 4. Testing & Validation
- [ ] FRONTEND: Verify notifications are received and displayed correctly in iOS/Android emulators.  
- [ ] BACKEND: Test Cloud Functions triggers for new posts/comments.  
- [ ] FRONTEND: Confirm user can opt out of notifications or adjust frequency in settings.
