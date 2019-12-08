//Compact view structure
class Message {
	constructor(a, m) {
		this.author = a;
		this.message = m;
	}
	static HTMLToMessage(element) {
		if (!element.children[0]) {
			console.error(element);
			badElements.push(element);
			return;
		}
		if (!element.children[0].children[1]) {
			console.error(element);
			badElements.push(element);
			return;
		}
		if (!element.children[0].children[1].children[0]) {
			console.error(element);
			badElements.push(element);
			return;
		}

		if (!element.innerText) {
			console.error(element);
			badElements.push(element);
			return;
		}
		return new Message(element.children[0].children[1].children[0].innerText, element.innerText);
	}
}

var scrl = document.getElementsByClassName(
	'scroller-2FKFPG firefoxFixScrollFlex-cnI2ix systemPad-3UxEGl messages-3amgkR privateChannelMessages-3f72E-'
)[0];
var arr = Array.from(document.getElementsByClassName('markup-2BOw-j isCompact-1hsne1')); //This class name can change. It was "body" and now it's "markup-2BOw-j isCompact-1hsne1"

var continueDeleting = true;
var targetMessage = {};
var scrollUpRepeat = 0;
var author = 'YourName';

function markMessageAuthors() {
	var arr = Array.from(document.getElementsByClassName('markup-2BOw-j isCompact-1hsne1'));
	var myMessages = arr.reverse().forEach(x => {
		if (x.hasBeenRead) return;
		var message = Message.HTMLToMessage(x);
		if (!message) {
			continueDeleting = false;
			console.error('Unable to make message');
		}
		x.messageAuthor = message.author;
		x.hasBeenRead = true;
	});
}

function clickDelete() {
	var deleteButton = Array.from(document.getElementsByClassName('label-JWQiNe')).find(x => x.innerText === 'Delete');
	if (!deleteButton) {
		targetMessage.parentElement.children[0].children[0].children[1].click();
		window.setTimeout(clickDelete(), 20);
		return;
	}

	deleteButton.click();
	window.setTimeout(confirmDelete, 20);
	// console.log('Deleting message');
}

function confirmDelete() {
	var deleteButton = Array.from(
		document.getElementsByClassName('button-38aScr lookFilled-1Gx00P colorRed-1TFJan sizeMedium-1AC_Sl grow-q77ONN')
	)[0];
	if (deleteButton) deleteButton.click();
}

function deleteMessage() {
	if (!continueDeleting) return;
	if (scrollUpRepeat > 100) {
		console.log('Must be done! :D');
		return;
	}

	markMessageAuthors();
	var message = Array.from(document.getElementsByClassName('markup-2BOw-j isCompact-1hsne1'))
		.reverse()
		.find(x => x.messageAuthor === author);

	if (!message) {
		// console.log('No messages found, scrolling up...');
		scrl.scrollTop = 0;
		scrollUpRepeat++;

		var loadMoreButton = document.getElementsByClassName('hasMore-3e72_v')[0];
		if (loadMoreButton) loadMoreButton.click();
	} else {
		scrollUpRepeat = 0;
		targetMessage = message;
		targetMessage.parentElement.children[0].children[0].children[1].click();
		window.setTimeout(clickDelete(), 20);
	}

	window.setTimeout(function() {
		deleteMessage();
	}, 250);
}
deleteMessage();
