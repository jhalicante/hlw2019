/*!
 * ABS-CBN Halalan Widget 2019
 * ABS-CBN Corporation 2019
 * @author John Mark Alicante
 */

var Halalan = (function() {
	
	'use strict';

	function init() {
		main.RSSFeed();
		main.senatorResults();
		main.getSwitch();
	}

	var main = {

		rssApiUrl : '//news.abs-cbn.com/rss/tag/halalan-2019',
		resultsApiUrl : '//blob-prod-senator.abs-cbn.com/widget/result-senator.json?timestamp='+new Date().getTime(),
		socketHostUrl : '//api-newsapp.abs-cbn.com',
		
		// // DEV
		// ocpKey : '2643d7fa4c764507811241b67d43dd34',
		// getSwitchApiUrl : '//dev-api.abs-cbn.com/switch/v1/getswitch',

		// PROD
		ocpKey :'d79a936b9fec4ec2b0759e595887a3d5',
		getSwitchApiUrl : '//oneottprodapi.azure-api.net/switch/v1/getswitch',

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

						var convertImg = image;
						image = convertImg.replace("http://", "https://");

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
					console.error("An error occurred while processing RSS Feed XML.");
				}
			}); 
		},

		senatorResults : function() {

			if( $('.senator-results').length > 0 ) {

				var socket = io(main.socketHostUrl,{'transports': ['websocket', 'polling']});

				$('.senator-results').html('');

				socket.on('results', function (data) {

					$('.senator-results').html('');

					// Get Month/Day/Year
					var check = moment(data.timestamputc8, 'YYYY/MM/DD HH:mm a'); 
					var month = check.format('MMMM');
					var day   = check.format('DD');
					var year  = check.format('YYYY');
					
					// Get Hour/Minutes/Meridiem
					var hm = new Date(data.timestamputc8);
					var chm = hm.getHours()+":"+hm.getMinutes();
					var partial_time = main.tConvert12Hr(chm)+' '+month+' '+day+', '+year;


					if(data.result.length > 0) {
							
							$('.partial-time').html(partial_time);		
							
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
												markup += '<h4>'+fname.trim().toLowerCase()+',</h4>';
												
												var concatedLname = lname.trim().split(' ');
												if(concatedLname[1] == undefined) {
													concatedLname[1] = '';
												}

												markup += '<span class="splitted">'+concatedLname[0].toLowerCase()+' '+concatedLname[1].toLowerCase()+'</span>';
												markup += '<span class="not-splitted">'+lname.trim().toLowerCase()+'</span>';
												markup += '<div class="location">';
													markup += '<span>('+partyName.toLowerCase()+')</span>';
												markup += '</div>';
											markup += '</div>';
											markup += '<div class="location">';
												markup += '<span>('+partyName.toLowerCase()+')</span>';
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

		comma : function(x) {
				var parts = x.toString().split(".");
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return parts.join(".");
		},

		getSwitch : function() {
			
			var widgetsRowKey;

			var parentUrl = (window.location != window.parent.location) ? document.referrer : document.location.href;

			// NEWS WIDGET HANDLING INITIATOR TO SHOW WIDGET
			if( parentUrl.includes('newsstaging.abs-cbnnews.com') || parentUrl.includes('news.abs-cbn.com') ) { 
				widgetsRowKey = [
					'newshalwidget1',
					'newshalwidget2',
					'newshalwidget3',
					'newshalwidget4'];
				for (var n = 0; n < widgetsRowKey.length; n++) {
					main.checkWidgetStatus(widgetsRowKey[n]);
				}
			}

			// ENTERTAINMENT WIDGET INITIATOR TO SHOW WIDGET
			if( parentUrl.includes('dev-entertainment.abs-cbn.com') || parentUrl.includes('ent.abs-cbn.com') ) { 
				widgetsRowKey = [
					'entertainmenthalwidget1', 
					'entertainmenthalwidget2', 
					'entertainmenthalwidget3', 
					'entertainmenthalwidget4'];
				for (var e = 0; e < widgetsRowKey.length; e++) {
					main.checkWidgetStatus(widgetsRowKey[e]);
				}
			}

			// LIFESTYLE WIDGET INITIATOR TO SHOW WIDGET
			if( parentUrl.includes('lifestyle-loadtest.abs-cbn.com') || parentUrl.includes('lifestyle.abs-cbn.com') ) { 
				widgetsRowKey = [
					'lifestlyehalwidget1',
					'lifestlyehalwidget2',
					'lifestlyehalwidget3',
					'lifestlyehalwidget4'];
				for (var lf = 0; lf < widgetsRowKey.length; lf++) {
					main.checkWidgetStatus(widgetsRowKey[lf]);
				}
			}

			// SPORTS WIDGET INITIATOR TO SHOW WIDGET
			if( parentUrl.includes('dev-sports.abs-cbn.com') || parentUrl.includes('sports.abs-cbn.com') ) { 
				widgetsRowKey = [
					'sportshalwidget1',
					'sportshalwidget2',
					'sportshalwidget3',
					'sportshalwidget4'];
				for (var s = 0; s < widgetsRowKey.length; s++) {
					main.checkWidgetStatus(widgetsRowKey[s]);
				}
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


						// NEWS WIDGET HANDLING
						if( parentUrl.includes('newsstaging.abs-cbnnews.com') || parentUrl.includes('news.abs-cbn.com') ) { 
							if( res.switch.RowKey == "newshalwidget1" && res.switch.Status == "ON" ) {
								$('.pre-halalan-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget2" && res.switch.Status == "ON" ) {
								$('.halalan-day-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget3" && res.switch.Status == "ON" ) {
								$('.halalan-day-b-widget-container').removeClass('hide');
							}
							if( res.switch.RowKey == "newshalwidget4" && res.switch.Status == "ON" ) {
								$('.halalan-results-widget-container').removeClass('hide');
							}
						}

						// ENTERTAINMENT WIDGET HANDLING
						if( parentUrl.includes('dev-entertainment.abs-cbn.com') || parentUrl.includes('ent.abs-cbn.com') ) { 

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
						if( parentUrl.includes('lifestyle-loadtest.abs-cbn.com') || parentUrl.includes('lifestyle.abs-cbn.com') ) { 
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
						if( parentUrl.includes('dev-sports.abs-cbn.com') || parentUrl.includes('sports.abs-cbn.com') ) { 
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

		tConvert12Hr : function(time) {
			// Check correct time format and split into components
			time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

			if (time.length > 1) { // If time format correct
				time = time.slice (1);  // Remove full string match value
				time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
				time[0] = +time[0] % 12 || 12; // Adjust hours
			}
			return time.join (''); // return adjusted time or original string
		}

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
