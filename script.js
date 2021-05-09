const app = {};

// empty array to track which keys are currently pressed to navigate dropdown
app.activeKeys=[];

// selectors
const body = document.querySelector('body');
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdownContent');
const form = document.querySelector('form');
const formContainer = document.querySelector('.formContainer');
const genreTags = document.querySelectorAll('#genreTags li');
const genreTagsContainer = document.querySelector('.genreTagsContainer');
const headerFlexContainer = document.querySelector('.headerFlexContainer');
const main = document.querySelector('main');
const resultsHeadingQuery = document.getElementById('searchQuery');
const resultsList = document.getElementById('results');
const searchButtons = document.querySelectorAll('.searchButton')
const searchInput = document.getElementById('search');
const submitButton = document.querySelector('.submitButton');
const title = document.querySelector('h1');

// take in the search query and search method and run the API call to Last.fm
app.getArtistsInfo = (query = searchInput.value, searchMethod = 'artist.search') => {
	
	// initialize the url for last.fm API
	const url = new URL('https://ws.audioscrobbler.com/2.0/');

	// modify the search parameters for last.fm API call
	url.search = new URLSearchParams({
		method: searchMethod,
		artist: query,
		api_key: '3f350f5eaa519a05c6b21c5afc810ec0',
		limit: 12,
		format: 'json'
	})

	// last.fm API call
	fetch(url)
		.then((response) => {
			return response.json();
		}).then((data) => {
			app.displayArtistsInfo(data, searchMethod);
		})
	
	app.changeResultsHeading(query);
}

// get the artist's displayed on screen and find a gif to represent them
app.getArtistPicture = (artist, query, artistContainer) => {
	// initialize giphy API base url
	const giphyURL = new URL('https://api.giphy.com/v1/gifs/search')

	// set giphy search parameters
	giphyURL.search = new URLSearchParams({
		api_key: 'jGXNQaBmzgNmpV5vrHUt2lcq0QMg7F1s',
		q: query,
		rating: 'pg',
		limit: 1
	})

	// giphy API call
	fetch(giphyURL)
		.then((response) => {
			return response.json();
		}).then((data) => {
			const picture = data.data[0].images.original.url;
			
			// take picture information and pass to function to display
			app.displayArtistRecommendations(artist, picture, artistContainer);
		});
		
}

// displays the artists recommendations on screen
app.displayArtistRecommendations = ({ name, url }, picture, artistContainer) =>{
	// setting the HTML
	const artistInfo = `${name} 
			<div class="imageContainer">
				<img src="${picture}" alt="${name}">
			</div>
			<a href="${url}" target="_blank">Check out their Last.fm page</a>`

	// adding and appending to browser
	artistContainer.innerHTML = artistInfo;
	resultsList.append(artistContainer);
}

// displays the searched artist information
app.displayArtistsInfo = (data, searchMethod) => {
	// initialize variable to hold the artist results
	let artistsResults;

	// checking for if we're displaying artist serach or artist recommendation and assigning the correct path to artistResults
	if (searchMethod === 'artist.search') {
		if (data.results === undefined) {
			dropdown.classList.remove('isActive');
			artistsResults = [];
		} else {
			artistsResults = data.results.artistmatches.artist
		}
	} else if (searchMethod === 'artist.getSimilar'){
		artistsResults = data.similarartists.artist
	}

	dropdownContent.innerHTML = '';
	dropdown.classList.add('isActive');
	// loop through each artist and add to the page
	artistsResults.forEach((artist) => {
		// create list item for each artist
		const artistContainer = document.createElement('li');
		
		// if adding to autocomplete dropdown
		if (searchMethod === 'artist.search') {
			// adding styling to individual dropdown list item
			artistContainer.classList.add('dropdownItem');
			// ensuring each list item is focusable for accessibility
			artistContainer.setAttribute('tabindex', '0');
			// adding the artist name to the list item
			artistContainer.innerHTML = `${artist.name}`;
			//  add event handlers for the list item
			artistContainer.addEventListener('click', app.handleArtistClick);
			artistContainer.addEventListener('blur', app.handleArtistBlur);
			artistContainer.addEventListener('keydown', app.handleArtistSelect);
			// adding to page
			dropdownContent.append(artistContainer);
		// if displaying recommended artist
		} else if (searchMethod === 'artist.getSimilar') {
			app.preparePageForResults(artist, artistContainer);
		}		
	})
}

