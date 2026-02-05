/**
 * PSEUDOCODE: run-all-tests.js
 *
 * Purpose: Convenience wrapper to run all test suites in sequence with summary
 *
 * main():
 *   - Run: npm run test:fhxutil
 *   - Check exit code
 *   - Run: npm run test:processsfc
 *   - Check exit code
 *   - Run: npm run test:integration
 *   - Check exit code
 *   - Run: npm run compare-golden
 *   - Check exit code
 *   - If all tests passed (exit code 0):
 *     - Log "✓ All tests passed!"
 *     - Exit with code 0
 *   - Else:
 *     - Log "✗ Some tests failed"
 *     - Show summary of which tests failed
 *     - Exit with code 1
 *
 * ============================================================================
 */
