#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to create component name from kebab-case
const toPascalCase = (str) => {
  return str.split('-').map(capitalize).join('');
};

// Main function to generate component
function generateComponent(componentName) {
  const pascalCaseName = toPascalCase(componentName);
  const componentsDir = path.join(path.dirname(__dirname), 'src', 'components');
  
  // Create components directory if it doesn't exist
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const componentDir = path.join(componentsDir, componentName);
  
  // Create component directory
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }
  
  // Create component file with the basic structure
  const componentFile = path.join(componentDir, `${pascalCaseName}.tsx`);
  const componentContent = `import React from "react";

const ${pascalCaseName} = () => {
  return <div>${pascalCaseName}</div>;
};

export default ${pascalCaseName};
`;
  
  fs.writeFileSync(componentFile, componentContent);
  
  console.log(`✅ Created component: ${pascalCaseName}`);
  console.log(`📁 Location: ${componentDir}`);
  console.log(`📄 File created: ${pascalCaseName}.tsx`);
  console.log(``);
  console.log(`💡 Usage:`);
  console.log(`   import ${pascalCaseName} from '@/components/${componentName}/${pascalCaseName}';`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const componentName = args[0];

if (!componentName) {
  console.error('❌ Error: Component name is required');
  console.log('Usage: npm run create-component <component-name>');
  process.exit(1);
}

// Generate the component
generateComponent(componentName); 