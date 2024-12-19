-----------------
-- Users table --
-----------------
INSERT INTO "users" (email, username, password, role, salt) VALUES ('john@kiruna.com', 'john', '1af1ee4c85bcbba4146ab20de52cde6b', 'Urban Planner', '70706c1bbff40ddcbee4f6de82fd450f');
INSERT INTO "users" (email, username, password, role, salt) VALUES ('kevin@kiruna.com', 'kevin', '1af1ee4c85bcbba4146ab20de52cde6b', 'Resident', '70706c1bbff40ddcbee4f6de82fd450f');


-----------------
-- Types table --
-----------------
INSERT INTO "types" (name) VALUES ('Design');
INSERT INTO "types" (name) VALUES ('Informative');
INSERT INTO "types" (name) VALUES ('Prescriptive');
INSERT INTO "types" (name) VALUES ('Technical');
INSERT INTO "types" (name) VALUES ('Agreement');
INSERT INTO "types" (name) VALUES ('Conflict');
INSERT INTO "types" (name) VALUES ('Consultation');
INSERT INTO "types" (name) VALUES ('Action');
INSERT INTO "types" (name) VALUES ('Material Effect');


-----------------
-- Scales table --
-----------------
-- INSERT INTO "scales" (name) VALUES ('Blueprints/material effects');
-- INSERT INTO "scales" (name) VALUES ('Text');
-- INSERT INTO "scales" (name) VALUES ('Concept');
-- INSERT INTO "scales" (name) VALUES ('1:1000');
-- INSERT INTO "scales" (name) VALUES ('1:7500');
-- INSERT INTO "scales" (name) VALUES ('1:8000');
-- INSERT INTO "scales" (name) VALUES ('1:12000');


