# finding-files

[![CI](https://github.com/MarquesThomasCoding/finding-files/actions/workflows/ci.yml/badge.svg)](https://github.com/MarquesThomasCoding/finding-files/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@imprion91%2Ffinding-files.svg?icon=si%3Anpm)](https://badge.fury.io/js/@imprion91%2Ffinding-files)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A simple and efficient npm library for finding files in a webpage.

## Installation

```bash
npm install @imprion91/finding-files
```

or with yarn:

```bash
yarn add @imprion91/finding-files
```

## Usage

### Import ES Modules

```typescript
import { FileFinder, createFileFinder, findAllFiles } from '@imprion91/finding-files';
import type { FileInfo, FindFilesOptions } from '@imprion91/finding-files';

// Example usage
const finder = new FileFinder({
    includeImages: true,
    includeCSS: true,
    includeJS: true,
});

finder.findFiles().then((files) => {
    console.log('All files:', files);

    // Filter only CSS files
    const cssFiles = finder.filterByType(files, 'css');
    console.log('CSS files:', cssFiles);

    // Group files by type
    const grouped = finder.groupByType(files);
    console.log('Grouped by type:', grouped);

    // Count total files
    const total = finder.countFiles(files);
    console.log('Total files:', total);
});
```

### Import CommonJS

```javascript
const { FileFinder, createFileFinder, findAllFiles } = require('@imprion91/finding-files');
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Install dependencies

```bash
npm install
```

### Available scripts

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run the linter
npm run lint

# Format the code
npm run format

# Check TypeScript types
npm run typecheck

# Build the library
npm run build
```

### Project structure

```
finding-files/
├── tests/
│   └── FileFinder.test.ts
├── src/
│   ├── core
│   │   ├── FileFinder.ts    # Main class for finding files
│   ├── types
│   │   ├── index.ts         # Type definitions
│   └── index.ts             # Entry point for the library
├── dist/               # Compiled files (generated)
├── .github/
│   └── workflows/
│       └── ci.yml      # Configuration CI/CD
├── package.json
├── tsconfig.json       # Configuration TypeScript
├── .eslintrc.cjs       # Configuration ESLint
├── .prettierrc         # Configuration Prettier
└── jest.config.js      # Configuration Jest
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution guidelines

- Ensure all tests pass
- Follow the code style (use `npm run lint` and `npm run format`)
- Add tests for any new features
- Update the documentation if necessary

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors

---

Created with love by [MarquesThomasCoding](https://github.com/MarquesThomasCoding), [HosenMohsen](https://github.com/HosenMohsen), and [Roland-HUON](https://github.com/Roland-HUON)
