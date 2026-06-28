# Lotus App Builder Rebrand Summary

## Changes Completed

### Core Files Updated
- ✅ **package.json** - Updated project name to `lotus-app-builder` and description
- ✅ **README.md** - Updated title, description, and removed external dyad.sh links
- ✅ **CONTRIBUTING.md** - Updated product references to Lotus App Builder, removed external links
- ✅ **AGENTS.md** - Updated all `/dyad:` skill references to `/lotus:`
- ✅ **SECURITY.md** - Updated product references and removed external reporting links

### Configuration Files
- ✅ **.claude/README.md** - Updated project configuration documentation
- ✅ **.claude/settings.json** - Updated skill permissions from `dyad:*` to `lotus:*`

### Documentation Files
- ✅ **docs/architecture.md** - Updated narrative descriptions, changed GitHub dyad-sh links to relative paths
- ✅ **docs/agent_architecture.md** - Updated product name references
- ✅ **CLA.md** - Updated product name references in Contributor License Agreement

### Internal Rules & Files
- ✅ **rules/dyad-errors.md** → **rules/lotus-errors.md** - Renamed file
- ✅ AGENTS.md - Updated file reference from `dyad-errors.md` to `lotus-errors.md`

### External References Removed
- ✅ Removed link to https://dyad.sh/ from README
- ✅ Removed link to https://www.dyad.sh/#download from README
- ✅ Removed DeepWiki badge pointing to dyad-sh/dyad
- ✅ Changed GitHub repository links to relative paths where appropriate
- ✅ Removed external security reporting link to dyad-sh repository

### Code Component Names Preserved
The following internal code components were intentionally left unchanged to prevent breaking the application:
- `DyadError` and `DyadErrorKind` (source code classes)
- `<dyad-*>` XML tags in content
- `DyadMarkdownParser` component
- All other code references in source files

## What Was NOT Changed
- Source code class names (DyadError, etc.) - would require code changes
- XML tag names (`<dyad-*>`) - would require parsing changes
- node_modules/ directory
- .git/ directory
- Test fixtures and test code

## Notes for Further Customization

### Legal Entity
Update `CLA.md` and replace **Dyad Tech, Inc.** with your organization name if needed.

### Additional Internal Documentation
The following files still contain "dyad" or "Dyad" references that may need future updates (internal development docs):
- `plans/` directory (internal planning documents)
- `rules/` directory (internal development rules)
- Source code comments and documentation strings

### Skill References
All project-local skills in `.claude/skills/` have been configured to use `lotus:` prefix instead of `dyad:`.

## Verification
To verify the rebrand is complete for user-facing content:
```bash
# Check for remaining external dyad references
grep -r "dyad.sh\|dyad-sh" . --include="*.md" --include="*.json" --exclude-dir=node_modules --exclude-dir=.git

# The above should return minimal results (only in history or preserved code components)
```

## Files Modified: 12
- 1 file renamed (dyad-errors.md → lotus-errors.md)
- 11 files updated with brand/name changes
