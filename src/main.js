import axios from 'axios';

const filterButtons = document.querySelector('.filter-buttons');
const exerciseFiltersList = document.querySelector('.exercise-filters-list');
const BASE_URL = 'https://energyflow.b.goit.study/api';
const filterValueDefault = 'Muscles';
// на div з кнопками вішаємо слухача
filterButtons.addEventListener('click', filterBtnClick);

async function filterBtnClick(event) {
  // preventDefault напево нетреба (нема посилань і сабміту)
  event.preventDefault();
  // тут посилання на ДОМ-ел на який клікнули
  const filterValue = event.target;
  // дістаємо значення дата-атрибута елемента, на який клацнули
  const qwer = filterValue.dataset.filter;
  // чому робиш пустим ul при виклику функції?
  // exerciseFiltersList.innerHTML = '';
  console.log(qwer);
  // tagName чи nodeName?
  if (event.target.tagName !== 'BUTTON') {
    return;
  }
  try {
    // передаємо аргументом значення дата атрибута кнопки на яку клікнули
    getExercises(qwer).then(data => {
      console.log(data);
      exerciseFiltersList.innerHTML = markupExercises(data);
    });
  } catch (error) {
    console.log(error);
  }
}
// по замовчувнню значення фільтра буде 'Muscles'
async function getExercises(filter = filterValueDefault) {
  try {
    const response = await axios.get(`${BASE_URL}/filters`, {
      params: {
        filter: filter,
        page: 1,
        limit: 20,
      },
    });
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
}
// функція отримує масив об'єктів
function markupExercises(results) {
  const markup = results
    .map(
      ({
        name,
        filter,
        imgUrl,
      }) => ` <li class='ExercisesItem' data-filter='${filter}' data-name='${name}'>
        <img class="img-exercises" src="${imgUrl}" alt="${filter}">
        <div>
          <p>${name}</p>
          <p>${filter}</p>
        </div>
      </li>`
    )
    .join('');
  return markup;
  // треба іннерhtml, щоб при кліку відбувалась заміна розмітки, а не продовження
  // exerciseFiltersList.insertAdjacentHTML('beforeend', markup);
}

exerciseFiltersList.addEventListener('click', onCardClick);

async function onCardClick(event) {
  if (event.target === event.currentTarget) {
    return;
  }
  // при кліку на картку додаємо клас до ul (бо він має інші стилі)
  exerciseFiltersList.classList.add('ExerciseCategoryList');
  // при кліку на картку шукаємо найближчий елемент у якого буде заданий селектор (це li)
  const liEl = event.target.closest('.ExercisesItem');
  // тепер можемо отримати li дата-атрибути
  const filterValue = liEl.dataset.filter;
  const nameValue = liEl.dataset.name;
  console.log(filterValue); //Muscles
  console.log(nameValue); // abductors
  // передаємо ці атрибути в функцію , яка робить запит
  try {
    const data = await getExercisesByFilter(filterValue, nameValue);
    // це буде масив об'єктів
    exerciseFiltersList.innerHTML = createMarkUp(data);
  } catch (error) {
    console.log(error);
  }
}

async function getExercisesByFilter(filterValue, nameValue) {
  // в запиті можливі три ключі, тому відповідно до значення фільтра пишемо цей ключ
  try {
    if (filterValue === 'Muscles') {
      const response = await axios.get(`${BASE_URL}/exercises`, {
        params: {
          muscles: nameValue,
        },
      });
      return response.data.results;
    } else if (filterValue === 'Body parts') {
      const response = await axios.get(`${BASE_URL}/exercises`, {
        params: {
          bodypart: nameValue,
        },
      });
      return response.data.results;
    } else {
      const response = await axios.get(`${BASE_URL}/exercises`, {
        params: {
          equipment: nameValue,
        },
      });
      return response.data.results;
    }
  } catch (error) {
    console.log(error);
  }
}

function createMarkUp(array) {
  const markup = array
    .map(({ rating, name, burnedCalories, time, bodyPart, target }) => {
      return `<li class="WorkoutCard">
      <div class='CardHeader'>
        <div class='WorkoutWrapper'>
          <p class='Workout'>workout</p>
          <div class='RatingWrapper'><p>${rating}</p>
          <svg class='StarIcon' width='13' height='13'>
          <use href='./img/symbol-defs.svg#icon-star'></use>
        </svg></div>
        </div>
        <div class='StartBtn'>
          <p>Start</p>
          <svg width='13' height='13'>
          <use href='./img/symbol-defs.svg#icon-arrow'></use>
        </svg>
        </div>
      </div>
      <div class='CardMainPart'>
      <div class='RunIconWrapper'><svg width='14' height='14'>
          <use href='./img/symbol-defs.svg#icon-running'></use>
        </svg></div>
        <p class='MainPartName'>${name}</p>
      </div>
      <ul class="CardFooter">
        <li>
          <p class='CardFooterTextDescr'>Burned calories: <span class='CardFooterTextValue'>${burnedCalories} / ${time} min</span></p>
        </li>
        <li>
          <p class='CardFooterTextDescr'>Body part: <span class='CardFooterTextValue'>${bodyPart}</span></p>
        </li>
        <li>
          <p class='CardFooterTextDescr'>Target: <span class='CardFooterTextValue'>${target}</span></p>
        </li>
      </ul>
    </li>`;
    })
    .join('');
  return markup;
}
