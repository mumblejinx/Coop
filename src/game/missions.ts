export type Mission = {
  id: string;
  text: string;
  theme: 'kindness' | 'trust' | 'fun' | 'teamwork';
  difficulty: 1 | 2 | 3;
};

export const missions: Mission[] = [
  {
    id: 'm1',
    text: 'Describe a moment today where you showed kindness.',
    theme: 'kindness',
    difficulty: 1,
  },
  {
    id: 'm2',
    text: 'What is something that made you feel uncertain today?',
    theme: 'trust',
    difficulty: 1,
  },
  {
    id: 'm3',
    text: 'What made you smile today?',
    theme: 'fun',
    difficulty: 1,
  },
  {
    id: 'm4',
    text: 'Describe a moment where teamwork could have helped.',
    theme: 'teamwork',
    difficulty: 2,
  },
  {
    id: 'm5',
    text: 'What is something you avoided today and why?',
    theme: 'trust',
    difficulty: 2,
  },
  {
    id: 'm6',
    text: 'How would a teammate support you right now?',
    theme: 'teamwork',
    difficulty: 3,
  },
];

export function getRandomMission(): Mission {
  return missions[Math.floor(Math.random() * missions.length)];
}
