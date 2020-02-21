'use strict';
const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const firstFieldset = document.querySelector('.first-fieldset');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const totalElement = document.querySelector('.total');
const endButton = document.querySelector('.end-button');
const fastRange = document.querySelector('.fast-range');
const totalPriceSum = document.querySelector('.total_price__sum');
const adapt = document.getElementById('adapt');
const mobileTemplate = document.getElementById('mobileTemplates');
const desktopTemplate = document.getElementById('desktopTemplates');
const editable = document.getElementById('editable');
const adaptValue = document.querySelector('.adapt_value');
const mobileTemplateValue = document.querySelector('.mobileTemplates_value');
const desktopTemplateValue = document.querySelector('.desktopTemplates_value');
const editableValue = document.querySelector('.editable_value');
const typeSite = document.querySelector('.type-site');
const maxDeadline = document.querySelector('.max-deadline');
const rangeDeadline = document.querySelector('.range-deadline');
const deadlineValue = document.querySelector('.deadline-value');
const calcDescription = document.querySelector('.calc-description');
const metrikaYandex = document.getElementById('metrikaYandex');
const analyticsGoogle = document.getElementById('analyticsGoogle');
const sendOrder = document.getElementById('sendOrder');
const cardHead = document.querySelector('.card-head');
const totalPrice = document.querySelector('.total_price');

const declOfNum = (n, titles) => {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};

const DAY_STRING = ["день", "дня", "дней"];
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

const showElement = element => element.style.display = 'block';
const hideElement = element => element.style.display = 'none';

const dopOptionsString = (yandex, google, order) => {   
    //Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
    let arr = [];
    let str = '';

    if (yandex || google || order) {
        str += 'Подключим';
    }
    
    yandex ? arr.push(' Яндекс Метрику') : '';
    google ? arr.push(' Гугл Аналитику') : '';
    order ? arr.push(' отправку заявок на почту.') : '';
    str += arr.join(',');

    return str;
};

const renderTextContent = (total, site, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplateValue.textContent = mobileTemplate.checked ? 'Да' : 'Нет';
    desktopTemplateValue.textContent = desktopTemplate.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site}${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' : ''}. 
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : ''}  ${dopOptionsString(metrikaYandex.checked, analyticsGoogle.checked, sendOrder.checked)}
    `;
};

const priceCalculation = (elem = {}) => {

    let result = 0;
    let index = 0;
    let options = [];
    let site = '';
    let maxDeadlineDay = DATA.deadlineDay[index][1];
    let minDeadlineDay = DATA.deadlineDay[index][0];
    let overPercent = 0;

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElement(fastRange);
    }

    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
            site = item.dataset.site;
            maxDeadlineDay = DATA.deadlineDay[index][1];
            minDeadlineDay = DATA.deadlineDay[index][0];
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value)
        } else if (item.classList.contains('want-faster') && item.checked) {
            const overDay = maxDeadlineDay - rangeDeadline.value;
            overPercent = (DATA.deadlinePercent[index] / 100) * overDay;
        }
    }
    result += DATA.price[index];

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

    result += result * overPercent;
    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
};

const handlerCallbackForm = event => {
    const target = event.target;

    if (adapt.checked) {
        mobileTemplate.disabled = false;
    } else {
        mobileTemplate.disabled = true;
        mobileTemplate.checked = false;
    }

    if (target.classList.contains('want-faster')) {
        target.checked ? showElement(fastRange) : hideElement(fastRange);
        priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

const moveBackTotal = () => {
     if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
     }

};

const moveTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
};

const renderResponse = response => {
    // if (response.ok) {
        hideElement(totalElement);
        cardHead.style.color ="green";
        cardHead.textContent = 'Спасибо за заявку, мы скоро с вами свяжемся!';
        
    // }
}

const formSubmit = event => {
    event.preventDefault();

    const formData = new FormData(event.target)

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData,
    }).then(renderResponse).catch(err=>console.error(err));
    
}

startButton.addEventListener('click', () => {
    hideElement(firstScreen);
    showElement(mainForm);
    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {

    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElement(elem);
        }
    };

    cardHead.textContent = 'Заявка на разработку сайта';
    // hideElement(totalPrice);
    showElement(totalElement);
});

formCalculate.addEventListener('click', handlerCallbackForm);

formCalculate.addEventListener('submit', formSubmit);

priceCalculation();