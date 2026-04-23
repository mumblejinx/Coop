import { useState, useEffect } from 'react';
import { useFirebase } from '../core/FirebaseProvider';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { getRandomMission } from '../game/missions';
import { calculateXP } from '../game/progression';

export default function MirrorScreen() {
  const { user } = useFirebase();
  const { 
    addReflectionToFirebase, 
    updateXPInFirebase,
    currentMission,
    setMission,
    streak
  } = useCIS();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (!currentMission) {
      setMission(getRandomMission());
    }
  }, [currentMission]);

  const handleSubmit = async () => {
    if (!input.trim() || !user || !currentMission) return;

    setIsAnalyzing(true);

    try {
      const res = await analyzeReflection(input, { positivityBoost: 1, depthLevel: 1 });

      const xp = calculateXP(input, currentMission.difficulty);
      setXpGained(xp);

      await addReflectionToFirebase(user.uid, {
        input,
        reflection: res.reflection,
        question: res.question,
        theme: currentMission.theme
      });

      await updateXPInFirebase(user.uid, xp);

      setOutput(res);
      setInput('');
      setMission(getRandomMission());

    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!currentMission) return null;

  return (
    <div className="p-6 space-y-6">

      <div className="bg-black text-white p-6 border-[4px] border-black">
        <p className="text-xs uppercase">Mission</p>
        <h2 className="text-2xl font-black">{currentMission.text}</h2>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border-[4px] border-black p-4"
        placeholder="Enter your response..."
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#FF0040] text-white p-4 font-black border-[4px] border-black"
      >
        {isAnalyzing ? 'PROCESSING...' : 'COMPLETE MISSION'}
      </button>

      {output && (
        <div className="bg-white border-[4px] border-black p-6 space-y-4">
          <p>{output.reflection}</p>
          <p className="font-bold">{output.question}</p>

          <div className="text-green-600 font-black">
            +{xpGained} XP
          </div>

          <div>🔥 STREAK: {streak}</div>
        </div>
      )}
    </div>
  );
}