-----------------
-- Areas table --
-----------------
INSERT INTO "areas"  (name, location) VALUES (
    'Municipality area', 
	ST_GeomFromText(
        'POLYGON((
            21.9621 67.3562, 22.0589 67.4263, 22.1965 67.5545, 22.3241 67.6468, 
            22.4646 67.7458, 22.5947 67.7798, 22.8129 67.8383, 23.2867 68.1542, 
            23.2603 68.1569, 23.2484 68.1484, 23.2179 68.1466, 23.2013 68.1399, 
            23.1685 68.1331, 23.1524 68.1383, 23.1415 68.1543, 23.147 68.1714, 
            23.1425 68.1795, 23.1576 68.1994, 23.1415 68.2061, 23.1528 68.231, 
            23.1419 68.2479, 23.1095 68.2527, 23.0765 68.2684, 23.0648 68.2806, 
            23.0702 68.2997, 23.0607 68.3058, 23.0375 68.3071, 22.9864 68.3206, 
            22.9706 68.3322, 22.9181 68.3335, 22.8935 68.3487, 22.8761 68.3521, 
            22.8359 68.3661, 22.8465 68.381, 22.8041 68.3929, 22.764 68.3851, 
            22.7384 68.3849, 22.7114 68.3973, 22.6889 68.3995, 22.6903 68.4069, 
            22.6482 68.416, 22.6439 68.4319, 22.5751 68.4218, 22.5562 68.4338, 
            22.5379 68.4342, 22.4964 68.4422, 22.4653 68.4417, 22.4383 68.4597, 
            22.4134 68.4665, 22.3973 68.4639, 22.3667 68.4498, 22.3441 68.4452, 
            22.349 68.4624, 22.3435 68.4706, 22.3499 68.4813, 22.296 68.484, 
            22.2819 68.4796, 22.2517 68.4823, 22.2256 68.4741, 22.2051 68.4797, 
            22.1793 68.4776, 22.1544 68.4702, 22.1277 68.4719, 22.1224 68.4808, 
            22.077 68.4822, 22.0439 68.4795, 22.011 68.4999, 21.9959 68.5217, 
            22.0074 68.5307, 21.9921 68.5338, 21.9677 68.5513, 21.9471 68.5559, 
            21.9275 68.5675, 21.8878 68.5847, 21.842 68.5912, 21.7727 68.5855, 
            21.7221 68.5907, 21.7 68.5972, 21.6991 68.6143, 21.7095 68.6254, 
            21.6972 68.6322, 21.6634 68.6407, 21.6512 68.6506, 21.627 68.6549, 
            21.6241 68.6621, 21.5842 68.6678, 21.5532 68.6772, 21.5099 68.6757, 
            21.4359 68.6899, 21.4215 68.6952, 21.4131 68.7101, 21.4219 68.7157, 
            21.4055 68.7363, 21.4125 68.7483, 21.3915 68.7639, 21.3668 68.7672, 
            21.3256 68.7591, 21.2991 68.7623, 21.2702 68.7797, 21.2536 68.8022, 
            21.2259 68.816, 21.1842 68.8252, 21.1713 68.8336, 21.1447 68.84, 
            21.1295 68.853, 21.078 68.8649, 21.0771 68.8712, 20.9908 68.8973, 
            20.9156 68.8971, 20.9034 68.8998, 20.8802 68.9186, 20.8527 68.9232, 
            20.8452 68.9372, 20.8712 68.9433, 20.8916 68.9414, 20.9137 68.9603, 
            20.9116 68.9688, 20.8838 68.983, 20.8353 68.9958, 20.8134 69.0171, 
            20.775 69.0326, 20.7188 69.0397, 20.7027 69.0444, 20.6594 69.0432, 
            20.5778 69.0526, 20.5486 69.0599, 20.303 69.0526, 20.06 69.0457, 
            20.2378 68.956, 20.3065 68.9261, 20.3218 68.8556, 20.3358 68.8023, 
            20.2738 68.7402, 20.2028 68.6659, 20.0523 68.591, 19.9375 68.5579, 
            20.0258 68.5308, 20.2266 68.4908, 20.1106 68.4438, 19.978 68.3881, 
            19.9213 68.356, 19.7079 68.3938, 19.2685 68.4688, 18.9838 68.5169, 
            18.6212 68.5069, 18.4855 68.5564, 18.4056 68.5818, 18.1259 68.5365, 
            18.1009 68.406, 18.1146 68.3405, 18.1513 68.1987, 18.0958 68.1461, 
            18.0523 68.1082, 17.8998 67.9693, 18.1902 67.8942, 18.3518 67.8543, 
            18.7832 67.852, 18.8374 67.8488, 18.8521 67.8445, 19.005 67.8571, 
            19.0811 67.8513, 19.1304 67.85, 19.1791 67.8508, 19.2376 67.8481, 
            19.322 67.8563, 19.408 67.8521, 19.4511 67.8464, 19.4844 67.8376, 
            19.5383 67.8322, 19.6357 67.828, 19.6418 67.8209, 19.702 67.8132, 
            19.7813 67.8149, 19.8127 67.8013, 19.9217 67.7835, 19.9733 67.7768, 
            20.0003 67.771, 20.091 67.7418, 20.1528 67.7162, 20.2188 67.6891, 
            20.2911 67.6754, 20.3639 67.6591, 20.3925 67.6544, 20.4436 67.6487, 
            20.5148 67.6284, 20.5474 67.6201, 20.5881 67.6079, 20.6616 67.577, 
            20.7431 67.5484, 20.8267 67.5195, 20.9112 67.4935, 21.0383 67.4546, 
            21.1603 67.4063, 21.1908 67.3843, 21.2944 67.3486, 21.4553 67.3206, 
            21.4702 67.324, 21.5813 67.2917, 21.6621 67.2737, 21.7582 67.2653, 
            21.8702 67.2922, 21.9621 67.3562
        ))', 4326)
); 


------------------------
-- Stakeholders table --
------------------------
INSERT INTO "stakeholders" (name) VALUES ('LKAB');
INSERT INTO "stakeholders" (name) VALUES ('Municipality');
INSERT INTO "stakeholders" (name) VALUES ('Regional authority');
INSERT INTO "stakeholders" (name) VALUES ('Architecture firms');
INSERT INTO "stakeholders" (name) VALUES ('Citizens');
INSERT INTO "stakeholders" (name) VALUES ('Others');
INSERT INTO "stakeholders" (name) VALUES ('White Arkitekter');
INSERT INTO "stakeholders" (name) VALUES ('Norrbotten Museum');


