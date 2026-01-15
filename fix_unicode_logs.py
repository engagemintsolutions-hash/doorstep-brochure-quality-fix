"""
Fix Unicode characters in logger statements for Windows compatibility.
Replaces emoji characters with ASCII-safe alternatives.
"""
import re
from pathlib import Path

# Emoji mappings to ASCII-safe alternatives
EMOJI_REPLACEMENTS = {
    '📱': '[MOBILE]',
    '❌': '[X]',
    '✅': '[OK]',
    '📄': '[DOC]',
    '📂': '[FOLDER]',
    '📁': '[FOLDER]',
    '🔄': '[REFRESH]',
    '🔥': '[FIRE]',
    '🔍': '[SEARCH]',
    '📝': '[EDIT]',
    '💾': '[SAVE]',
    '⚠️': '[WARN]',
    '⚡': '[FAST]',
    '💰': '[COST]',
    '🎯': '[TARGET]',
    '🤖': '[AI]',
}

def fix_file(file_path: Path):
    """Remove emoji characters from logger statements in a file."""
    try:
        # Read file with UTF-8 encoding
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        replacements_made = []
        # Replace each emoji
        for emoji, replacement in EMOJI_REPLACEMENTS.items():
            if emoji in content:
                content = content.replace(emoji, replacement)
                replacements_made.append(replacement)

        # Write back if changed
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"[OK] Fixed: {file_path.relative_to(Path.cwd())} ({len(replacements_made)} replacements)")
            return True
        return False
    except Exception as e:
        print(f"[ERROR] Error fixing {file_path}: {e}")
        return False

def main():
    """Fix all Python files in backend and services directories."""
    base_dir = Path(__file__).parent

    directories = [
        base_dir / 'backend',
        base_dir / 'services',
    ]

    files_fixed = 0
    for directory in directories:
        if not directory.exists():
            continue

        print(f"\nScanning {directory.name}/...")
        for py_file in directory.glob('*.py'):
            if fix_file(py_file):
                files_fixed += 1

    print(f"\n{'='*50}")
    print(f"Fixed {files_fixed} file(s)")

if __name__ == '__main__':
    main()
