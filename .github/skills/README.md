# Agent Skills Documentation

This directory contains AI Agent Skills that enhance GitHub Copilot's capabilities for this frontend project. These skills provide specialized guidance and automation for common development tasks.

## Available Skills

### 1. Frontend Appearance Optimization

**Location**: `.github/skills/frontend-appearance-optimization/`

Optimizes frontend UI/UX with theme management and internationalization.

**Key Topics**:

- Dark/light theme configuration
- Theme switching and persistence
- Chinese language as default
- Color scheme guidelines
- i18n implementation

**Use Cases**:

- Implementing theme switching
- Adding dark mode support
- Setting up multi-language support
- Ensuring consistent UI across themes

**Related Files**:

- `src/core/context/ThemeContext.tsx`
- `packages/utils/src/context/ThemeContext.tsx`
- `packages/utils/src/i18n/`
- `tailwind.config.js`

---

### 2. Frontend Code Standards

**Location**: `.github/skills/frontend-code-standards/`

Enforces code quality and maintainability standards for the entire project.

**Key Topics**:

- 200-line file limit enforcement
- Component structure patterns
- File splitting strategies
- Directory organization
- Import organization

**Use Cases**:

- Refactoring large components
- Creating new components
- Organizing project structure
- Enforcing code style
- Improving maintainability

**Related Files**:

- `scripts/check-line-count.js`
- `REFACTORING_GUIDE.md`
- `src/` directory

**Verification Command**:

```bash
npm run check:lines
```

---

### 3. Frontend Production Readiness

**Location**: `.github/skills/frontend-production-readiness/`

Ensures production readiness with build validation, error handling, performance, accessibility, and security checks.

**Key Topics**:

- Build and type-safety validation
- Error handling and loading states
- Performance and UX stability
- Accessibility requirements
- Secure configuration practices
- Reusability and clean code

**Use Cases**:

- Final validation before release
- Refactors with new hooks or services
- Permission-based UI changes
- Performance-sensitive UI updates

**Related Files**:

- `src/`
- `packages/utils/src/i18n/`
- `src/core/services/`

---

### 4. GitHub Actions Code Optimization

**Location**: `.github/skills/github-actions-code-optimization/`

Sets up and documents automated CI/CD workflows for code quality and deployment.

**Key Topics**:

- Workflow setup and configuration
- Linting and format checking
- Type checking automation
- Build processes
- Deployment pipelines
- Security scanning

**Use Cases**:

- Setting up CI/CD pipelines
- Automating code quality checks
- Building and deploying applications
- Running security audits
- Validating pull requests

**Related Files**:

- `.github/workflows/ci.yml`
- `.github/workflows/code-quality.yml`
- `.github/workflows/build-deploy.yml`

**Workflows**:

- **ci.yml**: Basic linting, formatting, type checking
- **code-quality.yml**: Extended quality checks, security scans
- **build-deploy.yml**: Build, test, and deployment steps

---

### 4. File Structure Optimization

**Location**: `.github/skills/file-structure-optimization/`

Provides comprehensive guidance for organizing project files and folders.

**Key Topics**:

- Core module organization
- Features-based architecture
- Shared modules organization
- Packages structure
- File naming conventions
- Import path standards
- Migration strategies

**Use Cases**:

- Reorganizing project files
- Creating new features
- Moving files between modules
- Establishing file naming conventions
- Improving code discoverability

**Related Files**:

- `src/` directory structure
- `packages/` directory structure
- `src/features/` feature modules
- `src/core/` core infrastructure

---

## How to Use Skills

### Automatic Loading

Skills are automatically loaded by GitHub Copilot when your request matches the skill's description. You don't need to manually activate them.

## Authoring Best Practices

The following guidance is based on the Agent Skills standard:

- Use clear, task-specific names and descriptions.
- Specify when the skill should be used and when it should not.
- Provide step-by-step instructions with expected inputs and outputs.
- Include small, focused examples and link to resources using relative paths.
- Keep the content concise and avoid unnecessary repetition.
- Rely on progressive disclosure: keep the frontmatter lightweight and place details in the body.

## Content Rules

- Do not use emoji in code, logs, or documentation.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Keep comments minimal and in English.

### Manual Activation

You can explicitly reference a skill in your prompt:

```
@Copilot Use the "frontend-code-standards" skill to help refactor this component under 200 lines.
```

### Progressive Loading

Skills use three-level loading for efficiency:

