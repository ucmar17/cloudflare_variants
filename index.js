var index = null;

addEventListener('fetch', event => {
		event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
 async function handleRequest(request) {

 	const COOKIE_NAME = 'index';

 	const cookie = getCookie(request, COOKIE_NAME);

 	if(cookie){
 		index = parseInt(cookie);
 	} else {
 		if(Math.random() < 0.5){
			index = 0;
		} else {
			index = 1;
		}
 	}

	const url = 'https://cfw-takehome.developers.workers.dev/api/variants';

	let initial_response = await fetch(url);
	let data = await initial_response.json();

	let myHeaders = new Headers();
	myHeaders.append('Set-Cookie', COOKIE_NAME + '=' + (String)(index));

	const init = {
		method: 'GET',
		headers: myHeaders,
		credentials: 'same-origin'
	};

	let myRequest = await new Request(data['variants'][index]);
	let response = await fetch(myRequest);

	response = new HTMLRewriter().on('title', new ElementHandler()).transform(response);
	response = new HTMLRewriter().on('h1#title', new ElementHandler()).transform(response);
	response = new HTMLRewriter().on('p#description', new ElementHandler()).transform(response);
	response = new HTMLRewriter().on('a#url', new ElementHandler()).transform(response);

	let final_response = new Response(response.body, init);

	return final_response;
}

function getCookie(request, name) {
	let result = null;
	let cookieString = request.headers.get('Cookie');
	if (cookieString) {
		let cookies = cookieString.split(';');
		cookies.forEach(cookie => {
		let cookieName = cookie.split('=')[0].trim();
		if (cookieName === name) {
			let cookieVal = cookie.split('=')[1];
			result = cookieVal;
		}
		});
	}
	return result;
}

class ElementHandler {
	element(elem) {
		if (elem.tagName === 'title'){
			elem.setInnerContent('Customized Variant ' + (index + 1));
		} else if (elem.tagName === 'h1') {
			elem.setInnerContent('Utkarsh\'s Variant ' + (index + 1));
		} else if (elem.tagName === 'p') {
			elem.setAttribute('style', 'font-family:courier;');
		} else if (elem.tagName === 'a') {
			elem.setAttribute('style', 'background-color:blue;');
			elem.setAttribute('href', 'https://www.linkedin.com/in/ucmar17');
			elem.setInnerContent('Return to Utkarsh\'s LinkedIn');
		}
	}

	comments(comment) {
		// An incoming comment
	}

	text(t) {
		// An incoming piece of text
	}
}