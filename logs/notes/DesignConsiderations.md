## 01/11/2025

`Identification of Module Parameters`
dscreator.valueOfModuleParameter running on \_E_M_AGIT gave 366 results. Amongst which A_INITIALIZED is one of them. However this parameter is not a module parameter nor is it configurable.

The function currently assumes that module parameters are parameters that both have a attribute block and an attribute instance block

In the study of \_E_M_AGIT, module parameters should be the parameters which has an attribute block with CATEGORY=COMMON

This works for the \_C_M_AI

\_E_M_AGIT has 371 CATEGORY=COMMON parameters
E_M_AGIT yielded 366 results with the valueOfModuleParameter function

\_C_M_AI has 20 CATEGORY=COMMON parameters
C_M_AI yielded 21 results from the function, the difference is VERSION_CLASS parameter, It is an online parameter, but it has both attribute and attribute instance blocks, perhaps because of nature of the parameter needing a non default, incremental value.

`Therefore, going forward module paramters will be identified as parameters which has a Attribute block with CATEGORY { CATEGORY=ONLINE }`

On a separate note, this means that some parameters with CATEGORY=COMMON will not have a Attribute Instance block.

### Ideas

DeltaV syntax is complex and inconsistent. Code is created with certain assumptions which over time is proven to be false. I can create test functions to run these assumptions every time when a new feature and new file is added

1. Module Parameters:
   Test whether _attributes blocks_ with `CATEGORY { CATEGORY=ONLINE }` always have an `attribute instance block`.

### Lessons

DeltaV Module Class's external references are always instance configuratble, where as internal references are never instance configurable

## 01/13/2025

For EM Commands (\_E_M_AGIT)

1. The command Named_Sets is under `COMMAND_SET="_N_M_GEXE_M_AGIT"`
2. Command definition names can be identified with `FUNCTION_BLOCK NAME="COMMAND_0`
   example: `FUNCTION_BLOCK NAME="COMMAND_00002" DEFINITION="__5D419A19_188513E5__"`
   However the Named Set (`ENUMERATION_SET NAME="_N_M_GEXE_M_AGIT"`) and the SFC definition (`__5D419A19_188513E5__`) are not with the EM block. Cross search within an entire FHX export is required.

    ### fhxProcessor features:

    - Add a function to search for any block. The function signature would be `findBlock(fhx_data, blockType, keyToFind, criteria):[results]` where fhx_data is one `single root block`; keyToFind is the key to search for. This can be a key with a single value, an experssion or a block`(for example: NAME, ATTRIBUTE)`; criterion: how the item will be identified amount other items with the name key. Using the example above `(findBlock(em_data, 'FUNCTION_BLOCK', 'NAME="COMMAND_0'))` The criteria can be further generalised to take an object or an array {"DEFINITION": "ACT"; "DESCRIPTION": "Something"}

## 01/15/2025

For SFC codes

1. STEP
   Steps are composed of actions
2. ACTION
   An action consists of Action Expression; Delayed Expression|Time; Confirm Expression|TImeout
   There are also descriptions, action types, and qualifiers.
   Currently the collection of functions are able to parse out all steps, actions and trnasitions values.
   `Need to verify if all parameters are captured`: write a fhxcrawler code which filters out all the components that the existing code can extract, and figure out what portion of the fhx is not covered. OR, if necessary, go through it manually

-   There are two ways to present the SFC data in tables
    1.  Create separate tables for Steps and Transitions, and include a screenshot of the SFC diagram.
    2.  Create a single table with Steps and Transitions in order of execution as much as possible.
        In this case a manual addition of the order of the CSV records is required.
        Alternatively, analysis of where the Step and Transition Rectangle is created graphically can be used.
        This requires additional code

```
The word file output
Steps | Act. | Expressions
------------------------------------------------
S0001 | A000 | Delay: Time or Delayed Expression
      |      |----------------------------------
      |      | Expression and Qualifier
      |      |----------------------------------
      |      | Confirm: Expression | Time Out
      -------------------------------------------
      | A010 | Delay: Time or Delayed Expression
      |      |----------------------------------
      |      | Expression and Qualifier
      |      |----------------------------------
      |      | Confirm: Expression | Time Out
   -------------------------------------------
      | A020 | Delay: Time or Delayed Expression
      |      |----------------------------------
      |      | Expression and Qualifier
      |      |----------------------------------
      |      | Confirm: Expression | Time Out
------------------------------------------------
T0001 | N/A  | Expression:
------------------------------------------------
S0002 | A000 | Delay: Time or Delayed Expression
      |      |----------------------------------
      |      | Expression and Qualifier
      |      |----------------------------------
      |      | Confirm: Expression | Time Out
   -------------------------------------------
      | A010 | Delay: Time or Delayed Expression
```

# DS Generation

## List of Tables

### Control Modules

-   Control Module Class Properties
-   Module Parameters
-   Instance Configurable Parameters (Currently using Bulk Edit EXport)
-   Function Blocks
-   Linked Composites
-   Embedded Composites
-   Alarms
-   History Collection

## 02/17/2025

Latest: as of 02/17/2025

In v3 of the FHX Parsing project.

FhxProcessor helper function will be leveraged
v2's components are partially copied

This iteration is based on the Object Manager Pattern (Centralized Registry) suggested in the Chat conversation.
There will be

-   a supervisory ObjectManager,
-   a possible, parent class called Component
-   Components, which represent each (root level) block
-   each component will have an id to reference each other
-   each component is registered in Object manager

-   For component classes, the input should always be the fhx of its own block
-   The overall fhx is not stored anywhere at this moment. Becasue it is assumed that the entire fhx is consumed and components added to object manager

# 01/18/2026

## FHX Structure:

### Equipment Modules

-   Phase Module => BATCH_EQUIPMENT_PHASE_CLASS;
-   Each Phase, by default, should contain one single => PHASE_CLASS_ALGORITHM;
-   Each Phase, by default, has Run, Hold, Restart, Stop logics etc. These are represented in the fhx of the phase block by a series of FUNCTION_BLOCK (FUNCTION\*BLOCK NAME="RUN_LOGIC" DEFINITION="\_\_67900BF3_3C20C53F\_\_")
-   Currently, the processSFC() within SFCProcessing.js file only correctly parses and correctly outputs one phase logic, i.e. one Function Block Definition.