1. **Level 1**: Skill discovery (name + description only)
2. **Level 2**: Instruction loading (full SKILL.md content)
3. **Level 3**: Resource access (helper scripts, examples)

This ensures minimal context usage while providing comprehensive help when needed.

---

## Skill Structure

Each skill directory contains:

```
.github/skills/[skill-name]/
├── SKILL.md              # Main skill documentation
├── examples/             # (Optional) Example files
│   └── example-*.ts
├── templates/            # (Optional) Reusable templates
│   └── template-*.ts
└── scripts/              # (Optional) Helper scripts
    └── helper.js
```

### SKILL.md Format

```yaml
---
name: skill-identifier
description: What this skill does and when to use it
---

# Skill Instructions

## Purpose
What problem does this solve?

## When to Use
Specific scenarios for this skill

## Step-by-Step Instructions
How to implement/use this skill

## Expected Input/Output
What you provide and what you get

## Validation Checklist
How to verify it worked

## Related Resources
Links to relevant documentation
```

---

## Project Integration

### CI/CD Pipeline

These skills are integrated with GitHub Actions workflows:

1. **Pull Request**: Skills guide code review and quality checks
2. **Before Merge**: Automated workflows verify compliance
3. **After Merge**: Deployment workflows use skill patterns

### Development Workflow

1. Create/modify code
2. Skills auto-suggest improvements
3. Run verification scripts
4. GitHub Actions validates against skill standards
5. Merge when all checks pass

---

## Skill Effectiveness Metrics

### Frontend Appearance Optimization

- **Status**: Active
- **Coverage**: Theme context, i18n setup
- **Files Affected**: 5+ components
- **Test Coverage**: Theme switching verified

### Frontend Code Standards

- **Status**: In Progress
- **Coverage**: 36 files need refactoring
- **Target**: All files under 200 lines
- **Timeline**: 3-4 weeks

### GitHub Actions Code Optimization

- **Status**: Configured
- **Workflows**: 3 workflows enabled
- **Frequency**: Every PR and push
- **Coverage**: Lint, format, type, build, deploy

### File Structure Optimization

- **Status**: Planning Phase
- **Target**: Reorganize core/, features/, shared/
- **Impact**: 100+ files to reorganize
- **Timeline**: 2-4 weeks

---

## Extending Skills

To create a new skill:

1. Create a new directory: `.github/skills/[new-skill-name]/`
2. Create `SKILL.md` with required frontmatter
3. Add helper scripts or templates if needed
4. Test with GitHub Copilot

Example:

```bash
mkdir -p .github/skills/testing-strategies
touch .github/skills/testing-strategies/SKILL.md
```

---

## Best Practices

### For Developers

1. Review relevant skill documentation before starting
2. Run verification scripts (e.g., `npm run check:lines`)
3. Follow patterns documented in skills
4. Ask Copilot when unsure (it will suggest relevant skills)

### For Teams

1. Keep skills updated with project changes
2. Use skills in code reviews
3. Reference skills in PR comments
4. Measure skill adoption and effectiveness

### For Copilot Interactions

1. Be specific about which skill to use
2. Reference the skill name in your prompt
3. Provide context about what you're trying to do
4. Include file paths or code snippets for clarity

---

## Related Documentation

- **[REFACTORING_GUIDE.md](../REFACTORING_GUIDE.md)**: Detailed refactoring strategy
- **[PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md)**: Production readiness verification
- **[src/README.md](../src/README.md)**: Source code organization
- **[src/features/README.md](../src/features/README.md)**: Feature structure

---

## Verification Commands

Run these commands to verify skill compliance:

```bash
# Check file size compliance
npm run check:lines

# Check i18n configuration
npm run check:i18n

# Verify TypeScript types
npm run type-check

# Run linting
npm run lint

# Format check
npm run format:check

# Full CI check
npm run ci:check
```

---

## External Resources

- [Agent Skills Standard](https://agentskills.io/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Skills Documentation](https://vscode.com.tw/docs/copilot/customization/agent-skills)
- [React Best Practices](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support

For questions about skills:

1. Check skill documentation in `.github/skills/[skill-name]/SKILL.md`
2. Ask GitHub Copilot to reference the specific skill
3. Review related documentation files
4. Check project issues and discussions

---

**Skills Version**: 1.0.0
**Last Updated**: February 3, 2026
**Maintainer**: Development Team

For more information about implementing skills, see the [Agent Skills Documentation](https://vscode.com.tw/docs/copilot/customization/agent-skills).
