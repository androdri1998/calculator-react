import "./button.css";

interface ButtonProps {
  value: string | number;
  onClick: () => void;
}

const Button = ({ value, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{value}</button>;
};

export default Button;
