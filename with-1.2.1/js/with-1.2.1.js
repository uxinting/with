(function ( $ ) {
	var methods = {
		settings: {
			exampleSelector: '>example',
			boolSelector: '[data-with^="bool"]',
			key: /^\w/,
			reTernary: /^(\w+)\?\((.*)\)\((.*)\)$/
		},
		
		sys: {},
		
		map: {
			text: function ( arg ) {
				this.text( methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			val: function ( arg ) {
				this.val( methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			attr: function ( arg ) {
				var params = methods.dualParams( arg );
				
				this.attr( params.key, params.value );
				this.children().fill( methods.data );
			},
			
			list: function ( arg ) {
				//find example, if failed, return
				var example = this.find( methods.settings.exampleSelector );
				if (  example.length == 0 ) return;
				
				var items = methods.data[arg];
				for ( var item in items ) {
					//new instance of example and fill it
					var inst = $( example.html().trim() );
					inst.fill( items[item], {"loop": item} );
					
					this.append( inst );
				}
			},
			
			fill: function ( arg ) {
				this.children().fill( methods.unaryParam( arg ) );
			},
			
			bool: function ( arg ) {
				this.data( 'with', methods.ternaryParams( arg ) );
				this.fill( methods.data );
			},
			
			show: function ( arg ) {
				this.show();
			},
			
			hide: function ( arg ) {
				this.hide();
			},
			
			remove: function ( arg ) {
				this.remove();
			},
			
			href: function ( arg ) {
				this.attr( 'href', methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			src: function ( arg ) {
				this.attr( 'src', methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			}
		},
		
		fill: function ( that, data ) {
			//fill self
			methods.data = data;
			
			var params = $( that ).data( 'with' );
			
			if ( typeof params === 'undefined' ) {
				$( that ).children().fill( data );
				return $( that );
			} else {
				params = params.split( ';' );
			}
			
			for ( var item in params ) {
				var method = methods.getMethod( params[item] );
				var arg = methods.getArgument( params[item] );
				
				if ( method == '' ) break;
				methods.map[method].call( $( that ), arg );
			}
			
			return $(that);
		},
		
		getMethod: function ( param ) {
			return param.split( ':' )[0].trim();
		},
		
		getArgument: function ( param ) {
			return param.split( ':' ).slice( 1 ).join(':').trim();
		},
		
		unaryParam: function ( arg ) {
			if ( arg == '' ) return methods.data;
			var data = $.extend( methods.data, methods.sys );
			
			//handle key
			var key = arg.split('-');
			$.extend( data, methods.sys );

			for ( var item in key ) {
				if ( methods.settings.key.test( key[item] ) )
					key[item] = 'data.' + key[item];
			}
			
			return eval( 'try{' + key.join('+') + '}catch(e){""}' );
		},
		
		dualParams: function ( arg ) {
			var key = arg.split(',')[0].trim();
			var val = arg.split(',').slice(1).join('').trim();
			return { "key": key, "value": methods.unaryParam( val, methods.data ) };
		},
		
		ternaryParams: function ( arg ) {
			var rs = methods.settings.reTernary.exec( arg ).slice( 1 );
			
			var _if = methods.unaryParam( rs[0].trim() );
			if ( typeof _if === 'undefined' || !_if ) {
				return rs[2].trim();
			} else {
				return rs[1].trim();
			}
		}
	};
	
	$.fn.fill = function ( data, sys ) {
		$.extend( methods.sys, sys );
		return this.each( function() {
			return methods.fill( this, data );
		});
	};
	
})( jQuery );