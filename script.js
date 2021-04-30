const app = {};

// selectors
const form = document.querySelector('form');
const button = document.querySelector('button');
const searchInput = document.querySelector('input[type=text]');
const resultsList = document.getElementById('results');

// global variables
const url = new URL('http://ws.audioscrobbler.com/2.0/');
// last.fm API key: 3f350f5eaa519a05c6b21c5afc810ec0
// giphy API key: jGXNQaBmzgNmpV5vrHUt2lcq0QMg7F1s

app.getArtistsInfo = (query) => {
	url.search = new URLSearchParams({
		method: 'artist.search',
		artist: query,
		api_key: '3f350f5eaa519a05c6b21c5afc810ec0',
		limit: 10,
		format: 'json'
	})

	fetch(url)
		.then((response) => {
			return response.json();
		}).then((data) => {
			app.displayArtistsInfo(data);
		})
}

app.displayArtistsInfo = (data) => {
	const artistsResults = data.results.artistmatches.artist;
	resultsList.innerHTML = '';
	artistsResults.forEach( (artist) => {
		const artistContainer = document.createElement('li');
		artistContainer.textContent = artist.name;
		resultsList.append(artistContainer);
		artistContainer.addEventListener('click', () => {
			app.getSimilarArtists();
		})
	})
}

app.getSimilarArtists = () => {
	console.log('hello');
}

app.init = () => {
	button.addEventListener('click', (event) => {
		event.preventDefault();

		const searchValue = searchInput.value;
		app.getArtistsInfo(searchValue);
	})
}

app.init();