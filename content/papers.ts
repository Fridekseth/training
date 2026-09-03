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
      "Neurons connect into large networks, and repetition strengthens those connections — learning is a physical change in the brain, not just an accumulation of information.",
      "Stimulating the brain can elicit memories directly, and smell is the strongest and most direct trigger of human memory.",
      "The brain prefers multisensory experience: context helps memorisation, and context can be added artificially rather than only found.",
      "In-person learning is often more effective than digital learning because it supplies that multisensory context by default.",
      "Neuromodulators — adrenaline, serotonin and dopamine — promote learning by strengthening connections in the brain.",
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
      "Retention was then measured at three intervals — five minutes, two days and one week — rather than immediately after studying alone.",
      "After five minutes, repeated studying produced better recall than testing; but after two days and one week, the tested group retained substantially more — even though repeated studying had left students more confident they would remember.",
    ],
    relevance: [],
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
      "Retention improves when study sessions are spaced apart in time rather than massed in immediate succession — the same total study time, scheduled differently.",
      "The optimal gap depends on how long the knowledge has to last: roughly 10–20% of the delay before it is needed. Tested after 7 days the best gap was 1 day; after 35 days, 11 days; after 70 days, 21 days.",
      "A longer gap is not automatically better. Wait too long and forgetting offsets the benefit, so there are diminishing returns rather than a single best interval.",
      "Material that has been learned and then forgotten is relearned far faster than material met for the first time, so regular re-exposure keeps knowledge cheap to restore.",
      "Spacing benefits diverse kinds of learning, but the authors note it has still not been systematically built into curricula — the research has not produced clear enough instructions for practice.",
    ],
    relevance: [
      "Gives a concrete scheduling rule rather than a vague “repeat things” principle, which is the kind of thing a training layer inside an interface could actually implement.",
    ],
  },
  {
    id: "sweller-cognitive-load",
    title: "Cognitive load theory, learning difficulty, and instructional design",
    authors: ["John Sweller"],
    year: 1994,
    venue: "Learning and Instruction, 4(4), 295–312",
    url: "https://www.sciencedirect.com/science/article/abs/pii/0959475294900035",
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
      "For intellectual tasks, schema acquisition and automation are the primary mechanisms of learning — instruction should be judged by whether it builds schemas.",
      "Intrinsic cognitive load is constant for a given topic because it is a property of the material itself; extraneous load is artificial and can be manipulated by instructional design.",
      "Intrinsic load is characterised by element interactivity: elements that interact have to be learned simultaneously, so material with many interacting elements is inherently harder.",
      "Extraneous load only interferes with learning when element interactivity is already high. Where interactivity is low, redesigning instruction to strip extraneous load may make no appreciable difference.",
      "Element interactivity explains not only why some material is difficult to learn, but why it can be difficult to understand — understanding becomes the issue when high-interactivity material must be held together at once.",
      "Worked examples direct attention to the problem states and rules that build schemas, and can substitute for solving problems unaided.",
      "The split-attention effect: when sources of information are unintelligible in isolation and must be integrated, presenting them separately imposes extraneous load, and integrated formats produce higher test performance.",
      "The redundancy effect is its mirror: where a diagram is self-explanatory, adding text that restates it imposes extraneous load. Integrating everything is not automatically better.",
    ],
    relevance: [
      "Separates difficulty inherent to the material from difficulty the design imposes — the distinction needed to tell whether a bridge task is hard because the work is complex or because the interface adds load.",
      "Split-attention and redundancy are claims about how information is laid out on a screen, which makes them the closest thing here to a directly applicable interface rule.",
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
      "Performance — what can be observed during practice — and learning — the durable change the practice is meant to produce — are different things, and current performance is often an unreliable index of whether learning has actually occurred.",
      "Conditions that make performance improve quickly during practice often fail to support long-term retention; conditions that slow apparent learning down often optimise it. A difficulty only counts as “desirable” when the learner has enough background to work through it.",
      "Theoretically, retrieval strength (how accessible information is right now) and storage strength (how durably it is learned) are distinct. Rereading or blocked practice can raise retrieval strength — and confidence — without raising storage strength at all.",
      "Varying the conditions of practice, rather than keeping them fixed and predictable, improves later recall and transfer — e.g. studying material in two different rooms beats studying it twice in the same room.",
      "Interleaving different topics or skills, rather than practicing one at a time (blocking), produces worse performance during training but far better long-term retention and transfer — and learners reliably misjudge this, believing blocking helped more when the opposite was true.",
      "The generation effect: producing an answer yourself, rather than being shown it, produces more durable learning than being presented the same information.",
      "A test or retrieval attempt — even with no feedback — is often more effective for long-term retention than rereading the material an equivalent number of times, and also has a metacognitive benefit: it reveals what has and hasn’t actually been learned, which rereading does not.",
    ],
    relevance: [],
  },
  {
    id: "macnamara-maitra-deliberate-practice",
    title:
      "The Role of Deliberate Practice in Expert Performance: Revisiting Ericsson, Krampe & Tesch-Römer (1993)",
    authors: ["Brooke N. Macnamara", "Megha Maitra"],
    year: 2019,
    venue: "Royal Society Open Science, 6(8), 190327",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6731745/",
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
      "A pre-registered, improved replication of Ericsson, Krampe & Tesch-Römer's (1993) famous violin study, which had concluded that accumulated deliberate practice alone accounts for expert-level performance differences.",
      "The replication did not reproduce that core finding: accumulated practice did not correspond to skill level the way the original study reported. Elite violinists and “good” violinists did not differ significantly in accumulated solo practice (p = .364).",
      "Where an effect of practice was found, it was smaller than in the original study (η² = 0.26 here versus η² = 0.48 originally) — practice still mattered, just far less decisively than the original claim suggested.",
      "Teacher-designed practice — closer to what “deliberate practice” theory actually specifies — explained about as much variance in performance as unsupervised solo practice, and was rated by the violinists themselves as less relevant to improving than practising alone.",
      "The authors conclude that deliberate practice cannot, on this evidence, account for why some individuals reach the highest levels of expert performance and others do not — amount of practice is not the whole story.",
    ],
    relevance: [],
  },
];
