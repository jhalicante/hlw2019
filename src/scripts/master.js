/*!
 * ABS-CBN Halalan Widget 2019
 * ABS-CBN Corporation 2019
 * @author John Mark Alicante
 */

var Halalan = (function() {
	
	'use strict';

	function init() {
		main.RSSFeed();
		main.animatePreloader();
		main.senatorResults();
		main.getSwitch();
	}

	var main = {

		// rssApiUrl : 'http://localhost:2019/dist/rss-feed.xml',//'//halalan-widget.abs-cbnnews.com/iframe/src/scripts/rss-feed.json?timestamp='+new Date().getTime(), 
		rssApiUrl : 'https://news.abs-cbn.com/rss/tag/halalan-2019',
		resultsApiUrl : 'https://blob-prod-senator.abs-cbn.com/widget/result-senator.json?timestamp='+new Date().getTime(),
		ocpKey : '2643d7fa4c764507811241b67d43dd34',
		getSwitchApiUrl : 'https://dev-api.abs-cbn.com/switch/v1/getswitch',

		socketHostUrl : 'http://api-newsapp.abs-cbn.com',

		RSSFeed : function() {
			var jsonText;
			$.ajax({
				type: "GET",
				url: main.rssApiUrl,
				dataType: "xml",
				success: function(xml){

					// $('.rss-feed-content').html('');

					$(xml).find('item').each(function(index){

						var title = $(this).find('title').text();
						var image = $(this).find('image').text();
						var link = $(this).find('link').text();
						var pubDate = $(this).find('pubDate').text();

						if(index == 6) { return false; }

						var markup = '<div class="teaser">';
								markup += '<div class="img-holder" style="background: #ccc url('+decodeURIComponent(image)+') no-repeat;background-size: cover;">';
									markup += '<img src="'+image+'" alt="">';
								markup += '</div>';
								markup += '<div class="content">';
									markup += '<a href="'+link+'" target="_blank">';
										markup += '<p class="text-content">';
											markup += title;
											markup += ' <b class="timestamp" href="">'+moment(pubDate).startOf('hour').fromNow()+'</b>';
										markup += '</p>';
									markup += '</a>';
								markup += '</div>';
							markup += '</div>';
							
						$('.rss-feed-content').append(markup);

					});
				},
				error: function() {
					console.error("An error occurred while processing XML file.");
				}
			});
			// $.ajax({
			// 	url: main.rssApiUrl,
			// 	async: false,
			// 	dataType: 'json',
			// 	error: function(jqXHR, textStatus, errorThrown){
			// 	  // Handle the error event
			// 	  console.log(textStatus + "; " + errorThrown);
			// 	},
			// 	success: function (res) {

			// 		console.log(res);
			// 		jsonText = main.xmlToJson( res );
					
			// 		var item = jsonText.rss.channel.item;

			// 		console.log(item);

			// 		for (var j = 0; j < item.length; j++) {

			// 			if(j === 6) 
			// 				break;
						
			// 			var _res = item[j];
						
			// 			var markup = '<div class="teaser">';
			// 					markup += '<div class="img-holder" style="background: #ccc url('+decodeURIComponent(_res.image['#text'])+') no-repeat;background-size: cover;">';
			// 						markup += '<img src="'+_res.image['#text']+'" alt="">';
			// 					markup += '</div>';
			// 					markup += '<div class="content">';
			// 						markup += '<a href="'+_res.link['#text']+'" target="_blank">';
			// 							markup += '<p class="text-content">';
			// 								markup += _res.title.__cdata;
			// 								markup += ' <b class="timestamp" href="">'+moment(_res.pubDate).startOf('hour').fromNow()+'</b>';
			// 							markup += '</p>';
			// 						markup += '</a>';
			// 					markup += '</div>';
			// 				markup += '</div>';
							
			// 			$('.rss-feed-content').append(markup);
						
			// 		}
			// 	}
			// });
		},

		senatorResults : function() {

			if( $('.senator-results').length > 0 ) {

				var socket = io(main.socketHostUrl);

				socket.on('results', function (data) {
					console.log(data);
				});

				// $.ajax({
				// 	type : 'GET',
				// 	crossDomain: true,
				// 	url : main.resultsApiUrl,
				// 	success : function(res) {

				// 		console.log('senatorResults ',res.result);
						
				// 		if(res.result.length > 0 ) {
							
				// 			var results = res.result,
				// 					index = 0;

				// 			for (var i = 0; i < results.length; i++) {

				// 				index++;

				// 				if(i == 12) break;

				// 				var candidateName,
				// 						voteCount,
				// 						partyName;

				// 				// Check if candidateName is null or undefined
				// 				if(results[i].candidateName != null || results[i].candidateName != undefined) {
				// 					candidateName = results[i].candidateName;
				// 				} else { candidateName = ''; }

				// 				// Check if voteCount is null or undefined
				// 				if(results[i].voteCount != null || results[i].voteCount != undefined) {
				// 					voteCount = results[i].voteCount;
				// 				} else { voteCount = 0; }

				// 				// Check if partyName is null or undefined
				// 				if(results[i].partyName != null || results[i].partyName != undefined) {
				// 					partyName = results[i].partyName;
				// 				} else { partyName = 'NPC'; }

								
				// 				var markup = '<li>';
				// 						markup += '<div class="list-content">';
				// 							markup += '<div class="count">';
				// 								markup += '<h5>#'+index+'</h5>';
				// 							markup += '</div>';
				// 							markup += '<div class="name">';
				// 								markup += '<h4>GATCHALIAN,</h4>';
				// 								markup += '<span>Vicente</span>';
				// 							markup += '</div>';
				// 							markup += '<div class="location">';
				// 								markup += '<span>('+partyName+')</span>';
				// 							markup += '</div>';
				// 							markup += '<div class="votes">';
				// 								markup += '<span>'+main.comma(voteCount)+'</span>';
				// 							markup += '</div>';
				// 						markup += '</div>';
				// 					markup += '</li>';
				// 					$('.senator-results').append(markup);
									
				// 			}
				// 		}
				// 	}
				// });
			}					
		},

		animatePreloader : function() {
			var title = 'HALALAN',
					date =  '2019', //new Date().getFullYear(),
					i = 0;

			$('.title-content').html('');
			$('.year-content').html('');

				// Title 
				setTimeout(function() {
					var titleTimer = setInterval( function() {
						var markup = '<span class="text-title animated zoomInLeft">'+title[i]+'</span>';
						$('.title-content').append(markup);
						
						i++;

						if(title.length == i ) {
							clearInterval(titleTimer);
						}

					}, 100);
				}, 100);


				// Hide Halalan Title after 3secs
				setTimeout(function() {
					$('.text-title').fadeOut();
				}, 3000);

				// Year
				setTimeout(function() {
					
					// $('.year').html('<h3 class="text-year animated zoomInUp">'+date.getFullYear()+'</h3>');							

					i = 0;

					var yearTimer = setInterval( function() {
						
						var markup = '<span class="text-year animated zoomInRight">'+date[i]+'</span>';
						$('.year-content').append(markup);
						
						i++;

						if(date.length == i ) {
							clearInterval(yearTimer);
						}

					}, 100);
					
				}, 3100);

				// Hide Halalan Year after 4secs
				setTimeout(function() {
					// $('.text-title').fadeIn();
					$('.text-year').fadeOut();

					main.animatePreloader();
				}, 5500);

				
		},

		comma : function(x) {
				var parts = x.toString().split(".");
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return parts.join(".");
		},

		getSwitch : function() {

			var widgets = ['halwidget1'];

			for (var i = 0; i < widgets.length; i++) {
				main.checkWidgetStatus(widgets[i]);
			}
		},

		checkWidgetStatus : function(RowKey) {
			$.ajax({
				type : 'GET',
				crossDomain: true,
				url: main.getSwitchApiUrl+"/"+RowKey,
				beforeSend: function(xhrObj) {
					xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",main.ocpKey);
				},
				success : function(res) { 
					if(res.switch != undefined ) {
						if( res.switch.RowKey == "halwidget1" ) {
							$('.pre-halalan-widget-container').removeClass('hide');


							var a = moment(new Date(),'M/D/YYYY');
							var b = moment(new Date()+1,'M/D/YYYY');
							
							
							var diffDays = b.diff(a, 'hours');


							$('.pre-halalan-days-number').text(res.timetobreakTransformed.days);
							$('.pre-halalan-hours-number').text(res.timetobreakTransformed.hours);
							$('.pre-halalan-mins-number').text(res.timetobreakTransformed.minutes);

							$('.halalan-day-hours-number').text(res.timetobreakTransformed.hours);
							$('.halalan-day-mins-number').text(res.timetobreakTransformed.minutes);

							if(res.timetobreakTransformed.days <= 1) {
								$('.pre-halalan-days-text').text('DAY');
							}

							if(res.timetobreakTransformed.hours <= 1) {
								$('.pre-halalan-hours-text').text('HOUR');
							}
						}
					}
				}
			});
		},

    };

    return {
        init: init
    };
}());

jQuery(document).ready(function($) { Halalan.init(); });

$(window).on('load', function() {
	setTimeout( function() {
		// $('.iframe-preloader').remove();
	}, 10000);
});

// GET DATE TIME DIF

// M:D:Y
// var a = moment(new Date(),'M/D/YYYY');
// var b = moment(new Date()+1,'M/D/YYYY');
// var diffDays = b.diff(a, 'hours');
// alert(diffDays);