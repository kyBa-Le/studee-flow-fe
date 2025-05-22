export function InClass() {
  return (
    <div className="student-selfstudy-table-container">
      <div className="student-selfstudy-table">
        <div className="student-selfstudy-row header-row">
          <div className="student-selfstudy-cell header">Date</div>
          <div className="student-selfstudy-cell header">Skills/Module</div>
          <div className="student-selfstudy-cell header">
            My lesson What did I learn today?
          </div>
          <div className="student-selfstudy-cell header">Time allocation</div>
          <div className="student-selfstudy-cell header">In class page</div>
          <div className="student-selfstudy-cell header">Learning activities</div>
          <div className="student-selfstudy-cell header">Concentration</div>
          <div className="student-selfstudy-cell header">Plan &amp; follow plan</div>
          <div className="student-selfstudy-cell header">
            Evaluation of my work What was positive about my work and what did not work so well?
          </div>
          <div className="student-selfstudy-cell header">
            Reinforcing learning What do I do to go over what I have learned and to reinforce it?
          </div>
          <div className="student-selfstudy-cell header">Notes</div>
        </div>

        {/* Row 1 */}
        <div className="student-selfstudy-row">
          <div className="student-selfstudy-cell">
            <textarea name="date_0" rows="2" style={{ width: '100%', resize: 'none' }}>
12 Feb
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="skill_0" rows="2" style={{ width: '100%', resize: 'none' }}>
TOEIC
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="lesson_0" rows="2" style={{ width: '100%', resize: 'none' }}>
vocabulary
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="time_0" rows="2" style={{ width: '100%', resize: 'none' }}>
1h
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              Youtube
            </a>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="activity_0" rows="2" style={{ width: '100%', resize: 'none' }}>
Do exercises on word recognition
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <select name="concentration_0" defaultValue="Not sure">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="student-selfstudy-cell">
            <select name="plan_0" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="evaluation_0" rows="2" style={{ width: '100%', resize: 'none' }}>
Understand nouns, verbs and adverbs
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="reinforce_0" rows="2" style={{ width: '100%', resize: 'none' }}>
Still have difficulty identifying and filling in words correctly
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="notes_0" rows="2" style={{ width: '100%', resize: 'none' }}>
No
            </textarea>
          </div>
        </div>

        {/* Row 2 */}
        <div className="student-selfstudy-row">
          <div className="student-selfstudy-cell">
            <textarea name="date_1" rows="2" style={{ width: '100%', resize: 'none' }}>
13 Feb
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="skill_1" rows="2" style={{ width: '100%', resize: 'none' }}>
IT English
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="lesson_1" rows="2" style={{ width: '100%', resize: 'none' }}>
Grammar - Part of speech (N, adj)
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="time_1" rows="2" style={{ width: '100%', resize: 'none' }}>
3h
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="resource_1" rows="2" style={{ width: '100%', resize: 'none' }}>
Youtube
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="activity_1" rows="2" style={{ width: '100%', resize: 'none' }}>
Learn IT related vocabulary
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <select name="concentration_1" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="student-selfstudy-cell">
            <select name="plan_1" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="evaluation_1" rows="2" style={{ width: '100%', resize: 'none' }}>
Not good: can only remember 2-4 words
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="reinforce_1" rows="2" style={{ width: '100%', resize: 'none' }}>
Apply the method of learning words by repetition to be able to remember
            </textarea>
          </div>
          <div className="student-selfstudy-cell">
            <textarea name="notes_1" rows="2" style={{ width: '100%', resize: 'none' }}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
