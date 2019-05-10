/*!
 * ABS-CBN Halalan Widget Switch 2019
 * ABS-CBN Corporation 2019
 * @author John Mark Alicante
 */

var HalalanSwitchWidget = (function() {
	
	'use strict';

	function init() {
		if( $('#halalan-widget-2019-iframe').length > 0 ) {
			main.getSwitch();
		}
	}

	var main = {

		// DEV
		ocpKey : '2643d7fa4c764507811241b67d43dd34',
		getSwitchApiUrl : '//dev-api.abs-cbn.com/switch/v1/getswitch',

		// // PROD
		// ocpKey :'d79a936b9fec4ec2b0759e595887a3d5',
		// getSwitchApiUrl : '//oneottprodapi.azure-api.net',
 
		getSwitch : function() {
			
			var widgetsRowKey = ['entertainmentIframe', 'lifestyleIframe', 'newsIframe', 'sportsIframe'];

			// for (var i = 0; i < widgetsRowKey.length; i++) {

			var parentUrl = window.location.hostname;

			console.error(parentUrl);

			// NEWS WIDGET HANDLING
			if(parentUrl == 'newsstaging.abs-cbnnews.com')  {
				main.checkWidgetStatus('newsIframe');
			}

			// ENTERTAINMENT WIDGET HANDLING
			if(parentUrl == 'dev-entertainment.abs-cbn.com')  { 
				main.checkWidgetStatus('entertainmentIframe');
			}

			// LIFESTYLE WIDGET HANDLING
			if(parentUrl == 'lifestyle-loadtest.abs-cbn.com')  {
				main.checkWidgetStatus('lifestyleIframe');
			}
			
			// SPORTS WIDGET HANDLING
			if(parentUrl == 'dev-sports.abs-cbn.com')  {
				main.checkWidgetStatus('sportsIframe');
			}
			// }
		},

		checkWidgetStatus : function(RowKey) {
			console.log('Rowkey Called: ', RowKey);
			$.ajax({
				type : 'GET',
				crossDomain: true,
				url: main.getSwitchApiUrl+"/"+RowKey,
				beforeSend: function(xhrObj) {
					xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",main.ocpKey);
				},
				success : function(res) { 
					if( res.switch.Status == "OFF" ) {
						$('#halalan-widget-2019-iframe').remove();
					}
				}
			});
		},

    };

    return {
        init: init
    };
}());

jQuery(document).ready(function($) { HalalanSwitchWidget.init(); });
