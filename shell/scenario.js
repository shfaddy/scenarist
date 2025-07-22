import { readdir as list, mkdir as make, readFile as read, writeFile as write } from 'node:fs/promises';

export default class Scenario extends Map {

async $_producer ( _ ) {

const { play: $ } = _;
const { path } = await $ ( Symbol .for ( 'path' ) );
const file = await read ( path, 'utf8' )
.then ( file => file .split ( '\n' ) )
.catch ( () => false );

if ( file !== false )
for ( let line of file )
if ( ( line = line .trim () ) .length )
await $ ( _, 'enter', ... line .split ( /\s+/ ) );

await $ ( _, 'play' );

};

async $_path ( { play: $ } ) {

const directory = [ '.', ... await $ ( Symbol .for ( 'senior' ), Symbol .for ( 'location' ) ) ] .join ( '/' );
const file = [ ... await $ ( '--prefix' ), 'scenario' ] .join ( '.' );
const path = [ directory, file ] .join ( '/' );

return { directory, file, path };

};

$_director ( { play: $ }, ... argv ) {

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

return $ ();

};

async $enter ( { play: $ }, ... argv ) {

const direction = argv [ 0 ] ?.direction ? argv .shift () .direction : ( this .size + 1 );

if ( ! argv .length )
return $ ();

this .set ( direction, argv );

return $ ( Symbol .for ( 'file' ) );

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

const { play: $ } = _;

if ( _ .scenario === undefined )
_ .scenario = [ ... this .values () ];

if ( ! _ .scenario .length )
return $ ( Symbol .for ( 'file' ) );

const argv = _ .scenario .shift ();

if ( ! _ .return )
_ .return = true;

const output = await $ ( _, Symbol .for ( 'senior' ), Symbol .for ( 'prompt' ), ... argv );

if ( output === Symbol .for ( 'error' ) )
throw "Could not complete playing this scenario";

if ( typeof output === 'function' )
return ( await output ( '--scenario', '.' ) ) ( _, 'play' );

return $ ( _, 'play' );

};

};
