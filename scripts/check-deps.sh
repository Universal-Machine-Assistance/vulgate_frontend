#!/bin/bash

# Manual dependency checker for core Latin dependencies
# Usage: ./scripts/check-deps.sh

set -e

echo "🔍 Vulgate Frontend - Core Latin Dependency Checker"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is required but not installed. Please install jq first.${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Extract core dependencies
if ! jq -e '.coreLatinDependencies' package.json > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  No core Latin dependencies found in package.json${NC}"
    exit 0
fi

echo -e "${BLUE}📦 Found core Latin dependencies:${NC}"
jq -r '.coreLatinDependencies | keys[]' package.json | sed 's/^/  - /'
echo ""

# Check each dependency
jq -r '.coreLatinDependencies | to_entries[] | "\(.key) \(.value)"' package.json | while IFS= read -r line; do
    if [ -n "$line" ]; then
        REPO_NAME=$(echo "$line" | cut -d' ' -f1)
        REPO_URL=$(echo "$line" | cut -d' ' -f2)
        
        echo -e "${BLUE}🔍 Checking: ${REPO_NAME}${NC}"
        echo "   URL: $REPO_URL"
        
        # Extract GitHub repo from URL
        if [[ $REPO_URL == *"github.com"* ]]; then
            GITHUB_REPO=$(echo "$REPO_URL" | sed -n 's/.*github\.com\/\([^/]*\/[^/.]*\).*/\1/p')
            
            if [ -n "$GITHUB_REPO" ]; then
                echo "   GitHub Repo: $GITHUB_REPO"
                
                # Check if repository exists
                HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$GITHUB_REPO")
                
                if [ "$HTTP_STATUS" = "200" ]; then
                    echo -e "   ${GREEN}✅ Repository accessible${NC}"
                    
                    # Get latest release
                    LATEST_RELEASE=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/releases/latest" | jq -r '.tag_name // "no-releases"')
                    if [ "$LATEST_RELEASE" != "no-releases" ]; then
                        RELEASE_DATE=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/releases/latest" | jq -r '.published_at // "unknown"')
                        echo "   📋 Latest Release: $LATEST_RELEASE ($RELEASE_DATE)"
                    else
                        echo -e "   ${YELLOW}⚠️  No releases found${NC}"
                    fi
                    
                    # Get latest commit
                    LATEST_COMMIT=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/commits?per_page=1" | jq -r '.[0].sha[0:7] // "unknown"')
                    COMMIT_DATE=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/commits?per_page=1" | jq -r '.[0].commit.committer.date // "unknown"')
                    echo "   🔄 Latest Commit: $LATEST_COMMIT ($COMMIT_DATE)"
                    
                    # Check if it's a fork
                    IS_FORK=$(curl -s "https://api.github.com/repos/$GITHUB_REPO" | jq -r '.fork // false')
                    if [ "$IS_FORK" = "true" ]; then
                        echo -e "   ${YELLOW}⚠️  This is a fork${NC}"
                    fi
                    
                else
                    echo -e "   ${RED}❌ Repository not accessible (HTTP $HTTP_STATUS)${NC}"
                fi
            else
                echo -e "   ${RED}❌ Could not parse GitHub repository from URL${NC}"
            fi
        else
            echo -e "   ${YELLOW}⚠️  Non-GitHub repository (manual checking required)${NC}"
        fi
        
        echo ""
    fi
done

echo -e "${GREEN}✅ Dependency check completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Review any warnings or errors above"
echo "  2. Check release notes for any available updates"
echo "  3. Test updates in development environment"
echo "  4. Update docs/DEPENDENCY_MANAGEMENT.md with current status"
echo ""
echo "🤖 To run automated monitoring:"
echo "  - GitHub Actions will check weekly"
echo "  - Manual trigger: Go to Actions → Check Core Latin Dependencies → Run workflow" 