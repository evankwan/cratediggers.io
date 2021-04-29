// MVP 
// To display similar artist recommendations to the user
// get user input for artist
// get artist search results from API
// display artist search results on page
// get user selection for artist
// get similar artist recommendations from API

// // Stretch goals
// autocomplete widget - when the user stops typing in the search input, display a drop down of suggested artist searches by making an API call with the value in the search input
// display the top 5 tracks of recommended artist when the user interacts with the displayed artist
// explore option - under the search bar there are genre tags listed. when the user clicks on a tag, display the top artists for that tag
// get bio by making another API call using the artist.getInfo method
// add artist images using the GIPHY API


/////////////////
// PSEUDO CODE //
/////////////////

// a landing page with the app heading " " and a welcome message " "

// under the heading there is a form with a search bar and a submit button

//// STRETCH GOAL-  under the search bar there are genre tags listed. when the user clicks on a tag, display the top artists for that tag

//// STRETCH GOAL - when the user stops typing in the search input, display a drop down of suggested artist searches by making an API call with the value in the search input

// add a submit event on the form to grab the value from the search input and make an API request for artist search

// store the user selection in a variable

// create <li> elements using forEach() for each artist and append to the page on the <ul>

// add a click event of the individual <li>'s to make an API call tog et similar artist recommendations based on which displayed artist was clicked

// store the user selection in a variable

// clear the <ul>

// using forEach() create <li> elements for each similar artist 

//// STRETCH GOAL - get bio by making another API call using the artist.getInfo method

// append the recommended artists to the page on the <ul>

//// STRETCH GOAL - display the top 5 tracks of recommended artist when the user interacts with the displayed artist

//// STRETCH GOAL - add gifs to each artist in the recommended artist results