---------------------
-- Documents table --
---------------------

-- Document 1: Card 2
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Mail to Kiruna kommun (2)', 
    'This document is considered the act that initiates the process of relocating Kiruna. The company communicates its intention to construct a new mining level at a depth of 1,365 meters. Along with this, LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of meetings held in previous months between the two stakeholders.', 
    3, -- type_id
    '2004-03-19', 
    'Text', -- scale
    'Swedish', -- language
    '1', -- pages
    NULL
);

-- Document 2: Card 4
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Vision 2099 (4)', 
    'Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality in response to the letter from LKAB. In these few lines, all the main aspects and expectations of the municipality for the new city are condensed. The document, which despite being a project document is presented anonymously, had the strength to influence the design process. The principles it contains proved to be fundamental in subsequent planning documents.', 
    1, -- type_id
    '2004', 
    'Text', -- scale
    'Swedish', -- language
    '2-2', -- pages
    NULL
);

-- Document 3: Card 15
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Compilation of responses “So what the people of Kiruna think?” (15)',
    'This document is a compilation of the responses to the survey ''What is your impression of Kiruna?'' From the citizens'' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.', 
    2, -- type_id
    '2007', 
    'Text', -- scale
    'Swedish', -- language
    '', -- pages
    NULL
);

-- Document 4: Card 18
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Detail plan for Bolagsomradet Gruvstadspark (18)',
    'This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.', 
    3, -- type_id
    '2010-10-20', 
    '1:8000', -- scale
    'Swedish', -- language
    '1-32', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.227008303571978 67.84022966426235, 
        20.228649282554613 67.84361897109355, 
        20.22966512668637 67.84388420042143, 
        20.23029026153725 67.84450305712761, 
        20.230133977824266 67.84603539356056, 
        20.23099353824415 67.84694885393321, 
        20.22560175015832 67.84895244817952, 
        20.223413778181794 67.85122101625242, 
        20.22310121075685 67.85263507691383, 
        20.22466404788247 67.8527823699686, 
        20.224351480457585 67.85328315939634, 
        20.223023068900886 67.85348936368209, 
        20.219428543510674 67.8546381827525, 
        20.216928004108183 67.85616985347542, 
        20.21536516698268 67.85596367289219, 
        20.215443308838587 67.85475600714952, 
        20.21802199009707 67.85024879981134, 
        20.220366245786522 67.84494508758152, 
        20.2190378342288 67.84361897109355, 
        20.221147664349274 67.8425285521786, 
        20.218178273808917 67.84214541992108, 
        20.217084287821223 67.83987596909512, 
        20.227008303571978 67.84022966426235
    ))', 4326)

);

-- Document 5: Card 41
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Development Plan (41)',
    'The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.', 
    1, -- type_id
    '2014-03-17', 
    '1:7500', -- scale
    'Swedish', -- language
    '111', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.27652159893779 67.8507502301135, 
        20.283355386871477 67.85145289546196, 
        20.290064924115768 67.85084392004995, 
        20.290064924115768 67.8482204595644, 
        20.27701860169725 67.84484700532687, 
        20.279503615490825 67.8440972825779, 
        20.29565620515271 67.84831415966292, 
        20.3052235082597 67.84854840826264, 
        20.31690307309114 67.8475645483355, 
        20.31814557998888 67.8482204595644, 
        20.29776846687713 67.85552793702911, 
        20.295407703772952 67.85421650710907, 
        20.300253480671643 67.85093760960982, 
        20.29876247239511 67.85056284911195, 
        20.28633740342451 67.85590261774507, 
        20.28248563204383 67.85604312146134, 
        20.280373370318472 67.85271763974134, 
        20.278261108594023 67.85271763974134, 
        20.277267103076042 67.85623045843278, 
        20.272297075488012 67.8559494524113, 
        20.27192432341883 67.85477855753481, 
        20.27652159893779 67.8507502301135
    ))', 4326)
);

