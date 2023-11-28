import { useCallback, useMemo, useState } from "react";

import Button from "./Button";

import "./calculator.css";

const Calculator = () => {
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [completeOperation, setCompleteOperation] = useState<string>("");

  const keypadNumbers = useMemo<number[]>(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    []
  );
  const operationals = useMemo<string[]>(() => ["+", "-", "*", "/"], []);

  const handleClick = useCallback((number: number) => {
    setCurrentValue((prevValue: string) => {
      if (prevValue === "0") {
        return String(number);
      }

      if (prevValue === "Error") {
        return String(number);
      }

      return String(prevValue + number);
    });

    setCompleteOperation((prevOperation) => {
      if (prevOperation === "Error") {
        return String(number);
      }

      return prevOperation + number;
    });
  }, []);

  const handleClearCalculator = useCallback(() => {
    setCurrentValue("0");
    setPendingOperation(null);
    setPendingValue(null);
    setCompleteOperation("");
  }, []);

  const handleOperation = (operation: string) => {
    setCompleteOperation(`${currentValue} ${operation}`);
    setPendingOperation(operation);
    setPendingValue(currentValue);
    setCurrentValue("0");
  };

  const handleCalculate = useCallback(() => {
    if (!pendingValue || !pendingOperation) {
      return;
    }

    const number1 = parseFloat(pendingValue);
    const number2 = parseFloat(currentValue);

    let result;
    switch (pendingOperation) {
      case "+":
        result = number1 + number2;
        break;
      case "-":
        result = number1 - number2;
        break;
      case "/":
        if (String(number1) !== "0") {
          result = number1 / number2;
          break;
        }

        setCurrentValue("Error");
        setCompleteOperation("Error");
        setPendingOperation(null);
        setPendingValue(null);
        return;
      case "*":
        result = number1 * number2;
        break;
    }

    setCompleteOperation(
      `${pendingValue}  ${pendingOperation} ${currentValue} = ${result}`
    );
    setCurrentValue(String(result));
    setPendingOperation(null);
    setPendingValue(null);
  }, [currentValue, pendingOperation, pendingValue]);

  return (
    <main className="calculator">
      <section className="complete-operation">{completeOperation}</section>
      <section className="display">{currentValue}</section>
      <section className="buttons">
        <Button onClick={handleClearCalculator} value={"AC"} />

        {keypadNumbers.map((number: number) => (
          <Button
            key={number}
            onClick={() => handleClick(number)}
            value={number}
          />
        ))}

        {operationals.map((operation: string) => (
          <Button
            onClick={() => handleOperation(operation)}
            key={operation}
            value={operation}
          />
        ))}
        <Button onClick={handleCalculate} value={"="} />
      </section>
    </main>
  );
};

export default Calculator;
