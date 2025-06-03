export function AddLearningJournalFormButton({ onClick }) {
    const style = {
        backgroundColor: '#FE9A3B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '25px',
        height: '25px',
        color: 'white',
        fontWeight: 300,
        borderRadius: '5px',
        fontSize: "12px"
    };
    return (
        <button onClick={() => {
            onClick();
        }} type="button" style={style} className="add-new-form-button">+</button>
    );
}