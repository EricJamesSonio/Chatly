#!/bin/bash
# show-structure.sh — Pretty auto-updating folder & file tree

// run command : chmod +x show-structure.sh
// show : ./show-structure.sh

clear
echo "📁 Project structure for: $(basename "$PWD")"
echo "============================================="
echo

# Check if 'tree' exists
if command -v tree &> /dev/null
then
    # --dirsfirst → folders first
    # -C → enable colors
    # -a → include hidden files (except .git & node_modules)
    # -I → ignore node_modules and .git
    tree -a -C --dirsfirst -I "node_modules|.git" -L 5
else
    echo "(tip: install 'tree' for better output)"
    # fallback: show both files and folders
    find . -not -path "*/node_modules/*" -not -path "*/.git/*" | sed 's|[^/]*/|  |g'
fi

echo
echo "✅ Done!"