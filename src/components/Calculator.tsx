import { useCallback, useMemo, useState } from "react";

import Button from "./Button";

import "./calculator.css";

interface KeyPad {
  type: string;
  value: string;
}

const Calculator = () => {
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [completeOperation, setCompleteOperation] = useState<string>("");

  const keypad = useMemo<KeyPad[]>(
    () => [
      { value: "1", type: "button" },
      { value: "2", type: "button" },
      { value: "+", type: "operation" },
      { value: "3", type: "button" },

      { value: "4", type: "button" },
      { value: "5", type: "button" },
      { value: "-", type: "operation" },
      { value: "6", type: "button" },

      { value: "7", type: "button" },
      { value: "8", type: "button" },
      { value: "/", type: "operation" },
      { value: "9", type: "button" },

      { value: "0", type: "button" },
      { value: "=", type: "equal" },
      { value: "*", type: "operation" },
    ],
    []
  );

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

  const handleOperation = useCallback(
    (operation: string) => {
      setCompleteOperation(`${currentValue} ${operation}`);
      setPendingOperation(operation);
      setPendingValue(currentValue);
      setCurrentValue("0");
    },
    [currentValue]
  );

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

  const strategyActions = useCallback(
    (type: string, value: string) => {
      const actions: { [key: string]: () => void } = {
        operation: () => handleOperation(value),
        button: () => handleClick(parseFloat(value)),
        equal: () => handleCalculate(),
      };

      return actions[type];
    },
    [handleCalculate, handleClick, handleOperation]
  );

  return (
    <main className="calculator">
      <section className="complete-operation">{completeOperation}</section>
      <section className="display">{currentValue}</section>
      <section className="buttons">
        <Button onClick={handleClearCalculator} value={"AC"} />

        {keypad.map((item: KeyPad) => (
          <Button
            key={item.value}
            onClick={strategyActions(item.type, item.value)}
            value={item.value}
          />
        ))}
      </section>
    </main>
  );
};

export default Calculator;
