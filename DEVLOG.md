## 05/01/2026 - moo-lexer

#### **Status:**

    Writing tests for moo-lexer.

#### **What I did:**

    Commented out non atomic lexer types

#### **Why I did it:**

    The lexer should create atomic tokens, and nearley.js will handle the identification of patterns

#### **Next:**

    rewrite moo.test.js to test atomic tokens. Fixtures also need to be modified.

#### **Broken right now:**

    - moo.js still doesn't handle EXPRESSION properly;
    - moo.js Block class and fhxBlockTokens function are WIP for the purpose of
    identifying a block. After commenting out several lexer types and making the
    lexer more atomic, these objects should work any more.
