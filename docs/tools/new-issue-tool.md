# New Issue Tool

## Issue Creation Checklist
1. Gather issue information
    - Determine issue type:
        - bug report
        - feature request
        - documentation
        - enhancement
        - question
    - Format title:
        - Start with type: [Bug], [Feature], [Docs], etc.
        - Add clear, concise description
        - Example: "[Bug] Login form validation not working"

2. Create issue description file
    ```bash
    touch issue-description.md
    ```

3. Write issue description
    - Add issue template sections:
        ```markdown
        ## Description
        [Detailed description of the issue]

        ## Expected Behavior
        [What should happen]

        ## Current Behavior
        [What is happening]

        ## Steps to Reproduce
        1. [First Step]
        2. [Second Step]
        3. [Additional Steps...]

        ## Additional Context
        [Any other relevant information]
        ```

4. Create GitHub issue
    ```bash
    gh issue create --title "<type>: <description>" --body-file issue-description.md --label "<label1>,<label2>"
    ```
    - If command fails:
        - Verify GitHub CLI installation
        - Check authentication status
        ```bash
        gh auth status
        ```

5. Clean up
    ```bash
    rm issue-description.md
    ```

6. Verify issue creation
    ```bash
    gh issue list --limit 1
    ```
