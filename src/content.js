// ============================================================
//  ALL SITE CONTENT LIVES HERE. Edit text, links, projects.
//  Icon names for contact rows: mail | phone | github | linkedin | twitter
//  To hide a contact row (and its cat tip), delete its entry.
// ============================================================
export const site = {
  name: 'Sunit Dighe',
  nameHi: ['सु', 'नि', 'त', ' ', 'दि', 'घे'], // typed in this order for the Hindi flip

  hello: 'Hi! My name is',
  lead: "I'm a second-year ExTC undergrad at VJTI, Mumbai, focusing on Robotics and GenAi.",

  intro: {
    paragraphs: [
      "I'm Sunit, an ExTC undergrad at VJTI.",
      'My goal is robot learning.',
      "Away from that, I read about quantum computing and quantum cryptography as a side quest. Offline, you'll find me singing or out on a trek.",
      "Now: working on world models in speech imitation, improving inference and benchmarking context-memory methods on edge devices",
      'I enjoy building things from scratch :)'
    ],
    tags: [
      'robotics',
      'vision-language models',
      'reinforcement learning',
      'quantum ML',
      'quantum cryptography',
      'singing',
      'trekking',
    ],
  },

  projects: [
    {
      title: 'ViReL',
      path: '~/projects/virel',
      badge: 'main project', // optional
      lede: 'Finetuning a VLM with GRPO for spatial reasoning',
      body: 'Finetuning a vision-language model with GRPO so it reasons better about space: positions, distances and layouts. The goal is spatial reasoning that robots can use.',
      tags: ['GRPO', 'VLM', 'spatial reasoning'],
      url: 'https://github.com/ssdunit/ViReL',
    },
    {
      title: 'Word2Vec-Refined',
      path: '~/projects/word2vec-refined',
      badge: 'completed',
      lede: 'Skip-gram, rebuilt from the paper',
      body: 'A skip-gram word2vec model built from the original paper. It learns semantic relationships between words, trained on Text8 (17 million words) and WikiText-103 (103 million words). Runs locally or in Colab.',
      tags: ['skip-gram', 'Text8', 'WikiText-103'],
      url: 'https://github.com/ssdunit/Word2Vec-Refined',
    },
  ],

  writing: {
    text: "Notes, experiments, research thoughts and things I'm building or trying to understand.",
    label: 'Open notes',
    url: 'https://ssdunit.github.io/notes/',
  },

  contact: [
    { id: 'mail', label: 'mail', text: 'ssdunit456@gmail.com', href: 'mailto:ssdunit456@gmail.com', copy: 'ssdunit456@gmail.com', icon: 'mail' },
    { id: 'phone', label: 'phone', text: '+91 8591361266', href: 'tel:+918591361266', copy: '+918591361266', icon: 'phone' },
    { id: 'github', label: 'github', text: 'github.com/ssdunit', href: 'https://github.com/ssdunit', icon: 'github' },
    { id: 'twitter', label: 'X ', text: 'Sunit Dighe', href: 'https://x.com/ssdunit456/', icon: 'twitter' },
    { id: 'linkedin', label: 'linkedin', text: 'Sunit Dighe', href: 'https://www.linkedin.com/in/sunit-dighe-371810398/', icon: 'linkedin' },
  ],

  footer: '© 2026 Sunit Dighe',
};
