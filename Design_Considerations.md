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

`Therefore, going forward module paramters will be identified as parameters which has a Attribute block which includes CATEGORY { CATEGORY=ONLINE }`
