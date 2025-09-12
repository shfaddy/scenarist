import Scenarist from '@shfaddy/scenarist';
import Scenario from './scenario.js';
import { Interface, createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { parse, join } from 'node:path';
import { readdir as list } from 'node:fs/promises';

export default class ScenaristAsAShell extends Scenarist {

constructor ( ... argv ) {

super ( ... argv );

if ( this .senior ?.interface instanceof Interface )
this .interface = this .senior .interface;

else {

this .interface = createInterface ( { input, output } );

this .interrupt ();

}

if ( ! ( this .scenario instanceof Scenario ) ) {

this [ '$--read' ] = new Scenario ( { player: this .play } );

this .ready .push ( this .play ( '--read' ) );

}

};

interrupt () {

this .interface [ Symbol .for ( 'interrupt' ) ] = new Promise ( check => {

this .interface [ Symbol .for ( 'interrupt/check' ) ] = check;

} );

this .interface [ Symbol .for ( 'interrupt' ) ] .then ( () => this .interface [ Symbol .for ( 'scenarist' ) ] .interrupt () );

this .interface .once ( 'SIGINT', () => {

this .interface [ Symbol .for ( 'interrupt/check' ) ] ();

return this .interface [ Symbol .for ( 'scenarist' ) ] .play ( Symbol .for ( 'interrupt' ) );

} );

};

async publish () {

await super .publish ()
.catch ( error => {

if ( typeof this .interface ?.close === 'function' )
this .interface .close ();

throw error;

} );

if ( this .senior )
return this .play;

const argv = process .argv .slice ( 2 );

if ( ( await list ( '.' ) ) .includes ( 'scenario.js' ) )
argv .unshift ( '--open', 'scenario.js', process .cwd () .split ( '/' ) .pop () );

this .play ( Symbol .for ( 'prompt' ), ... argv );

return this .play;

};

async [ '$--open' ] ( { play: $ }, path, direction ) {

if ( path === undefined )
throw "Where is the Scenario you want to open is located?";

const { name, ext: extension } = parse ( path );

if ( path [ 0 ] !== '/' && extension .endsWith ( 'js' ) )
path = join ( process .cwd (), path );

const { default: scenario } = await import ( path );
const location = this .constructor .location ( direction = direction || name );

this .scenario [ location ] = new scenario;

return this .play ( direction, '.' );

};

async $_prompt ( story, ... argv ) {

this .interface [ Symbol .for ( 'scenarist' ) ] = this;

const { play: $ } = story;
let line = this .interface .question ( [ ... await $ ( '--prefix' ), ... await $ ( Symbol .for ( 'location' ) ) ] .join ( ' ' ) + ': ' )
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

$_end () {

this .interface .close ();

return "Okay! Bye bye!";

};

};
