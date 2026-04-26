1. Ask a question right away:
`claude "the question"`

2. Aska question right away without being on the cli:
`claude -p "the question"`

3. To continue the existing session:
`claude >> /resume`

4. To continue the latest session:
`claude -c`

5. Shift to accept edit mode:
`shift + tab`

6. Skip all the permissions 💣
`claude --dangerously-skip-permissions`

7. Running the claude code in the docker sandbox
`docker sandbox run claude`

8. Running the claude code in the sandbox mode
`claude >> /sandbox`

9. Undo the applied change:
`claude >> esc + esc`
 `claude >> /rewind`

10: Start session with plan mode:
`claude --permission-mode plan`

11: Check auto memory
 `claude >> /memory`