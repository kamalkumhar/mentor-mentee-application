// Script to add mobile optimizations to all HTML files
const fs = require('fs');
const path = require('path');

// Directories to search for HTML files
const directories = [
  'public/student',
  'public/mentor',
  'public'
];

// Files to update (add mobile CSS and JS)
function updateHTMLFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has mobile-optimizations.css
    if (content.includes('mobile-optimizations.css')) {
      console.log(`✓ Already optimized: ${filePath}`);
      return;
    }
    
    // Determine the correct path based on file location
    let cssPath, jsPath;
    if (filePath.includes('public/student') || filePath.includes('public/mentor')) {
      cssPath = '../css/mobile-optimizations.css';
      jsPath = '../js/mobile-menu.js';
    } else {
      cssPath = 'css/mobile-optimizations.css';
      jsPath = 'js/mobile-menu.js';
    }
    
    // Add mobile CSS after modern-styles.css
    if (content.includes('modern-styles.css') && !content.includes('mobile-optimizations.css')) {
      content = content.replace(
        /(<link rel="stylesheet" href="[\.\/]*css\/modern-styles\.css">)/,
        `$1\n  <link rel="stylesheet" href="${cssPath}">`
      );
    }
    
    // Add mobile JS before closing </head> tag
    if (!content.includes('mobile-menu.js')) {
      content = content.replace(
        /<\/head>/,
        `  <script src="${jsPath}" defer></script>\n</head>`
      );
    }
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
}

// Recursively find all HTML files
function findHTMLFiles(dir) {
  const files = fs.readdirSync(dir);
  const htmlFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      htmlFiles.push(...findHTMLFiles(filePath));
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  });
  
  return htmlFiles;
}

// Main execution
console.log('Adding mobile optimizations to HTML files...\n');

directories.forEach(dir => {
  const htmlFiles = findHTMLFiles(dir);
  htmlFiles.forEach(updateHTMLFile);
});

console.log('\n✓ Mobile optimization script completed!');
