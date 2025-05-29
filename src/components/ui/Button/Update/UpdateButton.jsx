import styles from "./UpdateButton.module.css"

export function UpdateButton({onClick, type = "button", children = "Update"}) {
    return (
        <button type={type} onClick={onClick} className={styles.actionButton}>
            {children}
        </button>
    );
}