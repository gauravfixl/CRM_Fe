# Import Path Fix Script

## Files to Fix:

### Workspace Hooks:
1. ✅ workspaces/create/page.tsx - FIXED
2. ✅ workspaces/page.tsx - FIXED  
3. ✅ workspaces/[id]/page.tsx - FIXED
4. ⏳ workspaces/[id]/settings/page.tsx
5. ⏳ workspaces/[id]/members/page.tsx
6. ⏳ workspaces/[id]/analytics/page.tsx

### Project Hooks:
7. ⏳ projects/page.tsx
8. ⏳ projects/create/page.tsx
9. ⏳ projects/[projectId]/page.tsx
10. ⏳ projects/[projectId]/settings/page.tsx
11. ⏳ projects/[projectId]/analytics/page.tsx

### Board Hooks:
12. ⏳ projects/[projectId]/board/page.tsx

### Task Hooks:
13. ⏳ projects/[projectId]/tasks/[taskId]/page.tsx

### Team Hooks:
14. ⏳ projects/[projectId]/teams/page.tsx
15. ⏳ projects/[projectId]/teams/create/page.tsx
16. ⏳ projects/[projectId]/teams/[teamId]/page.tsx

## Replace Patterns:

```
FROM: "@/hooks/workspaceHooks"
TO: "@/modules/project-management/workspace/hooks/workspaceHooks"

FROM: "@/hooks/projectHooks"
TO: "@/modules/project-management/project/hooks/projectHooks"

FROM: "@/hooks/boardHooks"
TO: "@/modules/project-management/board/hooks/boardHooks"

FROM: "@/hooks/taskHooks"
TO: "@/modules/project-management/task/hooks/taskHooks"

FROM: "@/hooks/teamHooks"
TO: "@/modules/project-management/team/hooks/teamHooks"
```
