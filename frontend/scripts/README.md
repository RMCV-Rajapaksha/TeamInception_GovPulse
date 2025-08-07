# Component Generation Script

This script helps you quickly create React components with the proper structure and naming conventions.

## Usage

```bash
npm run create-component <component-name>
```

## Examples

```bash
# Create a simple component
npm run create-component button

# Create a component with kebab-case (will be converted to PascalCase)
npm run create-component user-profile

# Create a component with multiple words
npm run create-component navigation-menu
```

## What it creates

For a component named `my-component`, the script will:

1. Create a folder: `src/components/my-component/`
2. Create a file: `src/components/my-component/MyComponent.tsx`
3. The component will have the basic structure:

```tsx
import React from "react";

const MyComponent = () => {
  return <div>MyComponent</div>;
};

export default MyComponent;
```

## Naming Conventions

- **Folder name**: Uses the exact name you provide (kebab-case recommended)
- **Component name**: Automatically converted to PascalCase
- **File name**: Same as component name with `.tsx` extension

## Import Usage

After creating a component, you can import it like this:

```tsx
import MyComponent from "@/components/my-component/MyComponent";
```
