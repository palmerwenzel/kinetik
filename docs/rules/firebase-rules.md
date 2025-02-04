# Firebase Rules

## Best Practices
- **Security Rules & Validation**  
  - Enforce read/write rules in Firestore for each collection.  
  - Validate document shapes and user permissions to prevent data leaks.

- **Cloud Functions for Complex Logic**  
  - Offload business logic to Cloud Functions where possible.  
  - Keep client code thin by leveraging server-side checks.

- **Offline Support**  
  - Enable offline persistence in Firestore if needed.  
  - Handle merges or conflicts carefully after reconnection.

- **Scalability with Firestore**  
  - Use collection group queries when data is segmented by sub-collections.  
  - Keep an eye on read/write costs, especially with large-scale or real-time updates.

## Limitations
- **Vendor Lock-In**  
  - Migrating away from Firebase can be complex due to proprietary APIs.

- **Query Constraints**  
  - Firestore queries are highly efficient but limited in how you can combine filters.

## Conventions
- **Naming**  
  - Use descriptive collection and document field names.  
  - Keep consistent naming across Firestore, Cloud Functions, and client code.

- **Cloud Function Structure**  
  - Separate each function by domain (e.g., `userOnCreate`, `postOnUpdate`).  
  - Use async/await for clearer logic flows.

- **Security**  
  - Always validate `Auth` tokens.  
  - Keep Firestore rules minimal but explicit to reflect real business logic.

## Common Pitfalls
1. **Unhandled Edge Cases in Security Rules**  
   - Missing checks can allow malicious writes or reads.
2. **Uncontrolled Growth in Firestore**  
   - Large unindexed queries can lead to performance bottlenecks or high costs.
3. **Improper Error Handling**  
   - Failing to catch errors in Cloud Functions can crash instances or lose logs.
