const app = {};

// selectors
const form = document.querySelector('form');
const button = document.querySelector('button');
const searchInput = document.querySelector('input[type=text]');
const resultsList = document.getElementById('results');

// take in the search query and search method and run the API call to Last.fm
app.getArtistsInfo = (query, searchMethod) => {
	// initialize the url for last.fm API
	const url = new URL('http://ws.audioscrobbler.com/2.0/');

	// modify the serach parameters for last.fm API call
	url.search = new URLSearchParams({
		method: searchMethod,
		artist: query,
		api_key: '3f350f5eaa519a05c6b21c5afc810ec0',
		limit: 10,
		format: 'json'
	})

	// last.fm API call
	fetch(url)
		.then((response) => {
			return response.json();
		}).then((data) => {
			app.displayArtistsInfo(data, searchMethod);
		})
}

// get the artist's displayed on screen and find a gif to represent them
app.getArtistPicture = (artist, query, artistContainer) => {
	// initialize giphy API base url
	const giphyURL = new URL('https://api.giphy.com/v1/gifs/search')

	// set giphy search parameters
	giphyURL.search = new URLSearchParams({
		api_key: 'jGXNQaBmzgNmpV5vrHUt2lcq0QMg7F1s',
		q: query,
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
app.displayArtistRecommendations = (artist, picture, artistContainer) =>{
	// setting the HTML
	const artistInfo = `${artist.name} 
			<img src="${picture}" alt="${artist.name}">
			<a href="${artist.url}">check out their last.fm page</a> `

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
		artistsResults = data.results.artistmatches.artist
	} else if (searchMethod === 'artist.getSimilar'){
		artistsResults = data.similarartists.artist
	}
	
	resultsList.innerHTML = '';

	// loop through each artist and add to the page
	artistsResults.forEach( (artist) => {
		const artistContainer = document.createElement('li');
		artistContainer.classList.add('artist')
		let artistInfo;

		// if this is for an artist search
		if(searchMethod === 'artist.search'){
			artistInfo = artist.name;

			// event listener for click on the artist container to get recommendation
			artistContainer.addEventListener('click', function() {
				app.getArtistsInfo(this.textContent, 'artist.getSimilar');
			})

			// add inner HTML and add to page
			artistContainer.innerHTML = artistInfo;
			resultsList.append(artistContainer);
		}else if(searchMethod === 'artist.getSimilar'){
			// if this is for an artist recommendation
			app.getArtistPicture(artist, artist.name, artistContainer);
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

app.init = () => {
	button.addEventListener('click', (event) => {
		event.preventDefault();

		const searchValue = searchInput.value;
		app.transformHeader();
		app.transformMain();
		app.getArtistsInfo(searchValue,'artist.search');
	})
}

app.init();