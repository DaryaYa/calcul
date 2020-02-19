const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const totalElement = document.querySelector('.total');
const endButton = document.querySelector('.end-button');
const fastRange = document.querySelector('.fast-range');
const totalPriceSum = document.querySelector('.total_price__sum');
const mobileTemplate = document.getElementById('mobileTemplates');

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [
        [2, 7],
        [3, 10],
        [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
};

function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

function priceCalculation(elem) {

    let result = 0;
    let index = 0;
    let options = [];

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElement(fastRange);
    }

    if (elem.id === 'adapt' && elem.checked) {
        console.dir(mobileTemplate)
        mobileTemplate.disabled = false;
        DATA['mobileTemplates'] = 15;
    } else if (elem.id === 'adapt' && !elem.checked) {
        mobileTemplate.disabled = true;
        DATA['mobileTemplates'] = 0;
    }

    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value)
        }
    }

    options.forEach(function(key) {
        if (typeof(DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key]
            } else { result += DATA.price[index] * DATA[key] / 100 }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index];
            }
        }
    })
    result += DATA.price[index];
    totalPriceSum.textContent = result;
}

function handlerCallbackForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElement(fastRange) : hideElement(fastRange);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

startButton.addEventListener('click', function() {
    hideElement(firstScreen);
    showElement(mainForm);
});

endButton.addEventListener('click', function() {

    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElement(elem);
        }
    };

    showElement(totalElement);
});

formCalculate.addEventListener('click', handlerCallbackForm);