import { readdir as list, mkdir as make, readFile as read, writeFile as write } from 'node:fs/promises';

export default class Scenario extends Map {

constructor ( details = {} ) {


super ();

this .details = details;

};

async $_producer ( _ ) {

const { play: $ } = _;

if ( ! this .details [ Symbol .for ( 'player' ) ] )
this .details [ Symbol .for ( 'player' ) ] = $;

return $ ( 'read', 'README.md' )
.catch ( error => {

if ( error ?.code === 'ENOENT' )
return false;

throw error;

} );

};

$_director ( _, ... argv ) {

if ( ! this .open )
return;

if ( argv [ 0 ] === '```' )
return this .open = false;

if ( _ .scenario instanceof Array )
_ .scenario .push ( argv );

this .set ( this .size + 1, argv );

return true;

};

async $read ( _, file ) {

const { play: $ } = _;
const { path } = await $ ( Symbol .for ( 'path' ), file );
const script = await read ( path, 'utf8' )
.then ( file => file .split ( '\n' ) );

_ .scenario = [];

for ( let line of script )
if ( ( line = line .trim () ) .length ) {

const argv = line .split ( /\s+/ );

if ( ! this .open )
await $ ( _, ... argv );

else
await $ ( _, Symbol .for ( 'director' ), ... argv )

}

await $ ( _, 'play' );

};

async $_path ( { play: $ }, file ) {

const directory = [ '.', ... await $ ( Symbol .for ( 'location' ) ) ] .join ( '/' );
const path = [ directory, file ] .join ( '/' );

return { directory, file, path };

};

$print ( { play: $ }, ... argv ) {

if ( ! argv .length )
return [ ... this .values () ] .map (

( argv, index ) => `${ this .numbered ? ( ++index + ' ' ) : '' }${ argv .join ( ' ' ) }`

);

};

[ '$--numbered' ] ( { play: $ }, answer ) {

switch ( answer ) {

case 'no':
case 'false':
case 'balash':

this .numbered = false;

break;

default:

this .numbered = true;

}

return $ ( 'print' );

};

$_enter ( _, ... argv ) {

if ( ! this .open )
return Symbol .for ( 'closed' );

if ( _ .scenario instanceof Array )
_ .scenario .push ( argv );

this .set ( this .size + 1, argv );

return true;

};

open = false;

async [ '$```scenario' ] ( { play: $ }, ... argv ) {

if ( this .open )
throw "Scenario is already open for writing";

if ( argv .join ( ' ' ) !== ( await $ ( '--prefix' ) ) .join ( ' ' ) )
return;

return this .open = true;

};

async $_file ( { play: $ } ) {

const { directory, path } = await $ ( Symbol .for ( 'path' ) );

await make ( directory, { recursive: true } );

await write (

path,
[ ... this .values () ] .map ( argv => argv .join ( ' ' ) ) .join ( '\n' ),
'utf8'

);

return $ ();

};

async $play ( _ ) {

const { [ Symbol .for ( 'player' ) ]: $ } = this .details;

if ( _ .scenario === undefined )
_ .scenario = [ ... this .values () ];

if ( ! _ .scenario .length )
return true;

const argv = _ .scenario .shift ();

if ( ! _ .return )
_ .return = true;

const output = await $ ( _, Symbol .for ( 'senior' ), Symbol .for ( 'prompt' ), ... argv );

if ( output === Symbol .for ( 'error' ) )
throw "Could not complete playing this scenario";

if ( typeof output === 'function' )
return ( await output ( 'scenario', '.' ) ) ( _, 'play' );

return $ ( _, 'play' );

};

};
