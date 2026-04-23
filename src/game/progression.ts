export function calculateXP(input: string, difficulty: number): number {
  let base = 30 + difficulty * 20;

  if (input.length > 150) base += 20;
  if (input.length > 300) base += 30;

  return base;
}

export function getLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function getTitle(level: number): string {
  const titles = [
    'Observer',
    'Reflector',
    'Collaborator',
    'Strategist',
    'System Builder',
  ];

  return titles[Math.min(level - 1, titles.length - 1)];
}
