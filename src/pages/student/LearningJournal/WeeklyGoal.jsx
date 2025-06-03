import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  getWeeklyGoals,
  updateWeeklyGoal,
  createWeeklyGoal,
  deleteWeeklyGoal,
} from "../../../services/WeeklyGoalService";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { getStudentById, getUser } from "../../../services/UserService";

// Debounce hook for auto-save
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function WeeklyGoal({ weekId, isSubmitted = false }) {
  const [goalIndex, setGoalIndex] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [userIdFromGetUser, setUserIdFromGetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { studentId } = useParams();
  const isReadOnly = !!studentId || isSubmitted;

  // Memoize current user ID
  const currentUserId = useMemo(() =>
    studentId || userIdFromGetUser,
    [studentId, userIdFromGetUser]
  );

  // Create empty goals when no goals exist
  const displayGoals = useMemo(() => {
    if (weeklyGoals.length === 0 && !isLoading) {
      return Array(3).fill(null).map((_, index) => ({
        id: `empty-${index}`,
        goal: "",
        is_achieved: 0,
        isEmpty: true,
        week_id: weekId,
        student_id: currentUserId,
      }));
    }
    return weeklyGoals;
  }, [weeklyGoals, isLoading, weekId, currentUserId]);

  // Calculate pagination
  const { visibleGoals, canGoPrev, canGoNext, totalPages } = useMemo(() => {
    const visible = displayGoals.slice(goalIndex, goalIndex + 3);
    // Fill remaining slots with empty goals if needed
    while (visible.length < 3) {
      visible.push({
        id: `empty-${visible.length}`,
        goal: "",
        is_achieved: 0,
        isEmpty: true,
        week_id: weekId,
        student_id: currentUserId,
      });
    }

    return {
      visibleGoals: visible,
      canGoPrev: goalIndex > 0,
      canGoNext: goalIndex + 3 < displayGoals.length,
      totalPages: Math.ceil(Math.max(displayGoals.length, 3) / 3)
    };
  }, [displayGoals, goalIndex, weekId, currentUserId]);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      if (!studentId) {
        try {
          const user = await getUser();
          setUserIdFromGetUser(user.data.id);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };
    fetchUserId();
  }, [studentId]);

  // Fetch weekly goals
  useEffect(() => {
    if (!weekId || !currentUserId) return;

    const fetchWeeklyGoals = async () => {
      setIsLoading(true);
      try {
        const data = (await getWeeklyGoals(currentUserId, weekId)).data;
        setWeeklyGoals(data || []);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        setWeeklyGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyGoals();
  }, [weekId, currentUserId]);

  const handlePrev = useCallback(() => {
    setGoalIndex(prev => Math.max(prev - 3, 0));
  }, []);

  const handleNext = useCallback(() => {
    setGoalIndex(prev => Math.min(prev + 3, Math.max(displayGoals.length - 3, 0)));
  }, [displayGoals.length]);

  const handleGoalSave = useCallback((savedGoal, originalGoal) => {
    if (originalGoal.isEmpty) {
      // Add new goal
      setWeeklyGoals(prev => [...prev, savedGoal]);
    } else {
      // Update existing goal
      setWeeklyGoals(prev =>
        prev.map(g => g.id === savedGoal.id ? savedGoal : g)
      );
    }
  }, []);

  const handleGoalDelete = useCallback((goalId) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const handleAddGoal = useCallback(() => {
    const newGoal = {
      id: `new-${Date.now()}`,
      goal: "",
      is_achieved: 0,
      isEmpty: true,
      week_id: weekId,
      student_id: currentUserId,
    };
    setWeeklyGoals(prev => [...prev, newGoal]);
  }, [weekId, currentUserId]);

  if (isLoading) {
    return (
      <div className="weekly-goal-container">
        <div className="weekly-goal-loading">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="weekly-goal-container">
      <div className="weekly-goal-header">
        <h4 className="weekly-goal-title">Weekly Goals</h4>
        <div className="weekly-goal-pagination">
          {totalPages > 1 && (
            <span className="pagination-info">
              Page {Math.floor(goalIndex / 3) + 1} of {totalPages}
            </span>
          )}
        </div>
      </div>

      <div className="weekly-goal-content">
        <button
          className="nav-button prev"
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label="Previous goals"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="goals-grid">
          {visibleGoals.map((goal, index) => (
            <WeeklyGoalForm
              key={goal.id}
              goal={goal}
              isReadOnly={isReadOnly}
              onSave={handleGoalSave}
              onDelete={handleGoalDelete}
              position={index + 1}
            />
          ))}
        </div>

        <button
          className="nav-button next"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next goals"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="weekly-goal-actions">
        <button
          className="add-goal-button"
          onClick={handleAddGoal}
          disabled={isReadOnly || !currentUserId}
          title="Add new goal"
        >
          <i className="bi bi-plus"></i>
          <span>Add Goal</span>
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <style jsx>{`
        .weekly-goal-container {
          border:1px solid #FE9C3B;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(254, 156, 59, 0.2);
          border-bottom: 3px solid #2AB9E2;
          max-width: 100%;
          margin: 0 auto;
        }

        .weekly-goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .weekly-goal-title {
          color: black;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .pagination-info {
          color: black;
          font-size: 11px;
          background: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .weekly-goal-content {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .weekly-goal-actions {
          display: flex;
          justify-content: center;
        }

        .add-goal-button {
          background: #2AB9E2;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 6px rgba(42, 185, 226, 0.3);
        }

        .add-goal-button:hover:not(:disabled) {
          background: #1a9bc7;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(42, 185, 226, 0.4);
        }

        .add-goal-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .add-goal-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .add-goal-button i {
          font-size: 12px;
        }

        .nav-button {
          background: rgba(46, 46, 46, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-button:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-button i {
          color: black;
          font-size: 14px;
        }

        .goals-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .weekly-goal-loading {
          text-align: center;
          color: #fff;
          padding: 20px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .goals-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          
          .weekly-goal-container {
            padding: 12px;
          }
          
          .nav-button {
            width: 28px;
            height: 28px;
          }

          .add-goal-button {
            padding: 5px 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

export function WeeklyGoalForm({ goal, isReadOnly, onSave, onDelete, position }) {
  const [formData, setFormData] = useState(goal);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Refs để track previous values và prevent unnecessary saves
  const previousGoalRef = useRef(goal.goal);
  const previousIsAchievedRef = useRef(goal.is_achieved);
  const saveTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Debounce for auto-save
  const debouncedFormData = useDebounce(formData, 1000);

  useEffect(() => {
    setFormData(goal);
    setHasChanged(false);
    // Update refs when goal changes from parent
    previousGoalRef.current = goal.goal;
    previousIsAchievedRef.current = goal.is_achieved;
    isInitializedRef.current = true;
  }, [goal]);

  // Auto-save effect với better logic
  useEffect(() => {
    // Skip if not initialized, readonly, currently saving, or no changes
    if (!isInitializedRef.current || isReadOnly || isSaving || !hasChanged) return;

    // Skip if goal is empty (new goal)
    if (goal.isEmpty) return;

    // Skip if no actual content to save
    if (!debouncedFormData.goal?.trim()) return;

    // Check if values actually changed compared to original
    const goalChanged = debouncedFormData.goal !== previousGoalRef.current;
    const achievedChanged = debouncedFormData.is_achieved !== previousIsAchievedRef.current;

    if (!goalChanged && !achievedChanged) {
      return;
    }

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for saving
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const res = await updateWeeklyGoal(goal.id, {
          goal: debouncedFormData.goal.trim(),
          is_achieved: debouncedFormData.is_achieved,
          week_id: debouncedFormData.week_id,
          student_id: debouncedFormData.student_id,
        });

        // Update refs with new values
        previousGoalRef.current = debouncedFormData.goal;
        previousIsAchievedRef.current = debouncedFormData.is_achieved;

        onSave?.(res.data, goal);
        setHasChanged(false);

        // Show success toast only occasionally to avoid spam
        const now = Date.now();
        const lastToast = window.lastSaveToast || 0;
        if (now - lastToast > 5000) { // Only show toast every 5 seconds max
          window.lastSaveToast = now;
        }
      } catch (error) {
        const message = error.response?.data?.message || "Save failed";
        toast.error(message);
      } finally {
        setIsSaving(false);
      }
    }, 500); // Small additional delay after debounce

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debouncedFormData, hasChanged, goal, isReadOnly, isSaving, onSave]);

  // Handle manual save for new goals
  const handleManualSave = useCallback(async () => {
    if (!goal.isEmpty || !formData.goal?.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const payload = {
        goal: formData.goal.trim(),
        is_achieved: formData.is_achieved,
        week_id: formData.week_id,
        student_id: formData.student_id,
      };

      if (!payload.week_id || !payload.student_id) {
        toast.error("Missing required fields!");
        return;
      }

      const res = await createWeeklyGoal(payload);
      onSave?.(res.data, goal);
      setHasChanged(false);
      toast.success("Goal created!", { autoClose: 2000 });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create goal";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [goal, formData, isSaving, onSave]);

  const handleInputChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Only set hasChanged if value actually changed
    if (name === 'goal') {
      setHasChanged(value !== previousGoalRef.current);
    } else if (name === 'is_achieved') {
      setHasChanged(newValue !== previousIsAchievedRef.current);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (goal.isEmpty || isReadOnly) return;

    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await deleteWeeklyGoal(goal.id);
      onDelete?.(goal.id);
      toast.info("Goal deleted", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  }, [goal, isReadOnly, onDelete]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur(); // Trigger auto-save or manual save
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="goal-form-container">
      <div className="goal-form-header">
        <span className="goal-number">{position}</span>
        {isSaving && <div className="saving-indicator">Saving...</div>}
        {!goal.isEmpty && !isReadOnly && (
          <button
            type="button"
            className="weekly-goal-delete-button"
            onClick={handleDelete}
            aria-label="Delete goal"
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>

      <div className="goal-form-content">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id={`achieved-${goal.id}`}
            name="is_achieved"
            checked={formData?.is_achieved === 1}
            onChange={isReadOnly ? undefined : handleInputChange}
            disabled={isReadOnly}
            className="goal-checkbox"
          />
          <label htmlFor={`achieved-${goal.id}`} className="checkbox-label">
            Done
          </label>
        </div>

        <input
          type="text"
          name="goal"
          value={formData?.goal || ""}
          onChange={isReadOnly ? undefined : handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={goal.isEmpty ? handleManualSave : undefined}
          placeholder="Enter your goal..."
          className="goal-input"
          readOnly={isReadOnly}
        />
      </div>

      <style jsx>{`
        .goal-form-container {
          background: #fff;
          border-radius: 8px;
          padding: 10px;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .goal-form-container:hover {
          border-color: #2AB9E2;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        }

        .goal-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .goal-number {
          background: #2AB9E2;
          color: #fff;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .saving-indicator {
          color: #2AB9E2;
          font-size: 9px;
          animation: pulse 1.5s ease-in-out infinite;
          background: rgba(42, 185, 226, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }

        .weekly-goal-delete-button {
          background: #ff6b6b;
          border: none;
          border-radius: 4px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .weekly-goal-delete-button:hover {
          background: #ff5252;
          transform: scale(1.1);
        }

        .weekly-goal-delete-button i {
          color: #fff;
          font-size: 10px;
        }

        .goal-form-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .goal-checkbox {
          width: 14px;
          height: 14px;
          accent-color: #2AB9E2;
          cursor: pointer;
        }

        .checkbox-label {
          color: #333;
          font-size: 11px;
          cursor: pointer;
          font-weight: 500;
        }

        .goal-input {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 6px 8px;
          color: #333;
          font-size: 12px;
          width: 100%;
          transition: all 0.2s ease;
          font-weight: 400;
        }

        .goal-input:focus {
          outline: none;
          border-color: #2AB9E2;
          background: #fff;
          box-shadow: 0 0 0 2px rgba(42, 185, 226, 0.1);
        }

        .goal-input::placeholder {
          color: #6c757d;
          font-weight: 400;
        }

        .goal-input:read-only {
          cursor: default;
          opacity: 0.7;
          background: #e9ecef;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .goal-form-container {
            padding: 10px;
          }
          
          .goal-input {
            font-size: 12px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
}