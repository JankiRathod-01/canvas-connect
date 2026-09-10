# Presentation

## Main file

**`Art-Gallery-MCA-Final-Presentation.pptx`**

## UML section (academic system design)

1. UML Class Diagram — Introduction  
2. UML Class Diagram  
3. UML Relationship Explanation  
4. UML Use Case Diagram — Introduction  
5. UML Use Case Diagram  
6. UML Activity Diagram  
7. UML Sequence Diagram — Login  

Then: Data Dictionary, Design Decisions, Implementation Status, Future Scope, Conclusion, Screenshots.

ER Diagram slides have been **removed** from the presentation (Class Diagram + Data Dictionary kept).

## Diagram source files

- `docs/diagrams/art-gallery-class-diagram.puml` / `.png`
- `docs/diagrams/art-gallery-use-case.puml` / `.png`
- `docs/diagrams/art-gallery-activity.puml` / `.png`
- `docs/diagrams/art-gallery-sequence-login.puml` / `.png`

## Regenerate

```bash
cd docs/presentation
node render-uml.js
node render-extra-uml.js
node create-mca-ppt.js
```
