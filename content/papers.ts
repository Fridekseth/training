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
];
