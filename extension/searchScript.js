//alert("extension loaded");

//constants
const searchBarId = "injectedApostropheSearchBar";
const barOpenKey = '\'';
const barCloseKey = 'Escape';
//F3 does this in Firefox, but Chrome intercepts that
const continueKey = 'F2';

//are we in the middle of a search now?
var barOpen = false;

//create the search bar
var bodyNode = document.body;
var searchBar = document.createElement("input");
searchBar.nodeType = "text";
searchBar.id = searchBarId;
bodyNode.appendChild(searchBar);

//The most recent search query.  It has to be up here,
//so as to facilitate pickup up where we left off with
//the F2 key.
var lastSearch = "";

//The index of the next link to search;
var searchNext = 0;

//The currently selected link.  It had to be put here,
//so as to be able to reset its style when selecting a
//different one.
var currentLink = null;
var currentLinkStyle = null;

searchBar.focus();

//Listen for the apropriate keystroke input and take action
document.body.addEventListener("keyup", function (keystroke) {
	if (keystroke.key == barOpenKey) {
		if (keystroke.target.nodeName != "INPUT") {
			lastSearch = "";
			showSearchBar();
			document.getElementById(searchBarId).focus();
		}
	}
	else if (keystroke.key == barCloseKey) {
		//close the search bar
		hideSearchBar();

		//stub
		searchNext = 0;
	}
	else if (keystroke.key == continueKey) {
			//continue the search without clearing the last search
			showSearchBar();
			searchLinksForString(lastSearch, searchNext);
			searchNext++;
	}

	else if (barOpen && document.activeElement.id === searchBarId) {
		//begin the search feature here
		lastSearch = getSearchValue();
		searchLinksForString(lastSearch, 0);
		searchNext = 1;
	}
});

function showSearchBar() {
	if (!barOpen) {
		searchBar.value = lastSearch;
		document.getElementById(searchBarId).style.display = "block";
		barOpen = true;
	}
}

function hideSearchBar() {
	if (barOpen) {
		document.getElementById(searchBarId).style.display = "none";
		barOpen = false;
	}
	resetCurrentLink();
}

//Get the current search bar text
function getSearchValue() {
	return document.getElementById(searchBarId).value;
}

//Search all links on the page for a given string
// Params: the string to search for, the instance number
// if you are using the F2 key to iterate
function searchLinksForString (searchString, instanceNo) {
	resetCurrentLink();
	var allLinks = document.getElementsByTagName("a");
	var filteredLinks = [];
	for (var i = 0; i < allLinks.length; i++) {
		if (allLinks[i].innerText.includes(lastSearch)) {
			//console.log("link: " + allLinks[i].innerText);
			filteredLinks.push(allLinks[i]);
		}
	} 
	// target instance is filtered[no]
	if (filteredLinks.length > 0) {
		currentLink = filteredLinks[instanceNo % filteredLinks.length];
		currentLinkStyle = currentLink.style;
		currentLink.style.border = "1px dotted grey";
		mostRecent = instanceNo;
	}
	else {
		console.log("no match for: " + lastSearch);
	}
	//var selection = window.getSelection();
	//selection.empty();
	
	//console.log(currentLink.innerText);
}

function resetCurrentLink() {
	if (currentLink != null) {
		currentLink.style = currentLinkStyle;
		currentLink = null;
	}
}
