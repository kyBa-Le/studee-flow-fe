import styles from './ButtonDelete.module.css';

export function ButtonDelete({onClick, type = "button"}) {
    return (
        <button type={type} onClick={onClick} className={styles.actionButton}>
            <i className="fas fa-trash" style={{ marginRight: '5px' }}></i>
            Delete
        </button>
    );
}
