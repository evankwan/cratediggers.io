const app = {};

// selectors
const form = document.querySelector('form');
const submitButton = document.querySelector('.submitButton');
const searchInput = document.querySelector('input[type=text]');
const resultsList = document.getElementById('results');
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdownContent');
const genreTags = document.querySelectorAll('#genreTags li');
const searchButtons = document.querySelectorAll('.searchButton')
const formContainer = document.querySelector('.formContainer');
const genreTagsContainer = document.querySelector('.genreTagsContainer');
const resultsHeadingQuery = document.getElementById('searchQuery');
const body = document.querySelector('body');

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
	if(searchMethod === 'artist.search'){
		if (data.results === undefined) {
			dropdown.classList.remove('isActive');
			artistsResults = [];
		}else{
			artistsResults = data.results.artistmatches.artist
		}
	} else if (searchMethod === 'artist.getSimilar'){
		artistsResults = data.similarartists.artist
	}

	dropdownContent.innerHTML = '';
	dropdown.classList.add('isActive');
	// loop through each artist and add to the page
	artistsResults.forEach( (artist) => {
		const artistContainer = document.createElement('li');
		
		if (searchMethod === 'artist.search') {
			artistContainer.classList.add('dropdownItem');
			artistContainer.setAttribute('tabindex', '0');
			artistContainer.innerHTML = `${artist.name}`;
			artistContainer.addEventListener('click', function () {
				app.getArtistsInfo(this.textContent, 'artist.getSimilar');
				dropdown.classList.remove('isActive');
			});
			artistContainer.addEventListener('blur', function () {
				const dropdownItems = document.querySelectorAll('.dropdownItem');
				
				if (this === dropdownItems[dropdownItems.length - 1]) {
					console.log('blur');
					dropdown.classList.remove('isActive');
				}
			});

			dropdownContent.append(artistContainer);
		} else if (searchMethod === 'artist.getSimilar') {
			app.preparePageForResults(artist, artistContainer);
		}		
	})
}

// transforms the header to a top search bar to make room for artists on the page
app.transformHeader = () => {
	// select the headerFlexContainer
	const headerFlexContainer = document.querySelector('.headerFlexContainer');

	// add the class to move header to top of screen
	headerFlexContainer.classList.add('topPosition');
}

// transforms the main section when a search is placed 
app.transformMain = () => {
	// select the headerFlexContainer
	const main = document.querySelector('main');

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
		.then(response => {
			return response.json();
		})
		.then(data => {
			const artistsArray = data.topartists.artist;
			artistsArray.forEach(artist => {
				const artistContainer = document.createElement('li');
				app.preparePageForResults(artist, artistContainer);
			})
		})
}

app.addGenreTagEventListeners = () => {
	genreTags.forEach(tag => {
		tag.addEventListener('click', (event) => {
			app.getGenreArtists(event.target.id);
			app.changeResultsHeading(event.target.textContent);
		});
	})
}

app.preparePageForResults = (artist, artistContainer) => {
	resultsList.innerHTML = '';
	artistContainer.classList.add('artist');
	app.transformHeader();
	app.transformMain();
	app.getArtistPicture(artist, artist.name, artistContainer);
}

app.getSearchMethod = (method) =>{
	if(method === 'searchByArtist'){
		app.toggleSearchMethod(formContainer,genreTagsContainer)
	}else if(method === 'searchByGenre'){
		app.toggleSearchMethod(genreTagsContainer, formContainer)
	}
}

app.toggleSearchMethod = (activeMethod,inactiveMethod) =>{
	activeMethod.classList.add('activeSearch');
	inactiveMethod.classList.remove('activeSearch');
}

app.addSearchButtonEventListeners = () =>{
	searchButtons.forEach(button =>{
		button.addEventListener('click', (event) =>{
			app.getSearchMethod(event.target.id)
		})
	})
}

app.changeResultsHeading = (keyword) => {
	resultsHeadingQuery.textContent = keyword;
}

app.handleSearchBlur = (event) => {
	if (searchInput.blur) {
		console.log(searchInput.blur);
		dropdown.classList.remove('isActive');
	}
}

app.init = () => {
	// event listeners
	searchInput.addEventListener('input', app.debounce(app.getArtistsInfo, 500));
	body.addEventListener('click', app.handleSearchBlur);
	submitButton.addEventListener('click', (event) => {
		event.preventDefault();

		const searchValue = searchInput.value;
		app.getArtistsInfo(searchValue, 'artist.getSimilar');
		dropdown.classList.remove('isActive');
	})
	app.addGenreTagEventListeners();
	app.addSearchButtonEventListeners();
}

app.init();