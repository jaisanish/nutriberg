import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function OnboardingModal() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState({ calories: 2000, protein: 120, carbs: 250, fat: 65 });

  useEffect(() => {
    if (user?.isNewUser) {
      setIsOpen(true);
    }
  }, [user]);

  if (!user || !user.isNewUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ dietaryGoals: goals, isNewUser: false });
    addToast('Goals set successfully!', 'success');
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Welcome to NutriBerg! 🎉" maxWidth="500px">
      <div className="text-center mb-lg">
        <p className="text-muted">Let's set up your daily dietary goals before you start tracking meals.</p>
      </div>
      <form onSubmit={handleSave} className="flex flex-col gap-md">
        <div className="input-group">
          <label>Daily Calories (kcal)</label>
          <input type="number" className="input" value={goals.calories} onChange={e => setGoals({ ...goals, calories: Number(e.target.value) })} required />
        </div>
        <div className="grid grid-3 gap-sm">
          <div className="input-group">
            <label>Protein (g)</label>
            <input type="number" className="input" value={goals.protein} onChange={e => setGoals({ ...goals, protein: Number(e.target.value) })} required />
          </div>
          <div className="input-group">
            <label>Carbs (g)</label>
            <input type="number" className="input" value={goals.carbs} onChange={e => setGoals({ ...goals, carbs: Number(e.target.value) })} required />
          </div>
          <div className="input-group">
            <label>Fat (g)</label>
            <input type="number" className="input" value={goals.fat} onChange={e => setGoals({ ...goals, fat: Number(e.target.value) })} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full mt-lg">Save & Continue</button>
      </form>
    </Modal>
  );
}
