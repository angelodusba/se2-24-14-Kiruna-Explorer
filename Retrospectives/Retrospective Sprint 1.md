# TEMPLATE FOR RETROSPECTIVE (Team 14)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done
  > Commited:5, Done:4
- Total points committed vs. done
  > Commited:13, Done:11
- Nr of hours planned vs. spent (as a team)
  > Planned:96, Spent:86h 40min

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story                                            | # Tasks | Points | Hours est. | Hours actual |
| ------------------------------------------------ | ------- | ------ | ---------- | ------------ |
| _#0_                                             | 17      |        | 55h 30m    | 42h 30m      |
| 1 (Create Document)                              | 5       | 2      | 8h         | 18h 30m      |
| 2 (Link documents)                               | 5       | 2      | 8h         | 7h 30m       |
| 3 (Georeferencing document)                      | 5       | 2      | 8h         | 5h           |
| 4 (View documents on the map)                    | 8       | 5      | 18h        | 13h          |
| 5 (Adjust georeference of a document on the map) | 5       | 2      | 8h         | 0m           |

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  > $$Estimate:\frac{105.5}{45}=2.34$$ > $$Actual:\frac{86.66}{45}=1.93$$
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

  > $$\frac{86.66}{105.5}-1=-0.17$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  > $$\frac{1}{45}*(78.81)=1.75$$

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 10h
  - Total hours spent: 11h
  - Nr of automated unit test cases: 77
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 8h
  - Total hours spent: 10h
- Code review
  - Total hours estimated: 10h
  - Total hours spent: 3h30m

## ASSESSMENT

- What caused your errors in estimation (if any)?

> We didn't consider some tasks at the beginning that endend up being added.
> We didn't consider that one of us wouldn't have been available

- What lessons did you learn (both positive and negative) in this sprint?

> Positive: We managed to correctly use git branches, daily communication is fundamental
> Negative: Planning how a functionality logic will be at the beginning allows to save a lot of time

- Which improvement goals set in the previous retrospective were you able to achieve?

> Correct use of git branches, focus on less stories at once and spend more time in testing

- Which ones you were not able to achieve? Why?

> Total team coordination because it is difficult to meet all of us together

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Planning how a functionality logic will be before of implementing it: to achieve it we think that a better communication and the API description document can help us.
> More scrum meetings

- One thing you are proud of as a Team!!

> We had the impression of having been able to satisfy the product owner quality expectations and we are really proud of that.
