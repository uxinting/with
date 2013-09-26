(function ( $ ) {
	var methods = {
		map: {
			text: $.fn.text,
			val: $.fn.val,
			contain: function ( data ) {
				var example = $(this).find('example');
				if ( !example.length )
					return;
				
				for ( var item in data ) {
					example.find('[data-with]:not(.example)').each( function() {
						$(this).fill( data[item] );
					});
					$(this).append( $( example.html().trim() ) );
				}
			}
		},
		
		fill: function ( that, data ) {
			methods.el = that;
			var params = $(that).data('with').split(';');
			for ( var index in params ) {
				var param = params[index].split(':');
				var arg = data;
				
				if ( typeof param[1] !== 'undefined')
					arg = data[param[1].trim()];
				methods.map[param[0].trim()].call( $(that), arg );
			}
			
			return $(that);
		}
	};
	
	$.fn.fill = function ( data ) {
		return this.each( function() {
			return methods.fill( this, data );
		});
	};
	
})( jQuery );

function fillDocument ( rs ) {
	$('example').hide();
	if ( JSON.stringify( rs ) == '{}')
		return;
		
	$('[data-with]:not(.example)').each( function() {
		$(this).fill( rs.data );
	});
}