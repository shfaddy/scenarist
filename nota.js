import { readdir as list, mkdir as make, readFile as read, writeFile as write } from 'node:fs/promises';

export default class Nota extends Array {

async $_producer ( _ ) {

const { play: $ } = _;

try {

const location = [ ... ( await $ ( Symbol .for ( 'senior' ), Symbol .for ( 'location' ) ) ), '.nota' ] .join ( '/' );

const file = await read ( location, 'utf8' )
.then ( file => file .split ( '\n' ) )
.catch ( () => false );

if ( file !== false )
for ( let line of file )
if ( ( line = line .trim () ) .length )
await $ ( _, 'enter', ... line .split ( /\s+/ ) );

await $ ( _, 'play' );

} catch ( _ ) {

console .error ( '#bad', _ );

}

};

$_director ( { play: $ }, ... argv ) {

if ( ! argv .length )
return this .map (

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

if ( ! argv .length )
return $ ();

this .push ( argv );

return $ ( Symbol .for ( 'file' ) );

};

async $_file ( { play: $ } ) {

const location = [ '.', ... await $ ( Symbol .for ( 'senior' ), Symbol .for ( 'location' ) ) ];

await make ( location .join ( '/' ), { recursive: true } );

await write ( [ ... location, '.nota' ] .join ( '/' ), this .map ( argv => argv .join ( ' ' ) ) .join ( '\n' ), 'utf8' );

return $ ();

};

async $play ( _ ) {

const { play: $ } = _;

if ( _ .nota === undefined )
_ .nota = this .splice ( 0 );

if ( ! _ .nota .length )
return $ ( Symbol .for ( 'file' ) );

const argv = _ .nota .shift ();

if ( ! _ .return )
_ .return = true;

const output = await $ ( _, Symbol .for ( 'senior' ), Symbol .for ( 'prompt' ), ... argv );

if ( output === Symbol .for ( 'error' ) )
throw "Could not complete playing this nota";

this .push ( argv );

if ( typeof output === 'function' )
return Promise .all ( [

$ ( Symbol .for ( 'file' ) ),
( await output ( Symbol .for ( 'nota' ), '.' ) ) ( _, 'play' )

] );

return $ ( _, 'play' );

};

};
