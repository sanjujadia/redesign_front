import React, { useState, useContext } from 'react';
// import TokenService from '../../services/token-service';
// import config from '../../config';
import PlannerContext from '../PlannerContext';
import Week from '../Week/Week';
import '../Calendar.css';
import TextInput from '../input/TextInput/TextInput';
import TextArea from '../input/TextArea/TextArea';
import Select from '../input/Select/Select';
import Button from '../input/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSave } from '@fortawesome/free-solid-svg-icons';

function Calendar(props) {
    const [hidden, setHidden] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [recipeName, setRecipeName] = useState('');
    const [recipeDetails, setRecipeDetails] = useState('');
    const [recipeCalories, setRecipeCalories] = useState(0);
    const [meals, setMeals] = useState([]);
    const { addMeal } = useContext(PlannerContext);

    const showInput = () => {
        setHidden(!hidden);
    };

    const saveRecipe = () => {
        const recipe = {
            name: recipeName,
            details: recipeDetails,
            calories: recipeCalories
        };
        setError(null);
        setInfo(null);
        if (recipeName === '') {
            setError("Enter a recipe name before saving it");
            return;
        }

        // fetch(config.API_ENDPOINT + '/recipes', {
        //     method: 'POST',
        //     body: JSON.stringify(recipe),
        //     headers: {
        //         'content-type': 'application/json',
        //         'tion': `bearer ${TokenService.getAuthToken()}`
        //     }
        // })
        //     .then(res => {
        //         if (!res.ok) {
        //             return res.json().then(error => Promise.reject(error));
        //         }
        //         setInfo("Recipe saved");
        //     })
        //     .catch(error => {
        //         setError(error.message);
        //     });
    };

    const handleAdd = (ev) => {
        ev.preventDefault();
        setError(null);
        setInfo(null);

        const { food_name, meal_time, calories, date, food_details } = ev.target;

        if (food_name.value.trim().length > 0) {
            const newMeal = {
                name: food_name.value,
                date: date.value,
                time: meal_time.value,
                details: food_details.value,
                calories: Number(calories.value)
            };
            setError(null);

        //     fetch(config.API_ENDPOINT + '/meal', {
        //         method: 'POST',
        //         body: JSON.stringify(newMeal),
        //         headers: {
        //             'content-type': 'application/json',
        //             'authorization': `bearer ${TokenService.getAuthToken()}`
        //         }
        //     })
        //         .then(res => {
        //             if (!res.ok) {
        //                 return res.json().then(error => Promise.reject(error));
        //             }
        //             return res.json();
        //         })
        //         .then(data => {
        //             newMeal.id = data.id;
        //             newMeal.i = 0;
        //             addMeal(newMeal);
        //         })
        //         .catch(error => {
        //             setError(error.message);
        //         });
        // } else {
        //     setError("The meal name cannot be empty");
        // }
        ev.target.reset();
    };
}

    const search = (text) => {
        setError(null);
        text = text.trim();
        // if (text.length >= 2) {
        //     fetch(config.API_ENDPOINT + '/recipes/' + text, {
        //         method: 'GET',
        //         headers: {
        //             'content-type': 'application/json',
        //             'authorization': `bearer ${TokenService.getAuthToken()}`
        //         }
        //     })
        //         .then(res => {
        //             if (!res.ok) {
        //                 return res.json().then(error => Promise.reject(error));
        //             }
        //             return res.json();
        //         })
        //         .then(data => {
        //             if (data.length === 0) {
        //                 setError("No matching recipes found in your list");
        //             }
        //             setMeals(data);
        //         })
        //         .catch(error => {
        //             setError(error.message);
        //         });
        // } else {
        //     setError("Recipe name is too short");
        // }
    };

    const handleChange = (ev) => {
        if (ev.target.id === 'food_name') {
            setRecipeName(ev.target.value);
        }
        if (ev.target.id === 'food_details') {
            setRecipeDetails(ev.target.value);
        }
        if (ev.target.id === 'calories') {
            setRecipeCalories(ev.target.value);
        }
    };

    const handleSearch = () => {
        search(recipeName);
    };

    const handleSelect = (meal) => {
        setRecipeName(meal.name);
        setRecipeDetails(meal.details);
        setRecipeCalories(meal.calories);
        setMeals([]);
    };

    let searchResults = meals.map(meal => (
        <li key={meal.id} onClick={() => handleSelect(meal)}>{meal.name}</li>
    ));

    return (
        <div className="calendar">
            <div className="timeline">
                {!hidden && (
                    <div className="input">
                        <form className="food-log-form" onSubmit={handleAdd}>
                            <h2>Add a meal to your calendar</h2>
                            <div role='alert' className="error">
                                {error && <p className='red'>{error}</p>}
                            </div>
                            <div className="search-bar">
                                <TextInput
                                    label="Add a recipe"
                                    onChange={ev => handleChange(ev)}
                                    placeholder="Enter recipe name..."
                                    id="food_name"
                                    value={recipeName}
                                    required={true}
                                />
                                <FontAwesomeIcon
                                    role="button"
                                    title="Search for matching recipes in your list"
                                    className="search-icon"
                                    onClick={handleSearch}
                                    icon={faSearch}
                                />
                            </div>
                            <ul className="search-results">{searchResults}</ul>
                            <TextArea
                                label="Details"
                                value={recipeDetails}
                                placeholder="Enter recipe details..."
                                id="food_details"
                                onChange={ev => handleChange(ev)}
                            />
                            <div className="search-bar">
                                <TextInput
                                    type="number"
                                    label="Calories"
                                    min="0"
                                    id="calories"
                                    value={recipeCalories}
                                    onChange={ev => handleChange(ev)}
                                />
                                <FontAwesomeIcon
                                    role="button"
                                    className="search-icon"
                                    title="Save this recipe to your list"
                                    onClick={saveRecipe}
                                    icon={faSave}
                                />
                            </div>
                            <div role='alert' className="info">
                                {info && <p className='green'>{info}</p>}
                            </div>
                            <TextInput label="Select Date" type="date" id="date" required={true} />
                            <Select label="Time" options={['breakfast','snack-1', 'lunch','snack-2', 'dinner','snack-3']} id="meal_time" />
                            <Button text="Add Meal" type="submit" />
                        </form>
                    </div>
                )}
                <div className="days-of-week">
                    <Week show={showInput} week={props.week} />
                </div>
            </div>
        </div>
    );
}

export default Calendar
