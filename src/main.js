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
        limit: 8,
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
      ({ name, filter, imgUrl }) => ` <li data-filter>
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
