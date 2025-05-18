export function InClass() {
  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        <div className="learning-journal-row header-row">
          <div className="learning-journal-cell header">Date</div>
          <div className="learning-journal-cell header">Skills/Module</div>
          <div className="learning-journal-cell header">
            My lesson What did I learn today?
          </div>
          <div className="learning-journal-cell header">Time allocation</div>
          <div className="learning-journal-cell header">In class page</div>
          <div className="learning-journal-cell header">
            Learning activities
          </div>
          <div className="learning-journal-cell header">Concentration</div>
          <div className="learning-journal-cell header">
            Plan &amp; follow plan
          </div>
          <div className="learning-journal-cell header">
            Evaluation of my work What was positive about my work and what did
            not work so well?
          </div>
          <div className="learning-journal-cell header">
            Reinforcing learning What do I do to go over what I have learned and
            to reinforce it?
          </div>
          <div className="learning-journal-cell header">Notes</div>
        </div>

        {/* Row 1 */}
        <div className="learning-journal-row">
          <div className="learning-journal-cell">
            <textarea
              name="date_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              12 Feb
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="skill_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              TOEIC
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="lesson_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              vocabulary
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="time_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              1h
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              Youtube
            </a>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="activity_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Do exercises on word recognition
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <select name="concentration_0" defaultValue="Not sure">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="learning-journal-cell">
            <select name="plan_0" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="evaluation_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Understand nouns, verbs and adverbs
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="reinforce_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Still have difficulty identifying and filling in words correctly
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="notes_0"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              No
            </textarea>
          </div>
        </div>

        {/* Row 2 */}
        <div className="learning-journal-row">
          <div className="learning-journal-cell">
            <textarea
              name="date_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              13 Feb
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="skill_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              IT English
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="lesson_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Grammar - Part of speech (N, adj)
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="time_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              3h
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="resource_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Youtube
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="activity_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Learn IT related vocabulary
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <select name="concentration_1" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="learning-journal-cell">
            <select name="plan_1" defaultValue="Yes">
              <option value="Not sure">Not sure</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="evaluation_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Not good: can only remember 2-4 words
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="reinforce_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            >
              Apply the method of learning words by repetition to be able to
              remember
            </textarea>
          </div>
          <div className="learning-journal-cell">
            <textarea
              name="notes_1"
              rows="2"
              style={{ width: "100%", resize: "none", outline: "none" }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
