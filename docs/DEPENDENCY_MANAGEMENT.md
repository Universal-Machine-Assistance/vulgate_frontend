# Dependency Management Documentation

## Overview

This document outlines our dependency management strategy, focusing particularly on our core Latin/Vulgate-related dependencies that are critical to the application's functionality.

## Core Dependencies Structure

### 1. Standard Dependencies (`dependencies`)
These are typical npm packages from the registry:
- React, TypeScript, FontAwesome, etc.
- Managed with standard `npm install` commands
- Automatically updated through standard npm workflows

### 2. Core Latin Dependencies (`coreLatinDependencies`)
These are specialized repositories that provide Latin text processing, Vulgate-specific functionality, and other domain-specific features:

```json
"coreLatinDependencies": {
  "universal-machine-assistance-vulgate": "git+https://github.com/universal-machine-assistance/vulgate.git"
}
```

**Why separate tracking?**
- These dependencies are critical to core functionality
- They may not follow standard npm versioning
- Updates require careful testing due to theological/textual accuracy
- Need to track releases and changes manually

## Managing Core Latin Dependencies

### Installation
```bash
# Install a core Latin dependency
npm install git+https://github.com/universal-machine-assistance/vulgate.git

# Add to coreLatinDependencies in package.json
# This enables tracking and documentation
```

### Checking for Updates
```bash
# Check for updates to core Latin dependencies
npm run check-latin-updates
```

### Updating Dependencies
```bash
# Update all core Latin dependencies
npm run update-latin-deps

# Or install specific version
npm install git+https://github.com/universal-machine-assistance/vulgate.git#v1.2.0
```

### Release Tracking

#### Setting Up Release Notifications
1. **GitHub Watch**: Go to each repository and click "Watch" → "Custom" → "Releases"
2. **GitHub CLI**: Use `gh repo watch [repo] --releases` for each core dependency
3. **Automation**: Set up GitHub Actions to check for new releases

#### Manual Monitoring Process
1. Weekly check of release pages for core dependencies
2. Review CHANGELOG.md files for breaking changes
3. Test in development environment before updating production
4. Document any integration changes required

## Validation and Testing

### Pre-Update Checklist
- [ ] Review release notes and breaking changes
- [ ] Check compatibility with current codebase
- [ ] Backup current working state
- [ ] Test in development environment
- [ ] Verify Latin text accuracy and formatting
- [ ] Test theological interpretation features
- [ ] Validate audio and media functionality

### Post-Update Verification
- [ ] All tests pass (when implemented)
- [ ] Latin text renders correctly
- [ ] Word analysis functions properly
- [ ] Audio features work as expected
- [ ] No regression in theological interpretations
- [ ] Performance benchmarks maintained

## Repository Information

### universal-machine-assistance/vulgate
- **Purpose**: [Add description once repository is confirmed]
- **Critical Features**: [List key features this provides]
- **Update Frequency**: [How often to check for updates]
- **Breaking Change Risk**: [High/Medium/Low]
- **Last Updated**: [Track manually]

## Integration Guidelines

### Adding New Core Dependencies
1. Evaluate the repository's:
   - Maintenance status and community
   - Documentation quality
   - Test coverage
   - Release cycle predictability
   - Latin/theological accuracy

2. Add to `coreLatinDependencies` section in package.json
3. Document in this file
4. Set up monitoring for releases
5. Create integration tests if needed

### Removing Dependencies
1. Document reason for removal
2. Plan migration strategy
3. Update documentation
4. Remove from tracking lists

## Troubleshooting

### Common Issues
1. **Git authentication errors**: Ensure SSH keys or tokens are configured
2. **Version conflicts**: Use specific commit hashes instead of branches
3. **Build failures**: Check for breaking changes in recent releases

### Emergency Rollback
```bash
# Rollback to previous working version
npm install git+https://github.com/universal-machine-assistance/vulgate.git#[previous-commit-hash]

# Update package.json to pin to that version
```

## Automation Opportunities

### Future Enhancements
1. **Automated Dependency Scanning**: Set up GitHub Actions to check for updates
2. **Integration Testing**: Automated tests for each dependency update
3. **Security Scanning**: Monitor for security issues in dependencies
4. **Documentation Generation**: Auto-generate dependency status reports

### GitHub Actions Example
```yaml
name: Check Core Latin Dependencies
on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly Monday at 9 AM
jobs:
  check-deps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for updates
        run: |
          # Check each repository for new releases
          # Create issue if updates are available
```

## Current Status

### Dependency Health Dashboard

| Repository | Current Version | Latest Release | Status | Last Checked |
|------------|----------------|----------------|--------|--------------|
| universal-machine-assistance/vulgate | main | - | ⚠️ Needs Verification | [Date] |

### Legend
- ✅ Up to date
- ⚠️ Update available
- ❌ Critical update needed
- 🔍 Needs verification

---

**Note**: This dependency management system ensures we maintain high-quality, accurate Latin text processing while staying current with improvements and security updates. 