-- Document 6: Card 42
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Detailed plan for LINBANAN 1. (42)',
    'This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a portion of land that will host a single building. Its boundaries coincide with the outer footprint of the new Town Hall, "Kristallen", the first building to be constructed in the new Kiruna.', 
    3, -- type_id
    '2014-03', 
    '1:500', -- scale
    'Swedish', -- language
    '1-15', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.30260521295787 67.8499815953556, 
        20.302399539305068 67.84997778564778, 
        20.30219584660193 67.84996639321761, 
        20.301996096712795 67.84994752779143, 
        20.301802213515487 67.84992137107147, 
        20.301616064366495 67.84988817498525, 
        20.301439442111338 67.8498482592585, 
        20.301274047813585 67.84980200833489, 
        20.301121474369047 67.84974986767237, 
        20.300983191163084 67.84969233945174, 
        20.300860529918854 67.84962997773883, 
        20.300754671872856 67.84956338314736, 
        20.30066663640122 67.84949319705296, 
        20.300597271206197 67.84942009541544, 
        20.300547244157215 67.84934478226751, 
        20.30051703686491 67.84926798293381, 
        20.300506940049768 67.84919043704494, 
        20.3005170507497 67.84911289141388, 
        20.300547271393206 67.8490360928437, 
        20.30059731074673 67.84896078093566, 
        20.300666686726778 67.84888768096677, 
        20.300754731049448 67.8488174969056, 
        20.300860595672358 67.8487509046338, 
        20.300983260966632 67.84868854543791, 
        20.301121545540127 67.84863101983485, 
        20.301274117617133 67.84857888178995, 
        20.301439507864846 67.84853263338336, 
        20.30161612354309 67.8484927199763, 
        20.301802263841044 67.8484595259233, 
        20.30199613625333 67.84843337087194, 
        20.30219587383792 67.84841450668569, 
        20.30239955318986 67.84840311501904, 
        20.30260521295787 67.84839930556903, 
        20.302810872725885 67.84840311501904, 
        20.303014552077826 67.84841450668569, 
        20.303214289662417 67.84843337087194, 
        20.303408162074703 67.8484595259233, 
        20.303594302372655 67.8484927199763, 
        20.3037709180509 67.84853263338336, 
        20.30393630829861 67.84857888178995, 
        20.30408888037562 67.84863101983485, 
        20.304227164949115 67.84868854543791, 
        20.304349830243385 67.8487509046338, 
        20.3044556948663 67.8488174969056, 
        20.30454373918897 67.84888768096677, 
        20.304613115169012 67.84896078093566, 
        20.30466315452254 67.8490360928437, 
        20.304693375166046 67.84911289141388, 
        20.30470348586598 67.84919043704494, 
        20.304693389050833 67.84926798293381, 
        20.30466318175853 67.84934478226751, 
        20.30461315470955 67.84942009541544, 
        20.304543789514522 67.84949319705296, 
        20.30445575404289 67.84956338314736, 
        20.30434989599689 67.84962997773883, 
        20.304227234752663 67.84969233945174, 
        20.3040889515467 67.84974986767237, 
        20.30393637810216 67.84980200833489, 
        20.30377098380441 67.8498482592585, 
        20.303594361549248 67.84988817498525, 
        20.30340821240026 67.84992137107147, 
        20.30321432920295 67.84994752779143, 
        20.303014579313817 67.84996639321761, 
        20.302810886610676 67.84997778564778, 
        20.30260521295787 67.8499815953556
    ))', 4326)
);

-- Document 7: Card 44
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Detailed Overview Plan for the Central Area of Kiruna 2014. (44)',
    'The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan focuses on the central area of Kiruna and its surroundings, incorporating all the projections of the Development Plan into a prescriptive tool.', 
    3, -- type_id
    '2014-06', 
    '1:30000', -- scale
    'Swedish', -- language
    '18-136-3-1', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.148218443217218 67.88214399611522, 
        20.151952401044042 67.87898054306689, 
        20.161287295609895 67.87704711020456, 
        20.161287295609895 67.87054256714669, 
        20.149151932674158 67.86087029489724, 
        20.14401774066232 67.84345008632698, 
        20.14121727229326 67.82302196715958, 
        20.15568635887007 67.8115673589941, 
        20.16875521126275 67.80169426894784, 
        20.24856855980144 67.78793551377481, 
        20.298510245729517 67.79393391501023, 
        20.302710948284385 67.78511220446057, 
        20.3129793323063 67.78352394325418, 
        20.376923360083197 67.81650234033319, 
        20.367588465517343 67.81967427797395, 
        20.37785684954008 67.82372668269247, 
        20.37879033899702 67.8536574436431, 
        20.330715631981917 67.86649828708838, 
        20.291975819533576 67.86825675596998, 
        20.1878917451225 67.8823197309072, 
        20.179490340013615 67.88144104368527, 
        20.16875521126275 67.8823197309072, 
        20.148218443217218 67.88214399611522
    ))', 4326)
);

