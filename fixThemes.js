const fs = require('fs');

const files = [
    'src/app/[orgName]/modules/organization/admins/page.tsx',
    'src/app/[orgName]/modules/organization/access/page.tsx'
];

const patterns = [
    { from: /bg-slate-50\/50/g, to: 'bg-background' },
    { from: /bg-white/g, to: 'bg-card' },
    { from: /text-white/g, to: 'text-primary-foreground' },
    { from: /text-gray-900/g, to: 'text-foreground' },
    { from: /text-slate-900/g, to: 'text-foreground' },
    { from: /text-gray-700/g, to: 'text-foreground/80' },
    { from: /text-slate-700/g, to: 'text-foreground/80' },
    { from: /text-gray-600/g, to: 'text-muted-foreground' },
    { from: /text-slate-600/g, to: 'text-muted-foreground' },
    { from: /text-gray-500/g, to: 'text-muted-foreground' },
    { from: /text-slate-500/g, to: 'text-muted-foreground' },
    { from: /text-gray-400/g, to: 'text-muted-foreground/70' },
    { from: /border-gray-200/g, to: 'border-border' },
    { from: /border-slate-200/g, to: 'border-border' },
    { from: /border-gray-100/g, to: 'border-border/50' },
    { from: /border-slate-100/g, to: 'border-border/50' },
    { from: /bg-gray-50\/50/g, to: 'bg-muted/30' },
    { from: /bg-gray-50/g, to: 'bg-muted/50' },
    { from: /bg-slate-50/g, to: 'bg-muted' },
    { from: /bg-gray-200/g, to: 'bg-muted' },
    { from: /bg-slate-200/g, to: 'bg-muted' },
    // A couple extra patterns that might appear
    { from: /border-none/g, to: 'border-transparent' }
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    for (const { from, to } of patterns) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
}
