export function SmallCancelButton({ onClick }) {
    const style = {
        backgroundColor: '#DC3545',
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
        }} type="button" style={style}><i class="fa-solid fa-xmark"></i></button>
    );
}