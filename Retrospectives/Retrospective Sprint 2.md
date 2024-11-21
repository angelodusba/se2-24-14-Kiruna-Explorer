# TEMPLATE FOR RETROSPECTIVE (Team 14)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
  > Commited: 4, Done: 4
- Total points committed vs. done
  > Commited: 8, Done: 8
- Nr of hours planned vs. spent (as a team)
  > Planned: 91h, Spent: 90h 5m

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story                                                | # Tasks | Points | Hours est. | Hours actual |
|------------------------------------------------------|---------|--------|------------|--------------|
| _#0_                                                 |      13 |        |      41    |     37h 30m  |
| 5 (Adjust Georeference of a Document on the Map)     |       7 |    2   |      12h   |     11h 50m  |
| 6 (List Documents)                                   |       6 |    1   |      10h   |     10h      |
| 7 (Add attachments)                                  |       7 |    2   |      11h   |     14h 50m  |
| 8 (Search documents)                                 |       8 |    3   |      17h   |     17h 55m  |

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
   $$Estimate:\frac{91}{41}=2.22$$ 
   $$Actual:\frac{92.07}{41}=2.25$$

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = \frac{90.08}{91} - 1 = -0.01 $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| =  \frac{12.475}{41} = 0.304 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 9h
  - Total hours spent: 9h
  - Nr of automated unit test cases: 120
  - Coverage (if available): 70.4%
- E2E testing:
  - Total hours estimated: 7h
  - Total hours spent: 5h
- Code review 
  - Total hours estimated: 6h
  - Total hours spent: 6h 20m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
 > We had some errors because we underestimated the amount of work we needed to do for the story #7, since we needed more time
   than expected to find and learn the new library needed to upload a file to the server.

- What lessons did you learn (both positive and negative) in this sprint?
 >  We learned that it's important to put less stories in one sprint and spend more time in testing.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  > We achieved both the improvement goals set in the previous retrospective.

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

- One thing you are proud of as a Team!!