const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const srcDir = path.join(__dirname, "src");
const excludeDirs = ["node_modules", "build", "public", "dist"];
const fileExtensions = [".tsx", ".ts", ".jsx", ".js"];

// Regular expressions to find potential hardcoded text
const patterns = [
  /<[^>]*>([^<>{}\n]+)<\/[^>]*>/g, // Text between JSX tags
  /["']([^"']+)["']/g, // Quoted strings
];

// Patterns to ignore (common non-text strings)
const ignorePatterns = [
  /^[0-9.]+$/, // Numbers
  /^(https?:\/\/|www\.)/, // URLs
  /^[a-zA-Z0-9_-]+$/, // Single words (likely variable names)
  /^(true|false|null|undefined)$/, // JavaScript literals
  /^\s+$/, // Whitespace only
  /^[<>=!&|+\-*/%]+$/, // Operators
  /^#[0-9a-fA-F]{3,8}$/, // Color codes
  /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/, // File names or paths
  /^[{}[\],.:;()]+$/, // Punctuation
];

// Function to check if a string should be ignored
function shouldIgnore(str) {
  // Ignore short strings (likely not text)
  if (str.length < 3) return true;

  // Check against ignore patterns
  for (const pattern of ignorePatterns) {
    if (pattern.test(str)) return true;
  }

  return false;
}

// Function to find files recursively
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        findFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (fileExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Function to check a file for hardcoded text
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);
  let foundHardcodedText = false;

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();

      if (text && !shouldIgnore(text)) {
        if (!foundHardcodedText) {
          console.log(`\n\x1b[1m${relativePath}\x1b[0m`);
          foundHardcodedText = true;
        }

        // Get line number
        const lineNumber = content.substring(0, match.index).split("\n").length;
        console.log(`  Line ${lineNumber}: \x1b[33m${text}\x1b[0m`);
      }
    }
  });

  return foundHardcodedText;
}

// Main function
function main() {
  console.log("Searching for hardcoded text in the codebase...");

  const files = findFiles(srcDir);
  let totalHardcodedFiles = 0;

  files.forEach((file) => {
    const hasHardcodedText = checkFile(file);
    if (hasHardcodedText) {
      totalHardcodedFiles++;
    }
  });

  console.log(
    `\nFound potential hardcoded text in ${totalHardcodedFiles} files out of ${files.length} total files.`
  );
  console.log(
    "Review these instances and consider moving them to translation files."
  );
}

main();
