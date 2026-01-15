"""
Remove duplicate scheduling modal from social_media_editor_v2.html
The file has TWO complete modal sections which is causing issues
"""

def remove_duplicate_modal():
    filepath = 'frontend/social_media_editor_v2.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"Original file has {len(lines)} lines")

    # Find the SECOND modal (duplicate) and remove it
    # First modal is around line 1602
    # Second modal is around line 1647
    # We need to find and remove lines 1646-1688 (second modal block)

    # Read the whole file to find the exact duplicate section
    content = ''.join(lines)

    # The duplicate starts after the first closing </div> of the first modal
    # And includes another complete "<!-- Scheduling Modal -->" block

    # Find the second occurrence of "<!-- Scheduling Modal -->"
    first_occurrence = content.find("<!-- Scheduling Modal -->")
    if first_occurrence != -1:
        second_occurrence = content.find("<!-- Scheduling Modal -->", first_occurrence + 1)

        if second_occurrence != -1:
            print(f"Found duplicate modal starting at position {second_occurrence}")

            # Find the end of the second modal (find its closing </div>)
            # The modal ends with </div>\n\n    <script>
            modal_end = content.find("</div>\n\n    <script>", second_occurrence)

            if modal_end != -1:
                # Remove the duplicate modal block
                fixed_content = content[:second_occurrence] + content[modal_end + 6:]  # +6 to include </div>

                # Write the fixed content
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)

                removed_chars = len(content) - len(fixed_content)
                print(f"Removed {removed_chars} characters (duplicate modal)")
                print("\nDuplicate scheduling modal removed!")
            else:
                print("Could not find modal end")
        else:
            print("No duplicate modal found")
    else:
        print("No modal found at all")

if __name__ == '__main__':
    remove_duplicate_modal()
