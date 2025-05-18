export function WeeklyGoal({goals, goalIndex}) {
    return (
        <div className="learning-journal-goals" style={{ flex: 1 }}>
                {goals.slice(goalIndex, goalIndex + 3).map((goal, index) => (
                  <div
                    key={goalIndex + index}
                    className="learning-journal-goal"
                  >
                    <input
                      type="checkbox"
                      name={`goal_${goalIndex + index}`}
                      id={`goal_${goalIndex + index}`}
                    />
                    <label htmlFor={`goal_${goalIndex + index}`}>{goal}</label>
                  </div>
                ))}
              </div>
    )
}