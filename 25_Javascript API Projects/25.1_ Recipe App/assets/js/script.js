const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");

const fetchRecipes = async (query) => {
    try
    {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
    
        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belong to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement('button');
            button.textContent= "View Recipe";
            recipeDiv.appendChild(button);
    
            // Ading EventListener to recipe button
            button.addEventListener('click', ()=> {
                openRecipePopup(meal);
            });
    
            recipeContainer.appendChild(recipeDiv);
        });
    }
    catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
    
}

// Function to fetch ingreients and meaasurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <=20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient)
        {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<i>${measure} ${ingredient}</i>`
        }
        else{
             break;
        }
    }
    return ingredientsList;
}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
        <div class="recipeIntructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', () =>{
    recipeDetailsContent.parentElement.style.display = "none";
});
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput)
    {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
