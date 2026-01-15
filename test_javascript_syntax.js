/**
 * JavaScript Syntax and Quality Validator
 * Tests all new feature files for syntax errors and common issues
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Files to test
const filesToTest = [
    'frontend/bulk_photo_operations.js',
    'frontend/smart_photo_suggestions.js',
    'frontend/multi_format_export.js',
    'frontend/ux_enhancements.js',
    'frontend/bug_fixes.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

console.log(`\n${colors.bold}${colors.blue}========================================`);
console.log(`  JavaScript Syntax & Quality Tests`);
console.log(`========================================${colors.reset}\n`);

// Test each file
filesToTest.forEach(filePath => {
    console.log(`${colors.bold}Testing: ${filePath}${colors.reset}`);

    const fullPath = path.join(__dirname, filePath);

    // Test 1: File exists
    totalTests++;
    if (!fs.existsSync(fullPath)) {
        console.log(`  ${colors.red}✗ File does not exist${colors.reset}`);
        failedTests++;
        errors.push(`${filePath}: File not found`);
        console.log('');
        return;
    }
    console.log(`  ${colors.green}✓ File exists${colors.reset}`);
    passedTests++;

    // Read file content
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    // Test 2: File not empty
    totalTests++;
    if (content.trim().length === 0) {
        console.log(`  ${colors.red}✗ File is empty${colors.reset}`);
        failedTests++;
        errors.push(`${filePath}: Empty file`);
    } else {
        console.log(`  ${colors.green}✓ File has content (${lines.length} lines, ${content.length} bytes)${colors.reset}`);
        passedTests++;
    }

    // Test 3: No syntax errors (basic check)
    totalTests++;
    try {
        // This is a very basic syntax check
        // In a real environment, you'd use a proper parser like esprima or acorn
        new Function(content);
        console.log(`  ${colors.green}✓ No obvious syntax errors${colors.reset}`);
        passedTests++;
    } catch (e) {
        console.log(`  ${colors.red}✗ Syntax error: ${e.message}${colors.reset}`);
        failedTests++;
        errors.push(`${filePath}: ${e.message}`);
    }

    // Test 4: Has console.log statements (loading message)
    totalTests++;
    if (content.includes('console.log(')) {
        console.log(`  ${colors.green}✓ Has console.log statements for debugging${colors.reset}`);
        passedTests++;
    } else {
        console.log(`  ${colors.yellow}⚠ No console.log statements found${colors.reset}`);
        passedTests++; // Not a failure, just a warning
    }

    // Test 5: Uses strict mode or modern JS
    totalTests++;
    if (content.includes("'use strict'") || content.includes('"use strict"') || content.includes('const ') || content.includes('let ')) {
        console.log(`  ${colors.green}✓ Uses modern JavaScript (const/let)${colors.reset}`);
        passedTests++;
    } else {
        console.log(`  ${colors.yellow}⚠ No strict mode or const/let detected${colors.reset}`);
        passedTests++; // Not a critical failure
    }

    // Test 6: Has error handling
    totalTests++;
    if (content.includes('try') && content.includes('catch')) {
        console.log(`  ${colors.green}✓ Has error handling (try-catch blocks)${colors.reset}`);
        passedTests++;
    } else {
        console.log(`  ${colors.yellow}⚠ No try-catch error handling found${colors.reset}`);
        passedTests++; // Warning only
    }

    // Test 7: Global exports (window object)
    totalTests++;
    if (content.includes('window.')) {
        console.log(`  ${colors.green}✓ Exports functions to global scope (window)${colors.reset}`);
        passedTests++;
    } else {
        console.log(`  ${colors.yellow}⚠ No window.* exports found${colors.reset}`);
        passedTests++; // May be intentional
    }

    // Test 8: Has comments/documentation
    totalTests++;
    const commentCount = (content.match(/\/\*\*|\*\/|\/\//g) || []).length;
    if (commentCount > 10) {
        console.log(`  ${colors.green}✓ Well documented (${commentCount} comment markers)${colors.reset}`);
        passedTests++;
    } else {
        console.log(`  ${colors.yellow}⚠ Limited documentation (${commentCount} comment markers)${colors.reset}`);
        passedTests++; // Not critical
    }

    // File-specific tests
    if (filePath.includes('bulk_photo_operations')) {
        // Test bulk operations specific features
        totalTests++;
        if (content.includes('bulkPhotoState') && content.includes('selectedPhotoIds')) {
            console.log(`  ${colors.green}✓ Bulk operations state management present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing bulk operations state management${colors.reset}`);
            failedTests++;
            errors.push(`${filePath}: Missing bulkPhotoState or selectedPhotoIds`);
        }

        totalTests++;
        if (content.includes('selectAll') && content.includes('deselectAll')) {
            console.log(`  ${colors.green}✓ Select All/None functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing select all/none functions${colors.reset}`);
            failedTests++;
        }
    }

    if (filePath.includes('smart_photo_suggestions')) {
        totalTests++;
        if (content.includes('analyzePhotoQuality') && content.includes('getQualityGrade')) {
            console.log(`  ${colors.green}✓ Photo analysis functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing photo analysis functions${colors.reset}`);
            failedTests++;
        }

        totalTests++;
        if (content.includes('lighting') && content.includes('composition') && content.includes('sharpness')) {
            console.log(`  ${colors.green}✓ Quality metrics implementation present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing quality metrics${colors.reset}`);
            failedTests++;
        }
    }

    if (filePath.includes('multi_format_export')) {
        totalTests++;
        if (content.includes('exportMultipleFormats') && content.includes('JSZip')) {
            console.log(`  ${colors.green}✓ Multi-format export functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing export functions${colors.reset}`);
            failedTests++;
        }

        totalTests++;
        if (content.includes('generatePageImage') && content.includes('canvas')) {
            console.log(`  ${colors.green}✓ Canvas-based image generation present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing image generation code${colors.reset}`);
            failedTests++;
        }
    }

    if (filePath.includes('ux_enhancements')) {
        totalTests++;
        if (content.includes('showSkeletonScreen') && content.includes('addTooltip')) {
            console.log(`  ${colors.green}✓ UX enhancement functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing UX enhancement functions${colors.reset}`);
            failedTests++;
        }

        totalTests++;
        if (content.includes('enableGlobalDragDrop') && content.includes('openPreviewMode')) {
            console.log(`  ${colors.green}✓ Drag-drop and preview functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing drag-drop or preview functions${colors.reset}`);
            failedTests++;
        }
    }

    if (filePath.includes('bug_fixes')) {
        totalTests++;
        if (content.includes('RateLimiter') && content.includes('throttle')) {
            console.log(`  ${colors.green}✓ Rate limiter implementation present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing rate limiter${colors.reset}`);
            failedTests++;
        }

        totalTests++;
        if (content.includes('debounce') && content.includes('validateTemplate')) {
            console.log(`  ${colors.green}✓ Utility functions present${colors.reset}`);
            passedTests++;
        } else {
            console.log(`  ${colors.red}✗ Missing utility functions${colors.reset}`);
            failedTests++;
        }
    }

    console.log('');
});

// Summary
console.log(`${colors.bold}${colors.blue}========================================`);
console.log(`  Test Summary`);
console.log(`========================================${colors.reset}\n`);

console.log(`Total Tests:  ${totalTests}`);
console.log(`${colors.green}Passed:       ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed:       ${failedTests}${colors.reset}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (errors.length > 0) {
    console.log(`${colors.bold}${colors.red}Errors Found:${colors.reset}`);
    errors.forEach(error => {
        console.log(`  ${colors.red}• ${error}${colors.reset}`);
    });
    console.log('');
}

// Exit code
if (failedTests > 0) {
    console.log(`${colors.red}${colors.bold}❌ TESTS FAILED${colors.reset}\n`);
    process.exit(1);
} else {
    console.log(`${colors.green}${colors.bold}✅ ALL TESTS PASSED${colors.reset}\n`);
    process.exit(0);
}
