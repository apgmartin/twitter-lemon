var Twitter = require('twitter');

exports.createClient = function(consumerKey, consumerSecret, accessTokenKey, accessTokenSecret) {
	return new Twitter({
		consumer_key: consumerKey,
  	consumer_secret: consumerSecret,
  	access_token_key: accessTokenKey,
  	access_token_secret: accessTokenSecret
	})
}

exports.streamTweets = function(client, searchString, callback) {
	var stream = client.stream('statuses/filter', {track: searchString});
	stream.on('data', function(event) {
		console.log(event.text);
		callback();
	});

	stream.on('error', function(error) {
	  throw error;
	});
}

exports.getTweets = function(client, searchString, sinceId, callback) {
	let params = {
		q: searchString,
		count: 5
	}

	if (sinceId) {
		params.since_id = sinceId;
	}

	client.get('search/tweets', params).then((tweets) => {
		console.log('Number of tweets: ' + tweets.statuses.length);

		if (tweets.statuses[0]) {
			for (let tweet of tweets.statuses) {
				console.log('Got your tweet: ' + tweet.user.name);
			}
			// console.log(tweets.statuses[0]);
			callback(tweets.statuses[0].id_str, tweets.statuses.length)
		} else {
			console.log('No new tweets');
		}

	}).catch((error) => {
		console.log(error);
	});
}
