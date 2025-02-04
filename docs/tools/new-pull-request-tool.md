# New Pull Request Tool

## Push & PR Checklist

1. Push to remote

   ```bash
   git push -u origin <branch-name>
   ```

   - If push fails, verify remote config

2. Create PR

   - Create description file
     ```bash
     touch pr-description.md
     ```
   - Write PR description
     - List completed tasks
     - Detail changes
     - Add impact statement
   - Submit PR
     ```bash
     gh pr create --title "<type>: <description>" --body-file pr-description.md --base main
     ```
   - Clean up
     ```bash
     rm pr-description.md
     ```

3. Finalize
   ```bash
   git checkout main
   ```
