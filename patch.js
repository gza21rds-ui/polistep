const fs = require('fs');
let code = fs.readFileSync('src/components/SnsShareGenerator.jsx', 'utf8');

// Move early return down
code = code.replace("  if (!visible) return null;\n\n", "");

// Find `const handleDownload` and insert the early return above it
code = code.replace("  const handleDownload = () => {", "  if (!visible) return null;\n\n  const handleDownload = () => {");

// Add useEffect to dependency array of drawCanvas if it isn't already there?
// Wait, drawCanvas is declared at line 30, useEffect is at line 9.
// If we move the early return down, the useEffect is NO LONGER conditionally called!
// It will be called on EVERY render. Which is CORRECT for hooks!
// But wait, if drawCanvas is declared after useEffect, it's still a ReferenceError.
// Let's just swap useEffect and drawCanvas!
let effectMatch = code.match(/  useEffect\(\(\) => \{[\s\S]*?  \}, \[.*?\]\);\n\n/);
if (effectMatch) {
  code = code.replace(effectMatch[0], "");
  code = code.replace("  const handleDownload = () => {", effectMatch[0] + "  const handleDownload = () => {");
}

fs.writeFileSync('src/components/SnsShareGenerator.jsx', code);
