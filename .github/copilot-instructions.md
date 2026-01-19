# AI Coding Agent Instructions for fhxParse

## Project Overview

**fhxParse** is a Node.js utility library for parsing and processing FHX (Foxboro Automation System) configuration files. It extracts component definitions, function blocks, module structures, and design specifications from FHX text files, converting them into structured data for further processing (SQL, MongoDB, CSV export).

**Key Stack**: Node.js ESM, Mocha + Chai (testing), ANTLR4 (grammar parsing), MySQL2, CSV-writer, dotenv

## Architecture & Core Concepts

### Processing Pipeline
FHX text file → `FhxProcessor` (extract blocks) → `Manager` (organize components) → Component types (Module, FunctionBlock, etc.) → Output (SQL, CSV, or data objects)

### Key Modules

#### Parsing & File Utilities
- **[src/util/FhxUtil.js](src/util/FhxUtil.js)**: Core FHX text parsing
  - `findBlocks(fhxString, blockType)`: Extracts blocks by type (MODULE_CLASS, FUNCTION_BLOCK_DEFINITION, etc.) using bracket depth counting
  - `valueOfParameter(block, paramName)`: Extracts parameter values from block text using regex
  - Works with nested structures (inner blocks within DeltaV objects)
  
- **[src/util/FileIO.js](src/util/FileIO.js)**: File I/O wrapper
  - `readFile(filepath)`: Read FHX/text files
  - `writeFile(filepath, data)`: Write processed output
  - Auto-creates directories; handles .txt, .csv, .sql extensions

#### Component Model
- **[src/ComponentObjects/Components.js](src/ComponentObjects/Components.js)**: Component class hierarchy
  - `Component`: Base class (name, block text, metadata)
  - `ModuleClassComponent`: Represents MODULE_CLASS blocks with function blocks list
  - `FunctionBlockDefinitionComponent`: Represents FUNCTION_BLOCK_DEFINITION blocks
  - `FunctionBlockTemplateComponent`: Template definitions
  - `NamedSetComponent`: ENUMERATION_SET blocks
  - `ComponentCreator.create()`: Factory method determines type and instantiates correct class

- **[src/ComponentObjects/Managers.js](src/ComponentObjects/Managers.js)**: Organization & lookup
  - `FhxProcessor`: Takes FHX string, creates `Manager` instance
  - `Manager`: Indexing system for fast component lookup by name
  - `mgr.get(componentName)`: Returns component object by name

#### Output Generation
- **[src/ComponentObjects/DSProcessor.js](src/ComponentObjects/DSProcessor.js)**: Design spec processing
  - Converts component structures into CSV/SQL-compatible format
  - `processDSTable()`: Generates tabular output from component data
  
- **SQL/MongoDB**: Modules for database export (located in `src/sql/`, `src/mongodb/`)

### Data Flow Pattern
```
FHX file (raw text)
    ↓
FileIO.readFile()
    ↓
FhxProcessor(fhxString) → creates Manager
    ↓
Manager.get(componentName) → Component object
    ↓
Component.processDSTable() / Component methods
    ↓
FileIO.writeFile() → Output (CSV, SQL, JSON)
```

## Developer Workflows

### Testing
```bash
npm test              # Run all tests in test/ and src/**/*.test.js
npm run testonly      # Run only test/ files (skip src/ tests)
```

**Test Pattern**: Uses Mocha + Chai with ESM imports. Tests handle file I/O with cleanup:
- Create output dir before tests
- Use `after()` hooks to clean up temp files
- Place test data in `test/data/` folder

**Example** (see [test/Component.test.js](test/Component.test.js)):
```javascript
import { FhxProcessor } from "../src/ComponentObjects/Managers.js";
let fhx = FileIO.readFile("test/data/Mixer Mixer_EM_Classes.fhx");
let mgr = new FhxProcessor(fhx).createManager();
let component = mgr.get("_E_M_AGIT");
```

### Main Entry Point
- **[main.js](main.js)**: Collection of utility functions for FHX processing
  - `identifyFbd(fhx, outputPath)`: Extract all FUNCTION_BLOCK_DEFINITION blocks
  - `allBlocks(fhx, blockType)`: Find all blocks of given type and write to file
  - `uniqueParams(fhx, blockType)`: Extract unique parameter names across blocks
  - Each function demonstrates a workflow pattern

