In v3 of the FHX Parsing project.

FhxProcessor helper function will be leveraged
v2's components are partially copied

This iteration is based on the Object Manager Pattern (Centralized Registry) suggested in the Chat conversation.
There will be

- a supervisory ObjectManager,
- a possible, parent class called Component
- Components, which represent each (root level) block
- each component will have an id to reference each other
- each component is registered in Object manager

- For component classes, the input should always be the fhx of its own block
- The overall fhx is not stored anywhere at this moment. Becasue it is assumed that the entire fhx is consumed and components added to object manager