// transforms the header to a top search bar to make room for artists on the page
app.transformHeader = () => {
	// add the class to move header to top of screen
	headerFlexContainer.classList.add('topPosition');
	headerFlexContainer.classList.remove('genreTopPosition', 'artistTopPosition');
}

// transforms the main section when a search is placed 
app.transformMain = () => {
	// add the class to move header to top of screen
	main.classList.add('bigMain');
}

// timeout for the dropdown
app.debounce = (func, delay) => {
	let timeoutID;
	return () => {
		if (timeoutID) {
			clearTimeout(timeoutID);
		};
		
		timeoutID = setTimeout(() => {
			func();
		}, delay);
	}
}

// function to get top artists for specific genres
app.getGenreArtists = (query) => {
	// initialize the url for last.fm API
	const url = new URL('https://ws.audioscrobbler.com/2.0/');

	url.search = new URLSearchParams({
		method: 'tag.getTopArtists',
		api_key: '3f350f5eaa519a05c6b21c5afc810ec0',
		limit: 12,
		tag: query,
		format: 'json'
	})

	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// extracting array of top artists from returned data 
			const artistsArray = data.topartists.artist;
			// looping through each artist and adding to page
			artistsArray.forEach((artist) => {
				const artistContainer = document.createElement('li');
				app.preparePageForResults(artist, artistContainer);
			})
		})
}

// function to initialize event listener for genre tags
app.addGenreTagEventListeners = () => {
	// loop through each genre tag and add event listeners
	genreTags.forEach((tag) => {
		// on click, run the API call and adjust the page
		tag.addEventListener('click', (event) => {
			app.getGenreArtists(event.target.id);
			app.changeResultsHeading(event.target.textContent);
		});
		// on enter, run the API call and adjust the page
		tag.addEventListener('keydown', app.handleGenreSelect);
	})
}

// function to adjust page for displaying recommended artists and initiates the GIPHY API call
app.preparePageForResults = (artist, artistContainer) => {
	resultsList.innerHTML = '';
	artistContainer.classList.add('artist');
	app.transformHeader();
	app.transformMain();
	app.getArtistPicture(artist, artist.name, artistContainer);
}

// function to determine the active search method based on user selection
app.getSearchMethod = (method) => {
	if (method === 'searchByArtist') {
		app.toggleSearchMethod(formContainer, genreTagsContainer)
	} else if (method === 'searchByGenre') {
		app.toggleSearchMethod(genreTagsContainer, formContainer)
	}
}

// function to display active search method
app.toggleSearchMethod = (activeMethod, inactiveMethod) => {
	activeMethod.classList.add('activeSearch');
	inactiveMethod.classList.remove('activeSearch');
}

// function to initialize event listeners for the search method buttons
app.addSearchButtonEventListeners = () => {
	searchButtons.forEach((button) => {
		button.addEventListener('click', ({ target: { id } }) => {
			app.toggleExpandedTopPosition(id);
			app.getSearchMethod(id);
		})
	})
}

