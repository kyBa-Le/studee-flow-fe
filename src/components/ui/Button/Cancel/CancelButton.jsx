import styles from "./CancelButton.module.css"

export function CancelButton({onClick, type = "button"}) {
    return (
        <button type={type} onClick={onClick} className={styles.actionButton}>
            Cancel
        </button>
    );
}