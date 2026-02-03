---
name: github-actions-code-optimization
description: Set up GitHub Actions workflows for automated code quality, linting, testing, and deployment. Includes CI/CD pipelines for code style enforcement, type checking, security scanning, and automated builds to ensure production-ready code standards.
---

# GitHub Actions Code Optimization Skill

## Purpose

This skill establishes automated code quality and optimization workflows using GitHub Actions. These workflows ensure consistent code standards, catch issues early, and maintain production-ready code without manual intervention.

## When to Use

- Setting up CI/CD pipelines for new projects
- Automating code quality checks
- Enforcing linting and formatting standards
- Running automated tests on pull requests
- Building and deploying applications
- Securing dependencies and code
- Validating commit messages and PRs

## Content Rules

- Do not use emoji in workflow logs or documentation.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Keep comments minimal and in English.

## GitHub Actions Workflow Setup

### 1. Workflow File Structure

```
.github/workflows/
├── lint-and-format.yml      # ESLint, Prettier, TypeScript checks
├── test.yml                 # Jest tests and coverage
├── code-quality.yml         # Code quality and security scans
├── build.yml                # Build and bundle validation
├── deploy.yml               # Deployment to production
└── pr-validation.yml        # PR validation and checks
```

### 2. Lint and Format Workflow

**File:** `.github/workflows/lint-and-format.yml`

```yaml
name: Lint & Format

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint
        continue-on-error: false

      - name: Check TypeScript
        run: npm run type-check
        continue-on-error: false

      - name: Check Formatting (Prettier)
        run: npm run format:check
        continue-on-error: false

      - name: Validate i18n translations
        run: npm run check:i18n
        continue-on-error: false
```

### 3. Code Quality and Security Workflow

**File:** `.github/workflows/code-quality.yml`

```yaml
name: Code Quality

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check file sizes
        run: npm run check:filesize
        continue-on-error: true

      - name: Check for console logs
        run: grep -r "console\." src --include="*.ts" --include="*.tsx" || echo "No console logs found"
        continue-on-error: true

      - name: Security audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'JSON'
          args: >
            -l
            --enable javascript
        continue-on-error: true

      - name: Upload OWASP Results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: dependency-check-report.sarif
```

### 4. Build Workflow

**File:** `.github/workflows/build.yml`

```yaml
name: Build

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Validate bundle
        run: npm run build:analyze
        continue-on-error: true

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 5
```

### 5. Test Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false
```

### 6. PR Validation Workflow

**File:** `.github/workflows/pr-validation.yml`

```yaml
name: PR Validation

on:
  pull_request:
    types: [opened, synchronize, edited]

permissions:
  pull-requests: write
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Validate PR title
        run: |
          TITLE="${{ github.event.pull_request.title }}"
          if [[ ! "$TITLE" =~ ^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?:.+ ]]; then
            echo "PR title must follow Conventional Commits format"
            echo "Examples: feat(ui): add dark mode toggle, fix(api): resolve auth issue"
            exit 1
          fi
          echo "PR title is valid"

      - name: Check PR description
        run: |
          BODY="${{ github.event.pull_request.body }}"
          if [ -z "$BODY" ] || [ ${#BODY} -lt 20 ]; then
            echo "PR description is empty or too short"
            exit 1
          fi
          echo "PR has adequate description"

      - name: Check file count
        run: |
          FILE_COUNT=$(echo "${{ github.event.pull_request.changed_files }}")
          if [ $FILE_COUNT -gt 50 ]; then
            echo "Large PR detected ($FILE_COUNT files). Consider splitting into smaller PRs."
          fi
```

## Workflow Integration Checklist

- [ ] All workflows are placed in `.github/workflows/`
- [ ] Workflows have clear, descriptive names
- [ ] Environment variables are properly configured
- [ ] Matrix strategies are used for multiple Node versions
- [ ] Dependencies are cached for faster builds
- [ ] Artifacts are uploaded for inspection
- [ ] Coverage reports are generated
- [ ] Security checks are automated
- [ ] PR validations are enforced
- [ ] Notifications are configured for failures

## Required npm Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "vite build",
    "build:analyze": "vite build --analyze",
    "check:i18n": "node scripts/check-i18n.cjs",
    "check:filesize": "bundlesize"
  }
}
```

## Workflow Best Practices

### 1. Use Caching for Speed

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm' # Caches node_modules
```

### 2. Fail Fast with Multiple Jobs

```yaml
jobs:
  lint:
    # Run quickly
  test:
    needs: lint # Wait for lint to pass
  build:
    needs: [lint, test] # Wait for both
```

### 3. Continue on Non-Critical Errors

```yaml
- name: Security audit
  run: npm audit
  continue-on-error: true # Don't block if vulnerabilities found
```

### 4. Use Matrix for Coverage

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    os: [ubuntu-latest, macos-latest]
```

## Environment Variables

Create `.github/workflows/env.yml` for shared configuration:

```yaml
env:
  NODE_ENV: ci
  CI: true
  COVERAGE_THRESHOLD: 80
  BUNDLE_SIZE_LIMIT: 500kb
```

## Secrets Management

Store sensitive data in GitHub Secrets:

```yaml
- name: Deploy to production
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
    API_TOKEN: ${{ secrets.API_TOKEN }}
  run: npm run deploy
```

## Monitoring and Notifications

### Slack Integration (Optional)

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Build failed for ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Build for *${{ github.event.pull_request.title }}* failed"
            }
          }
        ]
      }
```

## Common Issues & Solutions

### Issue: npm ci is too slow

**Solution:** Enable caching with `cache: 'npm'` in setup-node

### Issue: Workflows timeout

**Solution:**

- Run linting and tests in parallel
- Use matrix strategy
- Optimize build process

### Issue: Dependencies fail to install

**Solution:**

- Clear cache: `github.event.action == 'opened'`
- Use `npm ci` instead of `npm install`
- Check Node version compatibility

## Validation Scripts

Create helper scripts for automation:

**scripts/check-line-count.js**

- Validates all TSX files under 200 lines
- Reports violations with file paths

**scripts/check-i18n.cjs**

- Ensures all translation keys are complete
- Validates no hardcoded strings in components

## Related Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Act - Run GitHub Actions Locally](https://github.com/nektos/act)
- [ESLint Configuration](https://eslint.org/docs/rules/)
- [Prettier Setup Guide](https://prettier.io/docs/en/index.html)
