# RETROSPECTIVE sprint 4 (Team 14)

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done : 6 committed and 6 done
- Total points committed vs done : 10 committed and 10 done
- Nr of hours planned vs spent (as a team) : 105h planned and 98h 15m spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 25      | -      | 75h        | 71h 45m      |
| _#17_ | 2       | 1      | 4h         | 3h 30m       |
| _#12_ | 2       | 2      | 4h         | 3h 30m       |
| _#13_ | 4       | 2      | 10h        | 9h 30m       |
| _#15_ | 2       | 2      | 4h         | 3h           |
| _#16_ | 2       | 2      | 4h         | 5h           |
| _#18_ | 2       | 1      | 4h         | 4h           |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
| ---------- | ---- | ----- |
| Estimation | 2.69 | 1.84  |
| Actual     | 2.52 | 1.93  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

  $$\frac{98.25}{105} - 1=-0.06$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  $$\frac{1}{39}*9=0.23$$

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 0h
  - Total hours spent: 0h
  - Nr of automated unit test cases: 169
  - Coverage : 71%
- E2E testing:
  - Total hours estimated :18h
  - Total hours spent: 16h 30m
  - Nr of test cases: 34
- Code review
  - Total hours estimated: 6h
  - Total hours spent: 5h 30m
- Technical Debt management:

  - Strategy adopted : We opt for a preventive approach based on the Visual Studio Code extension by SonarQube called SonarLint directly connected to our organization on SonarQube. This extension allows us to fix issues directly during the development phase. Our approach provides for fixing eventual high severity issues or security related issues during the development. The other issues will be solved during development only on a voluntary basis. In addition, our strategy includes a check on SonarQube every time a story is finished and some refactoring at the beginning of each sprint in order to address other relevant problems.

  - Total hours estimated estimated 5h
  - Total hours spent 5h 30m

## ASSESSMENT

- What caused your errors in estimation (if any)?

-`We overestimated some little tasks but we did that in order to be safe in not exceeding the time for that tasks`

- What lessons did you learn (both positive and negative) in this sprint?

-`As a positive lesson we learned that designing well functionalities pays off because at the start of the sprint most of the remaining stories were basically already completed because of the good design choices that we took.`

-`As a negative lesson, regression tests are fundamental because a little change to a part of the codebase can break some functionalities.`

- Which improvement goals set in the previous retrospective were you able to achieve?

-`We achieved both of the previous retrospective's goals`

- Which ones you were not able to achieve? Why?

-`None`

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

-`There is no next sprint but visiting Kiruna would be a nice goal`

- One thing you are proud of as a Team!!

-`The whole application that we built is pretty nice and the product owner seemed really satisfied of it`
