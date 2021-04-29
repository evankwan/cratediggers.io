const url = new URL('http://ws.audioscrobbler.com/2.0/');

// last.fm API key: 3f350f5eaa519a05c6b21c5afc810ec0
// giphy API key: jGXNQaBmzgNmpV5vrHUt2lcq0QMg7F1s

// test run of the API
url.search = new URLSearchParams({
	method: 'artist.getInfo',
	artist: 'cher',
	api_key: '3f350f5eaa519a05c6b21c5afc810ec0',
	format: 'json'
})

fetch(url)
	.then( (response) => {
		console.log(response)
		return response.json();
	}).then( (data) => {
		console.log(data);
	})