-- Document 8: Card 45
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Deformation forecast (45)',
    'The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.', 
    4, -- type_id
    '2014-12', 
    '1:12000', -- scale
    'Swedish', -- language
    '1', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.236750674738914 67.83522881195697, 
        20.24097519818875 67.85223868435426, 
        20.22469835783744 67.85949807549676, 
        20.220225333007875 67.8595917302909, 
        20.21252179024654 67.85828052893291, 
        20.20991252576266 67.8573907431541, 
        20.20953977369348 67.8563135886184, 
        20.215876558868672 67.85223868435426, 
        20.219976831629083 67.84614841983657, 
        20.223580101630034 67.83569756961097, 
        20.236750674738914 67.83522881195697
    ))', 4326)
);

-- Document 9: Card 47
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Adjusted development plan (47)',
    'This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name ''Adjusted Development Plan91,'' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.', 
    1, -- type_id
    '2015', 
    '1:7500', -- scale
    'Swedish', -- language
    '1', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.315876546084922 67.84751370219692, 
        20.317256539294135 67.84844289437896, 
        20.315876546084922 67.848888893479, 
        20.31380655627106 67.85104443557952, 
        20.307596586826776 67.85372000381417, 
        20.29547236077093 67.85632095643095, 
        20.27960243886065 67.85884731832408, 
        20.27358961130443 67.85643241934562, 
        20.273392469417814 67.85450032006199, 
        20.2780253037634 67.85063564117874, 
        20.276448168667542 67.84836856036654, 
        20.29488093510963 67.84807122194792, 
        20.30483660040838 67.84807122194792, 
        20.315876546084922 67.84751370219692
    ))', 4326)
);

-- Document 10: Card 48
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of new city hall begins (48)',
    'The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained isolated for quite some time due to a slowdown in mining activities.', 
    9, -- type_id
    '2015', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.5081 68.42472)'), 4326)
);

-- Document 11: Card 49
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Detail plan for square and commercial street (49)',
    'This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.', 
    3, -- type_id
    '2016-06-22', 
    '1:1000', -- scale
    'Swedish', -- language
    '1-43', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.296940967865368 67.84849559268815, 
        20.30934832035524 67.84814471912765, 
        20.309596467405356 67.84952479135112, 
        20.307487217481594 67.84936105823792, 
        20.30475759993388 67.85102172652242, 
        20.298491886926683 67.84985225412959, 
        20.298491886926683 67.84961835261402, 
        20.297003004627754 67.84959496233353, 
        20.296940967865368 67.84849559268815
    ))', 4326)
);

-- Document 12: Card 58
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Detailed plan for Gruvstaspark 2, etapp 3, del av SJ-området m m. (58)',
    'The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling the old railway. Like all areas within the "Gruvstadpark 2" zone, its sole designated land use is for mining activities, although it will temporarily be used as a park during an interim phase.', 
    3, -- type_id
    '2018-10', 
    '1:1500', -- scale
    'Swedish', -- language
    '1-46', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.21711429887918 67.85608676934416, 
        20.21938438304872 67.85619717844071, 
        20.21982375417835 67.85536909747245, 
        20.222313523913186 67.85545190689265, 
        20.222313523913186 67.85633518907633, 
        20.217260755922013 67.85785325215366, 
        20.216015871055646 67.85777045126167, 
        20.215063900275 67.85879164171106, 
        20.213745786886136 67.85890203799931, 
        20.21235444497472 67.86006116746537, 
        20.211182788629827 67.85978518948673, 
        20.210011132283796 67.8607510981185, 
        20.20891270446029 67.86061311362133, 
        20.207741048114286 67.86163417955913, 
        20.20620324916115 67.86127543175863, 
        20.206130020639705 67.86006116746537, 
        20.20737490550607 67.8592884208918, 
        20.209205618546008 67.85961960113127, 
        20.21220798793192 67.8580464530913, 
        20.21206153088906 67.8576324491215, 
        20.212867044626904 67.8570252300008, 
        20.215063900275 67.85732884153805, 
        20.21711429887918 67.85608676934416
    ))', 4326)
);

