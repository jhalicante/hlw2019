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
		rssApiUrl : '//news.abs-cbn.com/rss/tag/halalan-2019',
		resultsApiUrl : '//blob-prod-senator.abs-cbn.com/widget/result-senator.json?timestamp='+new Date().getTime(),
		ocpKey : '2643d7fa4c764507811241b67d43dd34',
		getSwitchApiUrl : '//dev-api.abs-cbn.com/switch/v1/getswitch',

		socketHostUrl : '//api-newsapp.abs-cbn.com',
 
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
						if($('.uninav-news').length>0)  {
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
						if($('.uninav-sports').length>0)  {
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
