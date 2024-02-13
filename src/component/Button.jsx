import style from "./Button.module.css";
function Button({ children, onClick, type }) {
  return (
    <button onClick={onClick} className={`${style.btn} ${style[type]}`}>
      {children}
    </button>
  );
}

export default Button;
