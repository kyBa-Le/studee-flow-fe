export function AddLearningJournalFormButton({ onClick }) {
    const style = {
        backgroundColor: '#FE9A3B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30px',
        height: '30px',
        color: 'white',
        fontWeight: 500,
        borderRadius: '5px',
    };
    return (
        <button onClick={onClick} type="button" style={style} className="add-new-form-button">+</button>
    );
}