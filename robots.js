javascript:(function() {
	var body = document.getElementsByTagName('body')[0];

	var jq = document.createElement('script');
	jq.src = 'https://code.jquery.com/jquery-1.7.min.js';
	body.appendChild(jq);

	function init() {
		if (typeof jQuery !== 'undefined') {
			var robots = document.createElement('div');
			robots.id = '_robots_txt';
			robots.style.display = 'none';
			body.appendChild(robots);
			$('#_robots_txt').load('https://' + window.location.hostname + '/robots.txt', function (response, status, xhr) {
				var msg = '';
				if (status === 'error') {
					msg = 'Sorry, there was an error retrieving the robots.txt file: ' + xhr.status + ' (' + xhr.statusText + ')';
					alert(msg);
				}
				else {
					var robotsTxt = $('#_robots_txt').html(),
					msg = '',
					blockedTxt = 'This page is blocked for at least one robot.',
					allBlocked = /^User-agent: (\*|[a-zA-Z0-9]*)$\n^Disallow: \/$/gim,
					pathMatch = window.location.pathname.match(/^(.+[\/]?)[^\/]+$/),
					pageBlocked = new RegExp('^Disallow: ' + window.location.pathname + '$', 'gim'),
					match = false;

					if (robotsTxt.match(allBlocked) || robotsTxt.match(pageBlocked)) {
						msg = blockedTxt;
					}
					else if (pathMatch !== null && robotsTxt.match(new RegExp('Disallow: ' + pathMatch[1] + '$', 'gim'))){
						msg = blockedTxt;
					}
					else {
						if (pathMatch) {
							var matches = robotsTxt.match(/^Disallow: (.*)$/gim),
								matchStr = '';
							if (matches) {
								for (var i=0; i<matches.length; i++) {
									matchStr = matches[i].substr(10);
									var matchRegExp = new RegExp(matchStr.replace(/\*/gim, '.*'));
									if (pathMatch[1].indexOf(matchStr) !== -1 || pathMatch[1].match(matchRegExp)) {
										match = true;
										break;
									}
								}
							}
						}
						if (match) {
							msg = blockedTxt;
						}
						else {
							msg = 'This page is not blocked.';
						}
					}
					confirm(msg + '\r\n\r\nWould you like to see the robots.txt file?') ? alert(robotsTxt) : '';
				}
			});
		}
		else {
			setTimeout(init, 50);
		}
	};

	init();
})();
