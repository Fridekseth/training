import type { Paper } from "@/lib/papers";

/**
 * The research library. Add an entry per source; the page picks up filters,
 * keyword chips and counts automatically.
 */
export const papers: Paper[] = [
  {
    id: "vervaeke-memory",
    title: "All you need to know about memory",
    authors: ["Koen Vervaeke"],
    year: 2026,
    venue: "The Oslo School of Architecture and Design",
    citation:
      "Vervaeke, K. (2026). All you need to know about memory [Lecture]. The Oslo School of Architecture and Design.",
    category: ["learning", "neuroscience"],
    type: "lecture",
    keywords: ["neuroscience", "memory", "learning", "neuromodulation"],
    keyFindings: [
      "Neurons connect into large networks, and repetition strengthens those connections: learning is a physical change in the brain, not just an accumulation of information.",
      "Stimulating the brain can elicit memories directly, and smell is the strongest and most direct trigger of human memory.",
      "The brain prefers multisensory experience: context helps memorisation, and context can be added artificially rather than only found.",
      "In-person learning is often more effective than digital learning because it supplies that multisensory context by default.",
      "Neuromodulators (adrenaline, serotonin and dopamine) promote learning by strengthening connections in the brain.",
      "They are released by attention and arousal, stress and threat response, reward and motivation, and curiosity and exploration; physical activity often activates them too.",
      "Familiar learning principles work by recruiting these mechanisms: reward systems, gamification, salience and cues, and emotional tagging.",
    ],
    relevance: [
      "A neuroscientist’s account of how memory emerges from changing connections between neurons, how the hippocampus organises experience, and what helps learning become durable.",
    ],
  },
  {
    id: "roediger-karpicke-testing",
    title:
      "The Power of Testing Memory: Basic Research and Implications for Educational Practice",
    authors: ["Henry L. Roediger III", "Jeffrey D. Karpicke"],
    year: 2006,
    venue: "Perspectives on Psychological Science, 1(3), 181–210",
    url: "https://www.researchgate.net/publication/237268918_The_Power_of_Testing_Memory_Basic_Research_and_Implications_for_Educational_Practice",
    accessed: "2026-09-03",
    citation:
      "Roediger, H. L., III, & Karpicke, J. D. (2006). The power of testing memory: Basic research and implications for educational practice. Perspectives on Psychological Science, 1(3), 181–210. https://doi.org/10.1111/j.1745-6916.2006.00012.x",
    category: ["learning"],
    type: "article",
    keywords: [
      "testing effect",
      "retrieval practice",
      "retention",
      "education",
    ],
    keyFindings: [
      "The “testing effect”: being tested on material has a greater positive effect on retention than spending the same time studying or re-reading it.",
      "In the comparison, one group studied the material twice while another studied it once and then took a test.",
      "Retention was then measured at three intervals (five minutes, two days and one week) rather than immediately after studying alone.",
      "After five minutes, repeated studying produced better recall than testing; but after two days and one week, the tested group retained substantially more, even though repeated studying had left students more confident they would remember.",
    ],
    relevance: [
      "The article proves testing as an effective strategy for learning. This is something that a training interface should incorporate.",
    ],
  },
  {
    id: "carpenter-spacing",
    title:
      "Using Spacing to Enhance Diverse Forms of Learning: Review of Recent Research and Implications for Instruction",
    authors: [
      "Shana K. Carpenter",
      "Nicholas J. Cepeda",
      "Doug Rohrer",
      "Sean H. K. Kang",
      "Harold Pashler",
    ],
    year: 2012,
    venue: "Educational Psychology Review, 24, 369–378",
    url: "https://files.eric.ed.gov/fulltext/ED536925.pdf",
    accessed: "2026-09-03",
    citation:
      "Carpenter, S. K., Cepeda, N. J., Rohrer, D., Kang, S. H. K., & Pashler, H. (2012). Using spacing to enhance diverse forms of learning: Review of recent research and implications for instruction. Educational Psychology Review, 24, 369–378.",
    category: ["learning"],
    type: "article",
    keywords: [
      "spacing effect",
      "distributed practice",
      "retention",
      "Ebbinghaus",
      "education",
    ],
    keyFindings: [
      "“The spacing effect is one of the oldest and most reliable findings in research on human learning” (Carpenter et al., 2012, p. 2), with early demonstrations going back to Ebbinghaus (1885/1913).",
      "Retention improves when study sessions are spaced apart in time rather than massed in immediate succession: the same total study time, scheduled differently.",
      "The optimal gap depends on how long the knowledge has to last: roughly 10–20% of the delay before it is needed. Tested after 7 days the best gap was 1 day; after 35 days, 11 days; after 70 days, 21 days.",
      "A longer gap is not automatically better. Wait too long and forgetting offsets the benefit, so there are diminishing returns rather than a single best interval.",
      "Material that has been learned and then forgotten is relearned far faster than material met for the first time, so regular re-exposure keeps knowledge cheap to restore.",
      "Spacing benefits diverse kinds of learning, but the authors note it has still not been systematically built into curricula: the research has not produced clear enough instructions for practice.",
    ],
    relevance: [
      "The article takes the findings of Ebbinghaus and explores how spaced repetition should actually be applied to enhance retention. This concrete application of the principle could be valuable to implement in the OpenBridge training interface.",
    ],
  },
  {
    id: "sweller-cognitive-load",
    title: "Cognitive load theory, learning difficulty, and instructional design",
    authors: ["John Sweller"],
    year: 1994,
    venue: "Learning and Instruction, 4(4), 295–312",
    url: "https://www.sciencedirect.com/science/article/abs/pii/0959475294900035",
    accessed: "2026-09-03",
    citation:
      "Sweller, J. (1994). Cognitive load theory, learning difficulty, and instructional design. Learning and Instruction, 4(4), 295–312. https://doi.org/10.1016/0959-4752(94)90003-5",
    category: ["learning"],
    type: "article",
    keywords: [
      "cognitive load theory",
      "instructional design",
      "element interactivity",
      "schema acquisition",
      "worked examples",
      "split-attention",
    ],
    keyFindings: [
      "Learning is described as the acquisition of schemas that organise knowledge and can eventually become automated through practice.",
      "Learning places demands on working memory, which has limited capacity. Cognitive load therefore affects how easily new knowledge can be acquired.",
      {
        text: "Sweller distinguishes between intrinsic load and extraneous load:",
        subPoints: [
          "Intrinsic load is determined by the complexity of the material itself. It is closely related to element interactivity: the number of elements that need to be understood and processed together. Because of this, material with many interacting elements is inherently more difficult to learn.",
          "Extraneous load is caused by how the material is presented and can be influenced through instructional design.",
        ],
      },
      "The effect of minimizing extraneous load depends on the complexity of the material. For difficult material with high element interactivity, unnecessary cognitive load can interfere with learning, but when element interactivity is low, reducing extraneous load may have little effect on learning.",
      "The split-attention effect shows that when related information is presented separately, learners may have to mentally integrate the different sources. This creates unnecessary cognitive load. Presenting related information together can therefore reduce extraneous load.",
      "The redundancy effect shows that more information is not necessarily better. When information is already sufficiently explained by itself, adding text that simply repeats the same information can create unnecessary cognitive load.",
    ],
    relevance: [
      "The article distinguishes between difficulty inherent in the material and difficulty imposed by the way the material is designed and presented. For complicated and highly interconnected material, such as the material OpenBridge is often used to communicate, this distinction is particularly relevant. The findings suggest that instructional design should minimise unnecessary cognitive load where possible, allowing learners to focus their limited working-memory capacity on understanding and learning the essential information.",
    ],
  },
  {
    id: "bjork-bjork-desirable-difficulties",
    title:
      "Making Things Hard on Yourself, But in a Good Way: Creating Desirable Difficulties to Enhance Learning",
    authors: ["Elizabeth Ligon Bjork", "Robert A. Bjork"],
    year: 2011,
    venue:
      "In M. A. Gernsbacher, R. W. Pew, L. M. Hough, & J. R. Pomerantz (Eds.), Psychology and the Real World (pp. 56–64). Worth Publishers",
    url: "https://static1.squarespace.com/static/631f3333434573769b6da366/t/64513774777e291579ff8078/1683044212516/2019.01.09+Bjork.pdf",
    accessed: "2026-09-03",
    citation:
      "Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher, R. W. Pew, L. M. Hough, & J. R. Pomerantz (Eds.), Psychology and the real world: Essays illustrating fundamental contributions to society (pp. 56–64). Worth Publishers.",
    category: ["learning"],
    type: "chapter",
    keywords: [
      "desirable difficulties",
      "spacing effect",
      "interleaving",
      "testing effect",
      "generation effect",
      "storage strength",
      "retrieval strength",
    ],
    keyFindings: [
      "Performance (that can be observed during practice) and learning (the durable change the practice is meant to produce) are different things, and current performance is often an unreliable index of whether learning has actually occurred.",
      "Bjork & Bjork call this difference retrieval strength (how accessible information is right now) and storage strength (how durably it is learned).",
      "The conditions that make performance improve quickly during practice often fail to support long-term retention and conditions that slow apparent learning down often optimise it.",
      {
        text: "Examples of these “desirable difficulties” can be:",
        subPoints: [
          "Varying the conditions of practice, rather than keeping them fixed and predictable, improves later recall and transfer. For example studying material in two different rooms beats studying it twice in the same room.",
          "Interleaving different topics or skills rather than practicing one at a time (blocking), produces worse performance during training but far better long-term retention and transfer.",
          "Producing an answer yourself (The generation effect), rather than being shown it, produces more durable learning than being presented the same information.",
          "Testing or attempting to retrieve knowledge, even with no feedback, is often more effective for long-term retention than rereading the material.",
        ],
      },
      "Despite this proved effect, learners often report that they thought they performed better during the easier conditions.",
    ],
    relevance: [
      "Often times learning conditions that feel difficult helps improve learning, but learners don’t tend to notice this effect themselves. How can we implement desirable difficulties without hurting the confidence of the learners?",
    ],
  },
  {
    id: "macnamara-maitra-deliberate-practice",
    title:
      "The Role of Deliberate Practice in Expert Performance: Revisiting Ericsson, Krampe & Tesch-Römer (1993)",
    authors: ["Brooke N. Macnamara", "Megha Maitra"],
    year: 2019,
    venue: "Royal Society Open Science, 6(8), 190327",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6731745/",
    accessed: "2026-09-03",
    citation:
      "Macnamara, B. N., & Maitra, M. (2019). The role of deliberate practice in expert performance: Revisiting Ericsson, Krampe & Tesch-Römer (1993). Royal Society Open Science, 6(8), 190327. https://doi.org/10.1098/rsos.190327",
    category: ["learning"],
    type: "article",
    keywords: [
      "deliberate practice",
      "expertise",
      "replication",
      "practice quality",
    ],
    keyFindings: [
      "Ericsson, Krampe & Tesch-Römer's (1993) famous violin study concluded that accumulated deliberate practice alone accounts for expert-level performance differences.",
      "In their replication study, Macnamara & Maitra did not reproduce these results, and found that accumulated practice did not correspond to skill level the way the original study reported.",
      "They found an effect of practice, but it was smaller than in the original study (η² = 0.26 here versus η² = 0.48 originally). Practice still matters, but it is less decisive than the original claim suggested.",
      "Teacher-designed practice was also found to be less relevant to improving that popular belief.",
      "The authors conclude that deliberate practice cannot, on this evidence, account for why some individuals reach the highest levels of expert performance and others do not. Amount of practice is not the whole story.",
    ],
    relevance: [
      "Not all believed “truths” about learning are correct when studied closer.",
    ],
  },
  {
    id: "carroll-rosson-active-user",
    title: "Paradox of the Active User",
    authors: ["John M. Carroll", "Mary Beth Rosson"],
    year: 1987,
    venue:
      "In J. M. Carroll (Ed.), Interfacing Thought: Cognitive Aspects of Human-Computer Interaction (pp. 80–111). MIT Press",
    url: "https://www.researchgate.net/publication/262322669_Paradox_of_the_active_user",
    accessed: "2026-09-04",
    citation:
      "Carroll, J. M., & Rosson, M. B. (1987). Paradox of the active user. In J. M. Carroll (Ed.), Interfacing thought: Cognitive aspects of human-computer interaction (pp. 80–111). MIT Press.",
    category: ["learning", "UX"],
    type: "chapter",
    keywords: [
      "active user paradox",
      "production bias",
      "assimilation bias",
      "training wheels",
      "minimal manual",
    ],
    keyFindings: [
      "People taking up a new system are motivated and want to get something done, not passive or lazy, so they skip the manual and the introduction and go straight to the task, and so never make the small up-front investment that would make them far more effective later.",
      "Production bias: the user’s goal is throughput, not learning. Anything that looks like a detour from getting the task done, including instruction that would pay off later, gets skipped.",
      "Assimilation bias: users interpret a new system through what they already know. Useful when the old knowledge transfers, but misleading when it doesn’t: irrelevant similarities can blind people to what the new system is actually doing, or stop them from recognising a feature that doesn’t map onto anything familiar.",
      "Carroll and Rosson argue these biases are not defects in the learner to be corrected, but fundamental, mutually reinforcing properties of how people learn, which is why they treat them as paradoxes needing a design tradeoff, not a “bad design” problem to be eliminated outright.",
      "Their “training wheels” interface shows every function of the full system but structurally disables advanced, error-prone choices during early learning, so a likely mistake is blocked outright rather than merely discouraged or explained.",
      "Their “Minimal Manual” design works with the production bias instead of against it: instructions are deliberately left incomplete, with “On Your Own” sections that push the learner to apply what they just did to a new problem of their own choosing.",
    ],
    relevance: [
      "The paradox names exactly the failure mode a training layer inside OpenBridge would have to survive: an operator who is motivated to get the task done will route around anything that reads as instruction, no matter how well designed.",
      "“Training wheels” and the “Minimal Manual” are the earliest concrete examples of training built into the interaction itself rather than delivered beside it: the closest precedent here to what this course is trying to design.",
    ],
  },
  {
    id: "carroll-carrithers-training-wheels",
    title: "Training Wheels in a User Interface",
    authors: ["John M. Carroll", "Caroline Carrithers"],
    year: 1984,
    venue: "Communications of the ACM, 27(8), 800-806",
    url: "https://dl.acm.org/doi/abs/10.1145/358198.358218",
    accessed: "2026-09-04",
    citation:
      "Carroll, J. M., & Carrithers, C. (1984). Training wheels in a user interface. Communications of the ACM, 27(8), 800-806. https://doi.org/10.1145/358198.358218",
    category: ["learning", "UX"],
    type: "article",
    keywords: [
      "training wheels",
      "error states",
      "novice users",
      "word processing",
    ],
    keyFindings: [
      "New users in advanced systems often become frustrated and confused by the errors they make in the beginning of training.",
      "The article explored whether removing parts of the interface that often trigger \u201cerror states\u201d when used incorrectly, during training, could make the training more effective.",
      "This training environment had only the basic functions of the system, which enabled the user to learn the most important things significantly faster.",
      "In the published study, the control group spent almost a quarter of their time recovering from the error states that the training interface blocked off, and the training group also scored better on a comprehension post-test.",
    ],
    relevance: [],
  },
  {
    id: "endsley-situation-awareness",
    title: "Toward a Theory of Situation Awareness in Dynamic Systems",
    authors: ["Mica R. Endsley"],
    year: 1995,
    venue:
      "Human Factors: The Journal of the Human Factors and Ergonomics Society, 37(1), 32\u201364",
    url: "https://www.researchgate.net/publication/210198492_Toward_a_Theory_of_Situation_Awareness_in_Dynamic_Systems",
    accessed: "2026-09-04",
    citation:
      "Endsley, M. R. (1995). Toward a theory of situation awareness in dynamic systems. Human Factors: The Journal of the Human Factors and Ergonomics Society, 37(1), 32\u201364. https://doi.org/10.1518/001872095779049543",
    category: ["UX", "ID"],
    type: "article",
    keywords: [
      "situation awareness",
      "perception",
      "comprehension",
      "projection",
      "decision-making",
    ],
    keyFindings: [
      "Situation awareness (SA) is the perception of the elements in the environment within a volume of time and space, the comprehension of their meaning, and the projection of their status in the near future.",
      "The article asks what shapes situation awareness, and how this affects the decisions made in a workplace.",
      "Endsley's model describes three levels of situation awareness.",
      "Level 1 (perception): perceiving the essential properties of the task environment, either directly through the senses or mediated through digital sensors. This is the raw data: what you see, hear, or read off a screen.",
      "Level 2 (comprehension): combining the elements from level 1 with your own knowledge to build an understanding of the situation. In other words, not just registering data, but knowing what it means for your goals.",
      "Level 3 (projection): using the elements from levels 1 and 2, together with knowledge of the situation's spatiotemporal aspects, to forecast a future state or consequence. This is the highest level, and the one that makes operationally useful decision-making possible.",
    ],
    relevance: [
      "Situation awareness is arguably the central design goal for any bridge interface, so a definition this precise is worth having on hand before deciding what training should actually build toward.",
    ],
  },
  {
    id: "forsey-et-al-designing-for-learnability",
    title: "Designing for Learnability: Improvement Through Layered Interfaces",
    authors: [
      "Helen Forsey",
      "David Leahy",
      "Bob Fields",
      "Shailey Minocha",
      "Simon Attfield",
      "Tom Snell",
    ],
    year: 2024,
    venue:
      "Ergonomics in Design: The Quarterly of Human Factors Applications, 33(3), 135\u2013141",
    url: "https://journals.sagepub.com/doi/10.1177/10648046241273291",
    accessed: "2026-09-04",
    citation:
      "Forsey, H., Leahy, D., Fields, B., Minocha, S., Attfield, S., & Snell, T. (2024). Designing for learnability: Improvement through layered interfaces. Ergonomics in Design: The Quarterly of Human Factors Applications, 33(3), 135\u2013141. https://doi.org/10.1177/10648046241273291",
    category: ["UX", "ID"],
    type: "article",
    keywords: [
      "progressive disclosure",
      "layered interfaces",
      "learnability",
      "HMI design",
      "generic interfaces",
    ],
    keyFindings: [
      "Progressive disclosure through a multi-layered interface defers advanced or rarely used features to a later stage, so a novice starts on a reduced-functionality layer and moves up once competent.",
      "Tested on 42 military users on a real UAV mission-planning tool, comparing a layered interface (unneeded features greyed out) against the full interface.",
      "No statistically significant difference in task performance or awareness of features between the two groups: individual differences between users were the dominant factor and masked any effect of the interface itself.",
      "Even so, the layered group showed more consistent performance across users, and people who scanned menus methodically found functions later more reliably than those who stumbled onto them by luck.",
      "Because individual differences dominated, the authors argue for a customised approach (matched to a user's own exploration style) rather than one layered design for everyone. Progressive disclosure suits quick learning and infrequent or multi-application use; a full interface paired with explicit search-strategy training suits users who need durable, deep recall.",
      "Their stated conclusion: implementing generic interface design heuristics, guidelines and principles across systems supports learnability and should reduce training demand.",
    ],
    relevance: [
      "They concluded that generic interfaces and guidelines across systems support learning, and reduce the amount of training needed. This is especially interesting in connection with OpenBridge, which lays such a foundation for learning.",
    ],
  },
  {
    id: "ebbinghaus-memory",
    title: "Memory: A Contribution to Experimental Psychology",
    authors: ["Hermann Ebbinghaus"],
    year: 1885,
    venue:
      "Teachers College, Columbia University (1913 English translation by H. A. Ruger & C. E. Bussenius)",
    url: "https://archive.org/details/memorycontributi00ebbiuoft/page/2/mode/2up",
    accessed: "2026-09-05",
    citation:
      "Ebbinghaus, H. (1885/1913). Memory: A contribution to experimental psychology (H. A. Ruger & C. E. Bussenius, Trans.). Teachers College, Columbia University.",
    category: ["learning"],
    type: "book",
    keywords: ["forgetting curve", "spacing effect", "retention", "memory"],
    keyFindings: [
      "Ebbinghaus conducted experiments on himself.",
      "He discovered that the amount of information retained decreases over time, with the steepest drop occurring immediately after learning.",
      "His research showed that spacing out study sessions over time, rather than cramming, improves long-term memory retention.",
    ],
    relevance: [
      "Ebbinghaus (german psychologist) discovered the forgetting curve and the spacing effect, contributions to the study of memory that laid the foundation for the study of human learning and memory.",
    ],
  },
  {
    id: "liu-sra-tasklens",
    title:
      "TaskLens: Generating Task-Conditioned Scaffolded Interfaces for Learning Professional Creative Software",
    authors: ["Yimeng Liu", "Misha Sra"],
    year: 2026,
    venue:
      "Proceedings of the 2026 ACM Designing Interactive Systems Conference (DIS '26), 17–38",
    url: "https://dl.acm.org/doi/full/10.1145/3800645.3813081",
    accessed: "2026-09-06",
    citation:
      "Liu, Y., & Sra, M. (2026). TaskLens: Generating task-conditioned scaffolded interfaces for learning professional creative software. In Proceedings of the 2026 ACM Designing Interactive Systems Conference (DIS '26) (pp. 17–38). ACM. https://doi.org/10.1145/3800645.3813081",
    category: ["UX", "ID"],
    type: "article",
    keywords: [
      "scaffolded interfaces",
      "LLM-generated UI",
      "task-conditioned design",
      "progressive disclosure",
      "learnability",
    ],
    keyFindings: [
      "TaskLens automatically builds a simplified version of a software's interface for one specific task. You describe the task in plain language, and an AI breaks it into steps, picks out only the tools needed for those steps, and generates a custom control panel inside the software.",
      "The idea is to put instructions and the tools themselves in the same place, instead of a separate manual or tutorial you have to keep switching between.",
      "In a test with 32 beginners using Blender, people using the simplified interface felt less overwhelmed and finished tasks faster than people using the normal interface: one task took about 12.7 minutes instead of 15.1, another took about 20.4 minutes instead of 25.",
      "Beginners using the simplified interface also understood the underlying concepts better, watched fewer tutorial videos, and explored more tools on their own.",
      "A separate test with 8 experienced users was more mixed. They liked having less clutter and appreciated the built-in explanations, but some felt boxed in by the fixed steps, since expert workflows aren't usually that linear. A few gave up on the simplified interface partway through and just used keyboard shortcuts instead.",
      "The researchers note some limits of their own work: the difficulty level is chosen by the user rather than adjusted automatically based on how they are doing, it has only been tested in one piece of software (Blender), and it does not work well for open-ended, exploratory tasks that cannot be broken into clear steps.",
    ],
    relevance: [
      "TaskLens is a design project that seeks to explore some of the same ideas as OpenBridge: unifying instruction and interaction into one layer instead of a separate manual or tutorial. They found that novices benefit from the staged guidance, but experienced users feel boxed in by it and route around it. This is something a training layer in OpenBridge should account for. Users already competent in the system need an easy way around the training, not just a way in.",
    ],
  },
];
