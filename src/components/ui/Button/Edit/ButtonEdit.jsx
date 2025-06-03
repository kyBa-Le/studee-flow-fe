import styles from './ButtonEdit.module.css';

export function ButtonEdit({onClick, type = "button"}) {
    return (
        <button type={type} onClick={onClick} className={`${styles.actionButton} ${styles.editClassButton}`}>
            <i className="fas fa-pen" style={{ marginRight: '5px' }}></i>
            Edit
        </button>
    );
}
