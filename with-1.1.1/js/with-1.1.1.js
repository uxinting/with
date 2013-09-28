$('example').hide();
(function ( $ ) {
	var methods = {
		settings: {
			selector: '[data-with]:not(example [data-with])',
			exampleSelector: '>example',
			inst: '<inst></inst>',
			key: /^\w/
		},
		
		sys: {},
		
		map: {
			text: $.fn.text,
			val: $.fn.val,
			bool: function ( data ) {
				if ( !data ) this.remove();
				
			},
			show: function ( data ) {
				if ( data ) this.show();
			},
			hide: function ( data ) {
				if ( data ) this.hide();
				
			},
			href: function ( data ) {
				this.attr( 'href', data );
			},
			list: function ( data ) {
				//find example, if failed, return
				var example = this.find( methods.settings.exampleSelector );
				if (  example.length == 0 ) return;
								
				for ( var item in data ) {
					//new instance of example and fill it
					var inst = $( methods.settings.inst ).append( $( example.html().trim() ) );
					inst.fill( data[item], {"loop": item} );
					
					this.append( $( inst.html().trim() ) );
				}
			}
		},
		
		fill: function ( that, data ) {
			//not empty or null || JSON.stringify( data ) == '{}'
			if ( typeof data == 'undefined' ) return that;
			
			methods.el = that;
			
			$( that ).find( methods.settings.selector ).each( function() {
				methods.fillself( this, data);
			} );
			
			return $(that);
		},
		
		fillself: function ( that, data ) {
			var params = $( that ).data( 'with' ).split( ';' );
			
			for ( var item in params ) {
				var method = methods.getMethod( params[item] );
				var arg = methods.getArgument( params[item], data );
				
				methods.map[method].call( $( that ), arg );
			}
		},
		
		getMethod: function ( param ) {
			return param.split( ':' )[0].trim();
		},
		
		getArgument: function ( param, data ) {
			var keys = param.split( ':' ).slice( 1 );
			
			//arguments name, data is argument
			if ( keys.length == 0 ) return data;
			
			//handle key
			var key = keys[0].trim().split('-');
			$.extend( data, methods.sys );

			for ( var item in key ) {
				if ( methods.settings.key.test( key[item] ) )
					key[item] = 'data.' + key[item];
			}
			
			return eval( 'try{' + key.join('+') + '}catch(e){""}' );
		}
	};
	
	$.fn.fill = function ( data, sys ) {
		$.extend( methods.sys, sys );
		return this.each( function() {
			return methods.fill( this, data );
		});
	};
	
})( jQuery );