## Code Patterns & Conventions

### Block Extraction
- FHX blocks are identified by type and name: `[BLOCK_TYPE] NAME="..."`
- Blocks contain nested structures delimited by `{}` (curly braces)
- Use `findBlocks()` with bracket depth counting for reliable extraction
- Depth counter handles nested blocks and mixed content

### Parameter Parsing
- Parameters in blocks follow format: `PARAM_NAME="value"` or `PARAM_NAME=value`
- Use `valueOfParameter(block, paramName)` to extract reliably
- Returns `undefined` if parameter not found (check defensively)

### Component Access Pattern
```javascript
const fhx = FileIO.readFile("file.fhx");
const mgr = new FhxProcessor(fhx).createManager();
const component = mgr.get("COMPONENT_NAME");  // Fast lookup by index
const dsTable = component.processDSTable();   // Generate output
```

### Error Handling
- Block parsing throws `Error("Unexpected EOF")` if mismatched braces
- File operations throw descriptive errors from FileIO
- Use try-catch in main workflows, cleanup in `finally` or `after()` hooks

## Testing & Debugging

- **Debugging**: Node.js debugging compatible; use `node --inspect` or VS Code debugger
- **Test Data**: Keep reference FHX files in `test/data/` folder
- **Output Validation**: Test output files written to `test/output/temp/` (auto-cleaned)
- **Mocha Options**: Use `--grep` to run specific tests, `--reporter spec` for verbose output

## Integration Points & Dependencies

### ANTLR4
- Listed as dependency but grammar parsing via `src/fhx_grammar.ebnf` not yet fully integrated
- Current parsing uses text-based `findBlocks()` (robust, low-dependency approach)
- Future: ANTLR could replace manual block extraction

### Database Connectors
- **MySQL2**: Configured via `.env` (see dotenv)
- **MongoDB**: Modules exist; requires connection setup
- **CSV Writer**: Used in `DSProcessor` for tabular output

### File System
- All file operations routed through `FileIO` for consistency
- Supports reading/writing arbitrary file types by extension
- Auto-creates nested directories

## Quick Navigation

| Task | File |
|------|------|
| Extract blocks from FHX | [FhxUtil.js](src/util/FhxUtil.js) `findBlocks()` |
| Get parameter value from block | [FhxUtil.js](src/util/FhxUtil.js) `valueOfParameter()` |
| Create component object | [Components.js](src/ComponentObjects/Components.js) `ComponentCreator.create()` |
| Lookup component by name | [Managers.js](src/ComponentObjects/Managers.js) `Manager.get()` |
| Generate CSV/SQL output | [DSProcessor.js](src/ComponentObjects/DSProcessor.js) `processDSTable()` |
| Write output file | [FileIO.js](src/util/FileIO.js) `writeFile()` |

## Known Issues & Opportunities

1. **ANTLR Grammar Unused**: `fhx_grammar.ebnf` exists but text-based parsing is the current approach
2. **Error Context**: Block parsing errors lack line numbers (depth counter is position-agnostic)
3. **Component Caching**: Manager caches all components in memory; optimize for large FHX files
4. **SQL/MongoDB Export**: Scaffolding exists in `src/sql/` and `src/mongodb/` but may need refinement
5. **Type Safety**: No TypeScript; JSDoc comments minimal in Components.js

## FHX File Structure (Reference)

FHX files contain:
- `MODULE_CLASS` blocks: Named process modules with function block lists
- `FUNCTION_BLOCK_DEFINITION` blocks: Reusable function block specifications
- `FUNCTION_BLOCK_TEMPLATE` blocks: Template definitions for composite blocks
- `ENUMERATION_SET` blocks: Named sets of enumerated values
- Other attributes and configuration blocks

Example extraction:
```javascript
findBlocks(fhx, "MODULE_CLASS")      // → array of module blocks
findBlocks(fhx, "FUNCTION_BLOCK_DEFINITION")  // → array of function block definitions
```
