TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done
`6 vs 6`
- Total points committed vs done 
`15 vs 15`
- Nr of hours planned vs spent (as a team)
`96 vs 87h30m`

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   24    |    --   |   55h15m|    42h 35m    |
| _#9_   |    5     |    3   |    9h    |   9h30m        |
| _#19_   |    7     |    2   |    9h  |      11h50m|
| _#10_   |     7    |    5   |     13h45m |17h50m|
| _#20_   |     1    |    1   |   1h|    15m|
| _#14_   |     2    |    2   | 5h| 3h30m |
| _#11_   |     2    |    2   |   3h  |   2h|


   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)


- Hours per task (average, standard deviation)
  - Mean: `1h34m`
  - Standard deviation: `41m`
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1

$$\frac{95.6}{87.5} = 0.092$$

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated:    `2h`
  - Total hours spent:    `2h`
  - Nr of automated unit test cases:  `167`
  - Coverage (if available):  `74%`
- E2E testing:
  - Total hours estimated:  `6h`
  - Total hours spent:  `5h30m`
- Code review 
  - Total hours estimated:  `6h`
  - Total hours spent:    `6h`
- Technical Debt management:
  - Strategy adopted:  
`We opt for a preventive approach based on the Visual Studio Code extension by SonarQube called SonarLint directly connected to our organization on SonarQube. This extension allows us to fix issues directly during the development phase. Our approach provides for fixing eventual high severity issues or security related issues during the development. The other issues will be solved during development only on a voluntary basis.`
  - Total hours estimated estimated at sprint planning: `6h`
  - Total hours spent: `3h`
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
`We were faster in studying diagram library and implementing neverseen functionalities`

- What lessons did you learn (both positive and negative) in this sprint?
`We committed more stories but we rushed at the end, making it more stressful and less test-oriented`
- Which improvement goals set in the previous retrospective were you able to achieve? 
`We analyze the report proposed by SonarCube, `
- Which ones you were not able to achieve? Why?
`We were not able to refactor the code in a readability-wise approach`
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
`Spend more time in refactoring and testing the app. Organize better the work spreading it throughout the weeks to have a smoother workflow`

> Propose one or two

- One thing you are proud of as a Team!!
`We worked really well in the end committing all the stories we proposed, which are a lot. Our work together has made us more experienced, not just in delivering results but in improving in team management and collaboration`