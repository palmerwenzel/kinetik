# New Commit Tool

## Commit Checklist

1. Create commit message file

   ```bash
   touch commit-message.md
   ```

2. Write commit message

   - Add task description
   - List changes made
   - Follow commit conventions

3. Commit changes

   ```bash
   git add .
   git commit -F commit-message.md
   ```

4. Clean up
   ```bash
   rm commit-message.md
   ```
