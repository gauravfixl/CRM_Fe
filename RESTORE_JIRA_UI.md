# Emergency Undo / Restore Instructions

Aapne Jira-style implementation shuru karne se pehle ye backup create kiya hai. Agar kuch bhi gadbad hoti hai ya aapko purana UI wapas chahiye, toh neeche diye gaye steps follow karein:

### Option 1: Manual Restore (Easiest)
Maine `backup_pre_jira` folder mein main files ki copy rakh di hai. Aap bas unhe wapas `src` folder mein copy-paste kar sakte hain:

1. `backup_pre_jira/task-dialog.tsx` -> `src/shared/components/task-dialog.tsx`
2. `backup_pre_jira/project-board.tsx` -> `src/shared/components/project-board.tsx`
3. `backup_pre_jira/workspaceHooks.ts` -> `src/modules/project-management/workspace/hooks/workspaceHooks.ts`

### Option 2: Command Line Restore
Agar aap command line use karna chahte hain, toh ye commands chalayein:

```powershell
xcopy "backup_pre_jira\task-dialog.tsx" "src\shared\components\" /Y
xcopy "backup_pre_jira\project-board.tsx" "src\shared\components\" /Y
xcopy "backup_pre_jira\workspaceHooks.ts" "src\modules\project-management\workspace\hooks\" /Y
```

### Option 3: Git Restore (Agar aap Git use karte hain)
Maine backup branch ya commit ke liye files stage kar di hain. Aap ye command chala sakte hain:
`git checkout -- .` (Warning: Ye aapke saare uncommitted changes uda dega)

---
**Note**: Main har bar badi file change karne se pehle backup folder ko update kar dunga taaki aap hamesha safe rahein.
