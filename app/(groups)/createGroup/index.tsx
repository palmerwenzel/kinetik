import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function CreateGroupEntry() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to the first step
    router.replace("./basics");
  }, [router]);

  return null;
}
