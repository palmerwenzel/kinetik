# Phase 4: Feed & Discovery

This phase implements the main feed experience—surfacing posts from groups, tags, and followed creators—as well as an explore interface to discover new groups or trending tags.

---

## Features & Tasks

- [ ] FRONTEND: Create Feed screen showing recent or relevant posts from the user’s joined groups and followed creators.  
- [ ] FRONTEND: Apply infinite scroll or pagination (e.g., with React Query).  
- [ ] BACKEND: Implement queries to fetch posts based on user membership (group references) or following relationships.
- [ ] FRONTEND: Provide an “Explore” tab to browse trending tags, public groups, or featured creators.  
- [ ] BACKEND: Expose an endpoint or Firestore query for trending tags (e.g., sorted by post count).  
- [ ] FRONTEND: Add a search bar for tags, user handles, or group names.
- [ ] FRONTEND: Enable liking and commenting on posts directly from the feed.  
- [ ] BACKEND: Store likes and comments in Firestore, referencing the post ID.  
- [ ] BACKEND: Set security rules so only authenticated users can write comments or likes.
- [ ] FRONTEND: Use neumorphic card designs from [@theme-rules.md](../rules/theme-rules.md) for feed items.  
- [ ] FRONTEND: Provide consistent and accessible interactions (e.g., large tap areas for like/comment icons).  
- [ ] FRONTEND: Display loading spinners and error messages when feed data retrieval fails.  
- [ ] BACKEND: Implement error handling in queries and API responses to indicate feed retrieval issues.
- [ ] FRONTEND: Add unit tests for feed rendering, data fetching, and interactive elements.  
- [ ] BACKEND: Validate Firestore queries for performance and correct data returns.  
- [ ] FRONTEND: Perform manual QA to ensure pagination and real-time updates (onSnapshot) behave correctly.