-- Document 13: Card 62
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Deformation forecast (62)',
    'The third deformation forecast was published in 2019, five years after the second. The line has not moved; what changes, as in the previous version, are the timing of the interventions and the shape of the areas underlying the deformation zone.', 
    4, -- type_id
    '2019-04', 
    '1:12000', -- scale
    'Swedish', -- language
    '1', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.236167893378507 67.83773776578033, 
        20.233724466483665 67.83804500911856, 
        20.23384082014502 67.84252152461491, 
        20.235818832393534 67.84282870497401, 
        20.232909990852335 67.84344305356004, 
        20.23279363719007 67.84388186407458, 
        20.23384082014502 67.84388186407458, 
        20.234073527468666 67.84484721815605, 
        20.232677283528716 67.84682168164068, 
        20.23512071042356 67.84669005594074, 
        20.233375405498663 67.84853274815552, 
        20.236633308024864 67.84848887622309, 
        20.235935186054917 67.85098944468339, 
        20.234888003099968 67.85160357838461, 
        20.23546977140856 67.85318270507435, 
        20.23197916155877 67.85550733589596, 
        20.227906783401238 67.85809485990347, 
        20.21801672216037 67.8603313018157, 
        20.214413241696718 67.86172643223458, 
        20.21182498182165 67.86123874319543, 
        20.207572840599994 67.86144775403298, 
        20.207757716304855 67.85963626451206, 
        20.204245077904034 67.85866078877021, 
        20.20110219091299 67.85817303559284, 
        20.20110219091299 67.85636129159192, 
        20.192597908468287 67.8538524905467, 
        20.195186168343298 67.8531555534625, 
        20.20110219091299 67.85357371821243, 
        20.205169456429815 67.85190101422148, 
        20.213303987464712 67.85022819024891, 
        20.21977463715038 67.8500887828352, 
        20.219589761445576 67.84918261433484, 
        20.222732648435226 67.84904320067162, 
        20.220699015677468 67.84367514098332, 
        20.220144388561522 67.84179254181078, 
        20.22476628119429 67.84130443574742, 
        20.22291752414145 67.84032819298884, 
        20.21496786881272 67.83886375226814, 
        20.22125364279347 67.83802688773693, 
        20.21182498182165 67.83293531523006, 
        20.239741213326 67.82902869850633, 
        20.232531060818218 67.8309820885834, 
        20.233085687934164 67.8367017908532, 
        20.236167893378507 67.83773776578033
    ))', 4326)
);

-- Document 14: Card 63
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Scandic Hotel begins (63)',
    'After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.', 
    9, -- type_id
    '2019-04', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.304778 67.848528)'), 4326)
);

-- Document 15: Card 64
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Town Hall demolition (64)',
    'After the construction of the new town hall was completed, the old building, nicknamed "The Igloo", was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock tower was relocated to the central square of New Kiruna, in front of the new building.', 
    9, -- type_id
    '2019-04', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.222444 67.852500)'), 4326)
);

-- Document 16: Card 65
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Aurora Center begins (65)',
    'Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, a multifunctional complex that includes the municipal library of Kiruna. The two buildings are close to each other and connected by a skywalk, just like in the old town center.', 
    9, -- type_id
    '2019-05', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.304389 67.849167)'), 4326)
);

-- Document 17: Card 69
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Block 1 begins (69)',
    'Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, another mixed-use building overlooking the main square and the road leading to old Kiruna. These are the first residential buildings in the new town.', 
    9, -- type_id
    '2019-06', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.300333 67.848556)'), 4326)
);

