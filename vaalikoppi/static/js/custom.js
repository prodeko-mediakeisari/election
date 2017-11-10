
// Kaikenlaisia funktioita äänestykseen
// Tarvii jQueryn




function vote(votingId) {
	
	var form = $('#voting-form-' + votingId);
	var selectedCandidateId = form.find('input[name=candidate]:checked').val();
	
	if (selectedCandidateId == null) {
		return;
	}
	
	var confirmation = confirm('Haluatko varmasti antaa äänesi?');
	
	if (!confirmation) {
		return;
	}
	
	form.find('input, button').prop('disabled', true);
	
	var query = $.post(votingId + '/vote/',
		{ candidate : selectedCandidateId }
	).done(function(data) {
	}).fail(function(data) {
		alert('Äänestäminen epäonnistui. Päivitä sivu ja yritä uudelleen!');
	});
	
	refreshVotingList();
	
}

function refreshVotingList() {
	
	var votingArea = $('#voting-list-area');
	
	var query = $.get('votings/', function(data) {
		votingArea.html(data);
	})
	.fail(function() {
		alert('Äänestysten haku ei onnistunut. Päivitä sivu. Jos koetit äänestää, katso, näkyykö äänestys jo äänestettynä.');
	});
	
}

function generateTokens(count) {
	
	$('#generate-tokens-button').prop('disabled', true);
	
	var query = $.post('generate/',
		{ count : count }
	).done(function(data) {
		alert('Koodien generointi onnistui.');
	}).fail(function(data) {
		alert('Koodien generointi epäonnistui.');
	});
	
	$('#generate-tokens-button').prop('disabled', false);	
}

function invalidateToken() {
	
	var token = $('#invalidate-token-field').val();
	
	if (token.length < 1) {
		return;
	}
	
	$('#invalidate-code-button').prop('disabled', true);
	
	var query = $.post('invalidate/',
		{ token : token }
	).done(function(data) {
		alert('Koodin invalidointi onnistui.');
	}).fail(function(data) {
		alert('Koodin invalidointi epäonnistui. Tarkista koodi.');
	});
	
	$('#invalidate-token-button').prop('disabled', false);
}

// Just for the UI. Everything is validated in the back-end...
function checkVoterStatus(callback) {
	
	var query = $.getJSON('user/status/')
	.done(function(data) {
		try {
			// No token/non-active token
			if (data.status === 0) {
				callback([ false, '' ]);
			} else if (data.status === 1) {
				if (data.activated === true && data.invalidated === false) {
					callback([ true, data.token ]);
				} else {
					callback([ false, data.token ]);
				}
			} else throw new Exception();
		} catch (err) {
			callback([ false, '' ]);
		} 
	})
	.fail(function() {
		alert('Tilan haku palvelimelta ei onnistunut. Koeta päivittää sivu.');
	});
}

function submitToken() {
	
	var token = $('#type-token-field').val();
	var warning = $('#main-login-prompt .wrong-token-warning');
	
	warning.addClass('invisible');
	
	var query = $.post('user/login/',
		{ token : token }
	).done(function(data) {
		toggleLoginPrompt();
		refreshVotingList();
	}).fail(function(data) {
		window.setTimeout(function() {
			warning.removeClass('invisible');
		}, 100);
	});
}

function toggleLoginPrompt() {
	$('#main-login-prompt').toggle();
	$('#voting-list-updater, #voting-list-area').fadeToggle();
}