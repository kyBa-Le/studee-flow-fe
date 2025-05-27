import styles from "./UpdateButton.module.css"

export function UpdateButton({onClick, type = "button"}) {
    return (
        <button type={type} onClick={onClick} className={styles.actionButton}>
            Update
        </button>
    );
}