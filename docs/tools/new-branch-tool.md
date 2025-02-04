# New Branch Tool

## Pre-Commit Checklist

1. Check current branch

   ```bash
   git status
   ```

   - If not on 'main', get user permission
   - Else (on 'main'), proceed

2. Determine branch name

   - Check task type:
     - bug fix → fix/
     - new feature → feat/
     - documentation → docs/
     - refactor → refactor/
     - performance → perf/
   - Format name:
     - Convert spaces to dashes
     - Use lowercase
     - Remove special characters

3. Create branch
   ```bash
   git checkout -b <branch-type>/<task-name>
   ```
