/*!
 * ABS-CBN Halalan Widget 2019
 * ABS-CBN Corporation 2019
 * @author John Mark Alicante
 */

var Halalan = (function() {
	
	'use strict';

	function init() {
		if( $('#halalan-widget-2019-iframe').length > 0 ) {
			main.RSSFeed();
			main.animatePreloader();
			main.senatorResults();
			main.getSwitch();
		}
	}

	var main = {

		// rssApiUrl : 'http://localhost:2019/dist/rss-feed.xml',//'//halalan-widget.abs-cbnnews.com/iframe/src/scripts/rss-feed.json?timestamp='+new Date().getTime(), 
		rssApiUrl : '//news.abs-cbn.com/rss/tag/halalan-2019',
		resultsApiUrl : '//blob-prod-senator.abs-cbn.com/widget/result-senator.json?timestamp='+new Date().getTime(),
		ocpKey : '2643d7fa4c764507811241b67d43dd34',
		getSwitchApiUrl : '//dev-api.abs-cbn.com/switch/v1/getswitch',

		socketHostUrl : '//api-newsapp.abs-cbn.com',

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
								markup += '<a href="'+link+'" target="_blank" id="thumb-'+index+'"><div class="img-holder" style="background: #ccc url('+decodeURIComponent(image)+') no-repeat;background-size: cover;">';
									markup += '<img src="'+image+'" alt="">';
								markup += '</div></a>';
								markup += '<div class="content">';
									markup += '<a href="'+link+'" target="_blank" id="link-'+index+'">';
										markup += '<p class="text-content">';
											markup += title;
										markup += '</p>';
										markup += ' <b class="timestamp">'+moment(pubDate).startOf('hour').fromNow()+'</b>';
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
		},

		senatorResults : function() {

			if( $('.senator-results').length > 0 ) {

				var socket = io(main.socketHostUrl,{'transports': ['websocket', 'polling']});

				socket.on('results', function (data) {
					console.log(data);

					$('.senator-results').html('');

					if(data.result.length > 0) {

							
							var results = data.result,
								index = 0;

							$('.percent-results').html(data.er.percentage);

							for (var i = 0; i < results.length; i++) {

								index++;

								if(i == 12) break;

								var 
									fname,
									lname,
									candidateName,
									voteCount,	
									partyName,
									res;
								
								res = results[i];

								// Check if candidateName is null or undefined
								if(res.candidateName != null || res.candidateName != undefined) {
									
									candidateName = results[i].candidateName.split(',');
									
									fname = candidateName[0];
									lname = candidateName[1];
								} else { 
									fname = ''; 
									lname = '';
								}

								// Check if voteCount is null or undefined
								if(results[i].voteCount != null || results[i].voteCount != undefined) {
									voteCount = results[i].voteCount;
								} else { voteCount = 0; }

								// Check if partyName is null or undefined
								if(results[i].partyName != null || results[i].partyName != undefined) {
									partyName = results[i].partyName;
								} else { partyName = ''; }

								var markup = '<li>';
										markup += '<div class="list-content">';
											markup += '<div class="count">';
												markup += '<h5>#'+index+'</h5>';
											markup += '</div>';
											markup += '<div class="name">';
												markup += '<div class="count">';
													markup += '<h5>#'+index+'</h5>';
												markup += '</div>';
												markup += '<h4>'+fname.trim()+',</h4>';
												
												var concatedLname = lname.trim().split(' ');
												if(concatedLname[1] == undefined) {
													concatedLname[1] = '';
												}

												markup += '<span class="splitted">'+concatedLname[0]+' '+concatedLname[1]+'</span>';
												markup += '<span class="not-splitted">'+lname.trim()+'</span>';
												markup += '<div class="location">';
													markup += '<span>('+partyName+')</span>';
												markup += '</div>';
											markup += '</div>';
											markup += '<div class="location">';
												markup += '<span>('+partyName+')</span>';
											markup += '</div>';
											markup += '<div class="votes">';
												markup += '<span>'+main.comma(voteCount)+'</span>';
											markup += '</div>';
										markup += '</div>';
									markup += '</li>';
									$('.senator-results').append(markup);
									
							}
					}
				});
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
			
			var widgetsRowKey = [
					'newshalwidget1',
					'newshalwidget2',
					'newshalwidget3',
					'newshalwidget4', 

					'entertainmenthalwidget1', 
					'entertainmenthalwidget2', 
					'entertainmenthalwidget3', 
					'entertainmenthalwidget4',
					
					'lifestlyehalwidget1',
					'lifestlyehalwidget2',
					'lifestlyehalwidget3',
					'lifestlyehalwidget4',

					'sportshalwidget1',
					'sportshalwidget2',
					'sportshalwidget3',
					'sportshalwidget4'];

			for (var i = 0; i < widgetsRowKey.length; i++) {
				main.checkWidgetStatus(widgetsRowKey[i]);
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
						
						var a = moment(new Date(),'M/D/YYYY');
						var b = moment(new Date()+1,'M/D/YYYY');
						
						
						var diffDays = b.diff(a, 'hours');

						var parentUrl = (window.location != window.parent.location) ? document.referrer : document.location.href;
						
						parentUrl = 'http://dev-entertainment.abs-cbn.com/';

						console.log('Site ', parentUrl);

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

						console.log('Res:: ',res.switch.RowKey+' II '+res.switch.Status == "ON");

						// NEWS WIDGET HANDLING
						if(
							parentUrl == 'https://newsstaging.abs-cbnnews.com/' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/news' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/business' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/entertainment' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/life' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/sports' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/spotlight' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/trending' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/classified-odd' ||
							parentUrl == 'https://newsstaging.abs-cbnnews.com/opinions'
						)  {
							if( res.switch.RowKey == "newshalwidget1" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget2" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget3" && res.switch.Status == "ON" ) {
								$('.halalan-day-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget4" && res.switch.Status == "ON" ) {
								$('.halalan-day-b-widget-container').removeClass('hide');
							}
						}

						// ENTERTAINMENT WIDGET HANDLING
						if(parentUrl == 'http://dev-entertainment.abs-cbn.com/')  {
							if( res.switch.RowKey == "entertainmenthalwidget1" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "entertainmenthalwidget2" && res.switch.Status == "ON" ) {
								$('.halalan-day-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "entertainmenthalwidget3" && res.switch.Status == "ON" ) {
								$('.halalan-day-b-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "entertainmenthalwidget4" && res.switch.Status == "ON" ) {
								$('.halalan-results-widget-container').removeClass('hide');
							}
						}

						// LIFESTYLE WIDGET HANDLING
						if(parentUrl == 'https://lifestyle-loadtest.abs-cbn.com/')  {
							if( res.switch.RowKey == "lifestlyehalwidget1" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "lifestlyehalwidget2" && res.switch.Status == "ON" ) {
								$('.halalan-day-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "lifestlyehalwidget3" && res.switch.Status == "ON" ) {
								$('.halalan-day-b-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "lifestlyehalwidget4" && res.switch.Status == "ON" ) {
								$('.halalan-results-widget-container').removeClass('hide');
							}
						}

						// SPORTS WIDGET HANDLING
						if(parentUrl == 'https://dev-sports.abs-cbn.com/')  {
							if( res.switch.RowKey == "sportshalwidget1" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "sportshalwidget2" && res.switch.Status == "ON" ) {
								$('.halalan-day-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "sportshalwidget3" && res.switch.Status == "ON" ) {
								$('.halalan-day-b-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "sportshalwidget4" && res.switch.Status == "ON" ) {
								$('.halalan-results-widget-container').removeClass('hide');
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
