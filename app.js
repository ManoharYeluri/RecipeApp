const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    let randomMeal = await resp.json();
    randomMeal = randomMeal.meals[0];
    //console.log(randomMeal);
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    const respData = await resp.json();
    globalThis.respData = respData;
    const meal = respData.meals[0];
    return meal;
}

async function getMealsBySearch(searchterm) {
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + searchterm)
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
        ${random ? '<span class="random">Random recipe</span>' : ''}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>  
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener('click', (e) => {
        if (btn.classList.contains("active")) {
            removeMealFromLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealToLS(mealData.idMeal);
            btn.classList.add("active");
        }

        favoriteContainer.innerHTML = '';
        fetchFavMeals();
    })

    meals.appendChild(meal);
}

function addMealToLS(mealsId) {
    const mealsIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealsIds, mealsId]));
}

function removeMealFromLS(mealId) {
    const mealIds = getMealsFromLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}

function getMealsFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = '';

    const mealsIds = getMealsFromLS();
    const meals = [];
    for (let i = 0; i < mealsIds.length; i++) {
        const mealId = mealsIds[i];
        meal = await getMealById(mealId);
        addMealToFav(meal);
        meals.push(meal);
    }
}

function addMealToFav(mealData) {

    const favMeal = document.createElement('div');
    favMeal.innerHTML = `
         <li>
            <img src="${meal.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
            <button class="clear"><i class="fas fa-window-close"></i></button>
         </li>
    `;

    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    })

    favoriteContainer.appendChild(favMeal);
}