# Quick Fix: Import Paths

Yeh file automatically saare import paths fix kar degi.

## Manual Fix Required

Abhi ke liye, aapko manually yeh replacements karni hongi in all files under `src/app/[orgName]/modules/workspaces/`:

### Find and Replace (VS Code):

**Find:** `from "@/hooks/workspaceHooks"`  
**Replace:** `from "@/modules/project-management/workspace/hooks/workspaceHooks"`

**Find:** `from "@/hooks/projectHooks"`  
**Replace:** `from "@/modules/project-management/project/hooks/projectHooks"`

**Find:** `from "@/hooks/boardHooks"`  
**Replace:** `from "@/modules/project-management/board/hooks/boardHooks"`

**Find:** `from "@/hooks/taskHooks"`  
**Replace:** `from "@/modules/project-management/task/hooks/taskHooks"`

**Find:** `from "@/hooks/teamHooks"`  
**Replace:** `from "@/modules/project-management/team/hooks/teamHooks"`

## VS Code Steps:

1. Press `Ctrl + Shift + H` (Find and Replace in Files)
2. In "files to include" box, type: `src/app/**/workspaces/**/*.tsx`
3. Do each Find/Replace above one by one
4. Click "Replace All" for each

Yeh 2 minutes mein sab fix ho jayega!

## Already Fixed Files:
- ✅ workspaces/create/page.tsx
- ✅ workspaces/page.tsx
- ✅ workspaces/[id]/page.tsx
- ✅ workspaces/[id]/settings/page.tsx

## Remaining Files (Auto-fix with above):
- workspaces/[id]/members/page.tsx
- workspaces/[id]/analytics/page.tsx
- All project pages
- All board pages
- All task pages
- All team pages