// function to resize the header based on the active search method 
app.toggleExpandedTopPosition = (searchMethod) => {
	// only initiate logic if a search has already been made
	if(headerFlexContainer.classList.contains('topPosition')) {
		// if exapnded header is open last search is based on genre
		if (headerFlexContainer.classList.contains('genreTopPosition')) {
			// if last search is based on genre AND the genre button was clicked, close header
			if (searchMethod === 'searchByGenre' && genreTagsContainer.classList.contains('activeSearch')) {
				headerFlexContainer.classList.remove('genreTopPosition');
			// if last search is based on genre AND the artist button was clicked,resize header for artist
			} else {
				headerFlexContainer.classList.add('artistTopPosition');
				headerFlexContainer.classList.remove('genreTopPosition');
			}
		// if expanded header is open and last search is based on artist
		} else if (headerFlexContainer.classList.contains('artistTopPosition')) {
			// if last search is based on artist AND the artist button was clicked, close  header
			if (searchMethod === 'searchByArtist' && formContainer.classList.contains('activeSearch')) {
				headerFlexContainer.classList.remove('artistTopPosition');
			// if last search is based on artist AND the genre button was clicked,resize header for genre
			} else {
				headerFlexContainer.classList.add('genreTopPosition');
				headerFlexContainer.classList.remove('artistTopPosition');
			}
		// if expanded header is currently closed
		} else {
			if (searchMethod === 'searchByGenre') {
				headerFlexContainer.classList.add('genreTopPosition');
			} else if (searchMethod === 'searchByArtist') {
				headerFlexContainer.classList.add('artistTopPosition');
			}
		}
	}
}

// changing the h2 on the results page based on search result
app.changeResultsHeading = (keyword) => {
	resultsHeadingQuery.textContent = keyword;
}

// handler function to get recommended artists based on dropdown selection
app.handleArtistClick = ({ target }) => {
	app.getArtistsInfo(target.textContent, 'artist.getSimilar');
	dropdown.classList.remove('isActive');
}

// handler function to get recommended artists based on dropdown selection through the enter key
app.handleArtistSelect = ({ code, target }) => {
	if (code === 'Enter') {
		app.getArtistsInfo(target.textContent, 'artist.getSimilar');
	}
}

// handler function to get recommended artists based on genre selection through the enter key
app.handleGenreSelect = ({ code, target }) => {
	if (code === 'Enter') {
		app.getGenreArtists(target.id);
		app.changeResultsHeading(target.textContent);
	}
}

// handler function to determine when to close dropdown
app.handleArtistBlur = ({ target }) => {
	const dropdownItems = document.querySelectorAll('.dropdownItem');
	// if blurring on last list item in dropdown AND the user is not tabbing backwards (shift+tab), close drop down
	if (target === dropdownItems[dropdownItems.length - 1] && app.activeKeys.indexOf("Shift") === -1) {
			dropdown.classList.remove('isActive');
	}
}

// handler function to determine when to close dropdown when blur from search bar
app.handleSearchBlur = ({target}) => {
	if (target !== dropdown && target !== searchInput) {
		dropdown.classList.remove('isActive');
	} else if(target === searchInput) {
		dropdown.classList.add('isActive');
	}
}

// handler function to adjust activeKeys array when key is pressed
app.handleKeydown = ({key}) => {
	const keyIndex = app.activeKeys.indexOf(key);
	if (keyIndex === -1) {
		app.activeKeys.push(key);
	}
}

// handler function to adjust activeKeys array when key is released
app.handleKeyup = ({ key }) => {
	const keyIndex = app.activeKeys.indexOf(key);
	if (keyIndex > -1) {
		app.activeKeys.splice(keyIndex, 1);
	}
}

// handler function to adjust activeKeys array when focus leaves page
app.handleBodyBlur = () => {
	app.activeKeys = [];
}

// handler function to adjust page sizing when the title is clicked
app.handleTitle = () => {
	headerFlexContainer.classList.remove('topPosition', 'artistTopPosition', 'genreTopPosition');
	main.classList.remove('bigMain');
}

// handler function for the submit button 
app.handleSubmitButton = (event) => {
	event.preventDefault();

	const searchValue = searchInput.value;
	app.getArtistsInfo(searchValue, 'artist.getSimilar');
	dropdown.classList.remove('isActive');
}

// init function
app.init = () => {
	// event listeners
	body.addEventListener('blur', app.handleBodyBlur);
	body.addEventListener('click', app.handleSearchBlur);
	body.addEventListener('keydown', app.handleKeydown);
	body.addEventListener('keyup', app.handleKeyup);
	searchInput.addEventListener('input', app.debounce(app.getArtistsInfo, 500));
	submitButton.addEventListener('click', app.handleSubmitButton);
	title.addEventListener('click', app.handleTitle);
	app.addGenreTagEventListeners();
	app.addSearchButtonEventListeners();
}

app.init();