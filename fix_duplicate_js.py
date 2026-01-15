"""
Fix duplicate JavaScript code rendering as visible text
Removes the duplicate SCHEDULING FUNCTIONS block (lines 2633-2818)
"""

def fix_duplicate_js():
    filepath = 'frontend/social_media_editor_v2.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"Original file has {len(lines)} lines")

    # Find the line with closing </script> at line 2632 (index 2631)
    # Then find the duplicate section that starts right after

    # The duplicate starts at line 2633 (index 2632) with the comment line
    # The duplicate ends at line 2818 (index 2817) with </script>

    # We need to remove lines 2633-2818 (indices 2632-2817)
    # But keep the first </script> at line 2632

    # Remove the duplicate JavaScript and the extra </script>
    fixed_lines = lines[:2632]  # Keep everything up to and including line 2632 (</script>)
    fixed_lines.extend(lines[2818:])  # Add everything after line 2818 (</script>)

    print(f"Fixed file will have {len(fixed_lines)} lines")
    print(f"Removed {len(lines) - len(fixed_lines)} lines")

    # Write the fixed content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)

    print("\n✓ Duplicate JavaScript code removed!")
    print("  - Removed lines 2633-2818 (duplicate SCHEDULING FUNCTIONS)")
    print("  - Fixed double </script></script> tag")
    print("\nThe visible white text should now be gone!")

if __name__ == '__main__':
    fix_duplicate_js()
