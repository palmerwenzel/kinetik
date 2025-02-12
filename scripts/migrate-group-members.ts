import * as admin from "firebase-admin";
import {
  getFirestore,
  type Timestamp,
  type Query,
  type QuerySnapshot,
  type QueryDocumentSnapshot,
  type WriteBatch,
  type CollectionReference,
} from "firebase-admin/firestore";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Load environment variables from app.config.ts
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

// Initialize Firebase Admin
const serviceAccountPath = resolve(process.cwd(), "service-account.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = getFirestore();
const BATCH_SIZE = 500;
const DRY_RUN = process.argv.includes("--dry-run");

interface GroupData {
  memberRoles: Record<string, string>;
  createdAt: Timestamp;
  createdBy: string;
}

async function migrateGroupMembers() {
  console.log(`Starting group members migration... ${DRY_RUN ? "(DRY RUN)" : ""}`);
  let lastDoc: QueryDocumentSnapshot | null = null;
  let totalProcessed = 0;
  let totalMembers = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Query groups in batches
    const groupsRef = db.collection("groups") as CollectionReference<GroupData>;
    const q: Query<GroupData> = lastDoc
      ? groupsRef.orderBy("__name__").startAfter(lastDoc).limit(BATCH_SIZE)
      : groupsRef.orderBy("__name__").limit(BATCH_SIZE);

    const snapshot: QuerySnapshot<GroupData> = await q.get();
    if (snapshot.empty) break;

    const batch: WriteBatch = db.batch();
    let batchCount = 0;
    let batchMembers = 0;

    for (const groupDoc of snapshot.docs) {
      const groupData = groupDoc.data();
      const memberRoles = groupData.memberRoles || {};

      // Create member documents for each user
      for (const [userId, role] of Object.entries(memberRoles)) {
        const memberRef = db.doc(`groups/${groupDoc.id}/members/${userId}`);
        if (!DRY_RUN) {
          batch.set(memberRef, {
            role,
            joinedAt: groupData.createdAt || admin.firestore.Timestamp.now(),
            addedBy: groupData.createdBy,
          });
        }
        batchMembers++;
      }

      console.log(
        `Group ${groupDoc.id}: ${Object.keys(memberRoles).length} members${
          DRY_RUN ? " (would be migrated)" : ""
        }`
      );

      batchCount++;
      lastDoc = groupDoc;
    }

    if (batchCount > 0 && !DRY_RUN) {
      await batch.commit();
    }

    totalProcessed += batchCount;
    totalMembers += batchMembers;
    console.log(
      `Processed ${totalProcessed} groups, ${totalMembers} members${DRY_RUN ? " (dry run)" : ""}`
    );
  }

  console.log(
    `Migration complete! Processed ${totalProcessed} groups and ${totalMembers} members${
      DRY_RUN ? " (dry run)" : ""
    }`
  );
  return { totalProcessed, totalMembers };
}

// Execute migration
console.log("🔑 Initializing with service account...");
if (!process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("❌ Error: Environment variables not loaded");
  process.exit(1);
}

migrateGroupMembers()
  .then(({ totalProcessed, totalMembers }) => {
    console.log(
      `✅ Successfully processed ${totalProcessed} groups and ${totalMembers} members${
        DRY_RUN ? " (dry run)" : ""
      }`
    );
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
