import Scenarist from '@shfaddy/scenarist';
import { Interface, createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { parse, join } from 'node:path';

export default class ScenaristAsAShell extends Scenarist {

constructor ( ... argv ) {

super ( ... argv );

this .interface = this .senior ?.interface instanceof Interface ? this .senior .interface : createInterface ( { input, output } );

};

interrupt () {

this .interface [ Symbol .for ( 'interrupt' ) ] = new Promise ( check => {

this .interface [ Symbol .for ( 'interrupt/check' ) ] = check;

} ) .then ( () => this .interrupt () );

this .interface .once ( 'SIGINT', () => {

this .interface [ Symbol .for ( 'interrupt/check' ) ] ();

return this .play ( Symbol .for ( 'interrupt' ) );

} );

};

async publish () {

await this .ready;

this .play ( Symbol .for ( 'prompt' ), ... process .argv .slice ( 2 ) );

return this .play;

};

async [ '$--open' ] ( { play: $ }, path, direction ) {

if ( path === undefined )
throw "Where is the Scenario you want to open is located?";

const { name, ext: extension } = parse ( path );

if ( path [ 0 ] !== '/' && extension .endsWith ( 'js' ) )
path = join ( process .cwd (), path );

const { default: scenario } = await import ( path );
const location = this .constructor .location ( direction || name );

this .scenario [ location ] = scenario;

return true;

};

async $_prompt ( { play: $ }, ... argv ) {

let line = this .interface .question ( ( await $ ( Symbol .for ( 'location' ) ) ) .join ( '/' ) + ': ' )
.catch ( error => false );

if ( argv .length )
this .interface .write ( argv .join ( ' ' ) + '\n' );

if ( ( line = await line ) === false )
return;

return $ ( Symbol .for ( 'process' ), ... line .trim () .length ? line .split ( /\s+/ ) : [] );

};

async $_process ( story, ... argv ) {

const { play: $ } = story;

if ( ! argv .length )
return $ ( Symbol .for ( 'prompt' ) );

let response;

this .interface [ Symbol .for ( 'processing' ) ] = true;

try {

await this .interrupt ();

await $ (

'--output',
response = await $ ( Object .assign ( story, {

interrupt: this .interface [ Symbol .for ( 'interrupt' ) ]

} ), ... argv )

);

} catch ( error ) {

console .error ( error );

}

this .interface [ Symbol .for ( 'processing' ) ] = false;

return ( typeof response === 'function' ? response : $ ) ( Symbol .for ( 'prompt' ) );

};

[ '$--output' ] ( { play: $ }, ... argv ) {

if ( ! argv .length )
return;

let response = argv .shift ();

switch ( typeof response ) {

case 'object':

if ( typeof response [ Symbol .iterator ] !== 'function' )
response = Object .entries ( response );

return $ ( '--output', ... [ ... response ] .map (

output => output instanceof Array ? output .join ( ': ' ) : output

) );

case 'string':
case 'number':

console .log ( response );

break;

case 'boolean':

console .log ( response ? 'Okay!' : 'Bad!' );

break;

}

return $ ( '--output', ... argv );

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
return $ ( Symbol .for ( 'prompt' ), '--exit' );

};

$_end () {

this .interface .close ();

return "Okay! Bye bye!";

};

};
