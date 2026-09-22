const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    'x': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '−': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

const calcContainer = document.querySelector('#btn-calc');

calcContainer.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) return;

    const value = target.textContent.trim().toUpperCase();

    if (!isNaN(value)) {
        inputDigit(value);
    } else if (value === '.') {
        inputDecimal();
    } else if (value === '=') {
        handleOperator('=');
    } else if (['/', 'X', '*', '-', '−', '+'].includes(value)) {
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
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}


function deleteDigit() {

    if (calculator.waitingForSecondOperand) return;

    calculator.displayValue = calculator.displayValue.slice(0, -1);

    
    if (calculator.displayValue === '' || calculator.displayValue === '-') {
        calculator.displayValue = '0';
    }
}

function updateDisplay() {
    const display = document.querySelector('#screen'); 
    if (display) {
        
        if (display.tagName === 'INPUT') {
            display.value = calculator.displayValue;
        } else {
            display.textContent = calculator.displayValue;
        }
    }
}

updateDisplay();