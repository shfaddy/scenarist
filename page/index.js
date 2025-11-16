import Scenarist from '@shfaddy/scenarist';

export default class ScenaristAsAPage extends Scenarist {

constructor ( ... argv ) {

super ( ... argv );

this .model = ( this .senior ?.model instanceof HTMLElement ? this .senior .model : document .body .appendChild ( document .createElement ( 'main' ) ) )
.appendChild ( document .createElement ( 'article' ) );

};

async publish () {

const { play: $ } = this;
const prefix = await $ ( '--prefix' );
const location = await $ ( '--location' );

Object .assign ( this .model, {

id: location .join ( '-' ),
innerHTML: `

<h2>${ location .map (

=>

) .join ( ' / ' )</h2>

` .trim ()

} );

return super .publish ();

};

async $_prompt ( story, ... argv ) {

const { play: $ } = story;
.catch ( error => false );

if ( argv .length )
this .interface .write ( argv .join ( ' ' ) + '\n' );

if ( ( line = await line ) === false )
return;

return $ ( story, Symbol .for ( 'process' ), ... ( line = line .trim () ) .length ? line .split ( /\s+/ ) : [] );

};

async $_process ( story, ... argv ) {

const { play: $ } = story;
let response;

this .interface [ Symbol .for ( 'processing' ) ] = true;

try {

await $ ( Symbol .for ( 'output' ), {

line: argv .join ( ' ' ),
response: ( response = await $ ( Object .assign ( story, {

interrupt: this .interface [ Symbol .for ( 'interrupt' ) ]

} ), ... argv ) )

} );

} catch ( error ) {

console .error ( [ ... await $ ( '--prefix' ), ... await $ ( '--location' ) ] .join ( ' ' ) + ':', error );

this .interface [ Symbol .for ( 'processing' ) ] = false;

if ( story .return === true )
return Symbol .for ( 'error' );

}

this .interface [ Symbol .for ( 'processing' ) ] = false;

return story .return !== true ? ( typeof response === 'function' ? response : $ ) ( Symbol .for ( 'prompt' ) ) : response;

};

[ '$--output' ] ( { play: $ }, ... argv ) {

return $ ( Symbol .for ( 'output' ), { response: argv .join ( ' ' ) } );

};

$_output ( { play: $ }, ... argv ) {

if ( ! argv .length )
return;

const { line, response } = argv .shift ();

if ( response ?.[ Symbol .for ( 'record' ) ] === true ) {

$ ( '--read', 'enter', line );

response = response [ Symbol .for ( 'response' ) ];

}

switch ( typeof response ) {

case 'object':

if ( typeof response [ Symbol .iterator ] !== 'function' )
response = Object .entries ( response );

return $ ( Symbol .for ( 'output' ), ... [ ... response ] .map (

output => ( { line, response: output instanceof Array ? output .join ( ': ' ) : output } )

), ... argv );

case 'string':
case 'number':

console .log ( response );

break;

case 'boolean':

console .log ( response ? 'Okay!' : 'Bad!' );

break;

}

return $ ( Symbol .for ( 'output' ), ... argv );

};

get [ '$--exit' ] () { return this .$_end };

$_interrupt ( { ticket, play: $ } ) {

if ( this .interface [ Symbol .for ( 'processing' ) ] )
return;

if ( this .interface ?.line ?.length ) {

this .interface .line = '';
this .interface .prompt ();

}

else
return this .scenario .priority === true ? this .interface .prompt () : $ ( Symbol .for ( 'prompt' ), '--exit' );

};

async $_end ( { play: $ } ) {

this .interface .close ();

await $ ( Symbol .for ( 'exit' ) ) .catch ( () => {} );

return "Okay! Bye bye!";

};

};
