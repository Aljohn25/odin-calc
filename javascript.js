const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '−': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

const calcContainer = document.querySelector('#calculator-body');

calcContainer.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) return;

    let value = target.textContent.trim().toUpperCase();

    if (value === 'X') value = '*';

    if (!isNaN(value)) {
        inputDigit(value);
    } else if (value === '.') {
        inputDecimal();
    } else if (value === '=') {
        handleOperator('=');
    } else if (['/', '*', '-', '−', '+'].includes(value)) {
        handleOperator(value);
    } else if (value === 'CLEAR' || value === 'RESET' || value === 'AC' || value === 'C') {
        resetCalculator();
    } else if (value === 'DEL' || value === 'DELETE' || value === 'CE') {
        deleteDigit();
    }

    updateDisplay();
});

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal() {
    if (calculator.waitingForSecondOperand) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes('.')) {
        calculator.displayValue += '.';
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator === '=' ? null : nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        const formattedResult = parseFloat(result.toFixed(7));
        
        calculator.firstOperand = formattedResult;
        calculator.displayValue = `${formattedResult}`;
    }

    if (nextOperator === '=') {
        calculator.operator = null;
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function deleteDigit() {
    
    if (calculator.waitingForSecondOperand && calculator.operator !== null) {
        calculator.operator = null;
        calculator.displayValue = `${calculator.firstOperand}`;
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        return;
    }

    
    calculator.displayValue = calculator.displayValue.slice(0, -1);

    if (calculator.displayValue === '' || calculator.displayValue === '-') {
        calculator.displayValue = '0';

        
        if (calculator.operator !== null) {
            calculator.waitingForSecondOperand = true;
        }
    }
}

function updateDisplay() {
    const display = document.querySelector('#screen'); 
    if (!display) return;

    let outputText = calculator.displayValue;

    if (calculator.firstOperand !== null && calculator.operator) {
        if (calculator.waitingForSecondOperand) {
            outputText = `${calculator.firstOperand} ${calculator.operator}`;
        } else {
            outputText = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
        }
    }

    if (display.tagName === 'INPUT') {
        display.value = outputText;
    } else {
        display.textContent = outputText;
    }
}

updateDisplay();