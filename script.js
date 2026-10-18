function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}

function operate(operator, a, b) {
  if (operator === '+') return add(a, b);
  if (operator === '-') return subtract(a, b);
  if (operator === '*') return multiply(a, b);
  if (operator === '/') return divide(a, b);
  return null;
}

const display = document.querySelector('#display');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let firstNumber = null;
let chosenOperator = null;
let waitingForNextNumber = false;
let justCalculated = false;

// Display the full expression
function updateDisplay() {
  if (chosenOperator !== null && firstNumber !== null) {
    const operatorSymbol = {
      '*': '×',
      '/': '÷'
    }[chosenOperator] || chosenOperator;

    if (waitingForNextNumber) {
      display.textContent = `${firstNumber} ${operatorSymbol}`;
    } else {
      display.textContent = `${firstNumber} ${operatorSymbol} ${currentInput}`;
    }
  } else {
    display.textContent = currentInput;
  }
}

function formatResult(value) {
  // Avoid long floating-point results
  return String(Number(value.toPrecision(10)));
}

function clear() {
  currentInput = '0';
  firstNumber = null;
  chosenOperator = null;
  waitingForNextNumber = false;
  justCalculated = false;
  updateDisplay();
}

function enterDigit(digit) {
  if (
    waitingForNextNumber ||
    justCalculated ||
    currentInput === 'Nice try! No ÷ 0'
  ) {
    currentInput = digit;
    waitingForNextNumber = false;
    justCalculated = false;
  } else if (currentInput === '0') {
    currentInput = digit;
  } else if (currentInput.length < 15) {
    currentInput += digit;
  }

  updateDisplay();
}

function enterDecimal() {
  if (
    waitingForNextNumber ||
    justCalculated ||
    currentInput === 'Nice try! No ÷ 0'
  ) {
    currentInput = '0.';
    waitingForNextNumber = false;
    justCalculated = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }

  updateDisplay();
}

function calculate() {
  // Require two numbers and an operator
  if (
    chosenOperator === null ||
    firstNumber === null ||
    waitingForNextNumber
  ) {
    return;
  }

  const result = operate(
    chosenOperator,
    firstNumber,
    Number(currentInput)
  );

  if (result === null || !Number.isFinite(result)) {
    currentInput = 'Nice try! No ÷ 0';
  } else {
    currentInput = formatResult(result);
  }

  firstNumber = null;
  chosenOperator = null;
  waitingForNextNumber = false;
  justCalculated = true;

  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (currentInput === 'Nice try! No ÷ 0') return;

  // Calculate previous operation before starting another
  if (chosenOperator !== null && !waitingForNextNumber) {
    calculate();

    if (currentInput === 'Nice try! No ÷ 0') return;
  }

  firstNumber = Number(currentInput);
  chosenOperator = nextOperator;
  waitingForNextNumber = true;
  justCalculated = false;

  // Show the selected operator
  updateDisplay();
}

function backspace() {
  if (currentInput === 'Nice try! No ÷ 0') {
    clear();
    return;
  }

  if (waitingForNextNumber) return;

  currentInput =
    currentInput.length > 1
      ? currentInput.slice(0, -1)
      : '0';

  if (currentInput === '' || currentInput === '-') {
    currentInput = '0';
  }

  justCalculated = false;
  updateDisplay();
}

function handleAction(action) {
  if (action === 'equals') calculate();
  if (action === 'clear') clear();
  if (action === 'decimal') enterDecimal();
  if (action === 'backspace') backspace();
}

// Button interactions
buttons.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.digit !== undefined) {
    enterDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action) {
    handleAction(button.dataset.action);
  }
});

// Keyboard support
document.addEventListener('keydown', (event) => {
  if (
    event.key >= '0' &&
    event.key <= '9' &&
    event.key.length === 1
  ) {
    enterDigit(event.key);
  } else if (['+', '-', '*', '/'].includes(event.key)) {
    event.preventDefault();
    chooseOperator(event.key);
  } else if (event.key === '.') {
    enterDecimal();
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    backspace();
  } else if (event.key === 'Escape') {
    clear();
  }
});

updateDisplay();
