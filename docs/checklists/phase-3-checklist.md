# Phase 3: Posting Content

In this phase, we build out the mechanism for creating posts (photos, videos, or text), privacy controls, and tagging as indicated in [user-flow.md].

---

## Features & Tasks

- [ ] FRONTEND: Implement “New Post” screen with media upload, text input, tag selection, and group selector.  
- [ ] FRONTEND: Integrate camera permissions or media picker for uploading photos/videos.  
- [ ] BACKEND: Create Firestore structure for posts (post ID, user ID, media references, timestamps).
- [ ] FRONTEND: Provide privacy setting options (public, group-only, or friends-only) on the post creation form.  
- [ ] BACKEND: Store privacy level in each post document and enforce via security rules or query filtering.
- [ ] FRONTEND: Allow users to add tags (#cooking, #fitness, #art) using a simple UI element.  
- [ ] BACKEND: Save tags as metadata in each post. Consider using array fields for easy queries.  
- [ ] BACKEND: Optional: Implement basic indexing to retrieve posts by tag quickly.
- [ ] FRONTEND: Prompt user to select which group(s) the post belongs to (if any).  
- [ ] BACKEND: Maintain a reference from the post to the group(s) for feed aggregation.  
- [ ] BACKEND: Update group’s last activity timestamp or “recent posts” field when a new post is created.
- [ ] FRONTEND: Use React Native Testing Library to ensure file upload states are handled.  
- [ ] FRONTEND: Add tests for privacy toggles and tag selection.  
- [ ] BACKEND: Test Firestore rules for post creation and privacy settings.  
- [ ] FRONTEND/BACKEND: Manually verify images or videos display correctly in posts.