-- Document 18: Card 76
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Demolition documentation, Kiruna City Hall (76)',
    'This document was created to preserve the memory of the symbolic building before its demolition in April 2019. Conducted by the Norrbotten Museum, the detailed 162-page study analyzed the building''s materials, both physically and chemically, taking advantage of the demolition to explore aspects that couldn''t be examined while it was in use. This meticulous effort reflects a commitment to preserving knowledge of every detail of the structure.', 
    2, -- type_id
    '2020-11-26', 
    'Text', -- scale
    'Swedish', -- language
    '162', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.304389 67.849167)'), 4326)
);

-- Document 19: Card 81
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Gruvstadspark 2, etapp 5, Kyrkan (81)',
    'The last detailed plan of the second planning phase concerns the area surrounding the Kiruna Church. Situated within a park, the area includes only six buildings, half of which serve religious functions. The plan also specifies that the church will be dismantled between 2025 and 2026 and reassembled at its new site by 2029.', 
    3, -- type_id
    '2021-09-04', 
    '1:2000', -- scale
    'Swedish', -- language
    '1-56', -- pages
    ST_GeomFromText(
    'POLYGON((
        20.22978770943243 67.8513695261853, 
        20.233302678469414 67.85037561975358, 
        20.23535307707465 67.85037561975358, 
        20.23557276263898 67.84951972194114, 
        20.23923418871982 67.85178364136445, 
        20.237769618287018 67.85379889693397, 
        20.235719219682835 67.85335721198501, 
        20.23352236403477 67.8534676340065, 
        20.23308299290511 67.85299833680381, 
        20.230739680214157 67.85313636637323, 
        20.22964125238957 67.85286030641757, 
        20.230153852040615 67.8522529630117, 
        20.22978770943243 67.8513695261853
    ))', 4326)
);

-- Document 20: Card 102
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Church closes (102)',
    'On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two days. Both the new site and the route for the move have already been determined. A significant period will pass between the relocation and the reopening of the church, voted "Sweden''s most beautiful building constructed before 1950."', 
    9, -- type_id
    '2024-06-02', 
    'Blueprints/effects', -- scale
    '', -- language
    '', -- pages
    ST_SetSRID(ST_GeometryFromText('POINT(20.392083 68.421917)'), 4326)
);


-----------------------
-- Connections table --
-----------------------

-- possible values: direct_conn, collateral_conn, prevision_conn, update_conn
-- at least one connection type must be set to TRUE
INSERT INTO "connections" (document_id_1, document_id_2, update_conn) VALUES (5, 9, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, update_conn) VALUES (8, 13, TRUE);

INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (1, 2, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (2, 3, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (3, 5, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (4, 15, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (5, 6, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (5, 7, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (6, 10, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (7, 11, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (8, 9, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (8, 12, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (9, 11, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (11, 14, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (11, 16, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (11, 17, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (13, 19, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (15, 18, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, direct_conn) VALUES (19, 20, TRUE);


----------------------------------
-- Documents_stakeholders table --
----------------------------------
-- Document 1 (card 2)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (1, 1);
-- Document 2 (card 4)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (2, 2);
-- Document 3 (card 15)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (3, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (3, 5);
-- Document 4 (card 18)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (4, 2);
-- Document 5 (card 41)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (5, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (5, 7);
-- Document 6 (card 42)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (6, 2);
-- Document 7 (card 44)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (7, 2);
-- Document 8 (card 45)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (8, 1);
-- Document 9 (card 47)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (9, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (9, 7);
-- Document 10 (card 48)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (10, 1);
-- Document 11 (card 49)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (11, 2);
-- Document 12 (card 58)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (12, 2);
-- Document 13 (card 62)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (13, 1);
-- Document 14 (card 63)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (14, 1);
-- Document 15 (card 64)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (15, 1);
-- Document 16 (card 65)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (16, 1);
-- Document 17 (card 69)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (17, 1);
-- Document 18 (card 76)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (18, 8);
-- Document 19 (card 81)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (19, 2);
-- Document 20 (card 102)
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (20, 1);



