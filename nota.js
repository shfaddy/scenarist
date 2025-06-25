import { readdir as list, mkdir as make, readFile as read, writeFile as write } from 'node:fs/promises';

export default class Nota extends Array {

async $_producer ( story ) {

const { play: $ } = story;

try {

const file = await read (

( await $ ( Symbol .for ( 'senior' ), Symbol .for ( 'location' ) ) ) .join ( '/' ) + '.nota',
'utf8'

) .then ( file => file .split ( '\n' ) )
.catch ( () => false );

if ( file !== false )
for ( let line of file )
if ( ( line = line .trim () ) .length )
await $ ( 'enter', ... line .split ( /\s+/ ) );

await $ ( Object .assign ( story, { return: true } ), 'play' );

} catch ( _ ) {

console .log ( '#bad', _ );

}

};

$_director ( { play: $ }, ... argv ) {

if ( ! argv .length )
return this .map (

argv => argv .join ( ' ' )

);

};

async $enter ( { play: $ }, ... argv ) {

if ( ! argv .length )
return $ ();

this .push ( argv );

const location = [ '.', ... await $ ( Symbol .for ( 'senior' ), Symbol .for ( 'location' ) ) ];

await make ( location .join ( '/' ), { recursive: true } );

await write ( [ ... location, '.nota' ] .join ( '/' ), ( await $ () ) .join ( '\n' ), 'utf8' );

return $ ();

};

async $play ( story, ... argv ) {

if ( ! argv .length )
argv = this .slice ( 0 );

const { play: $ } = story;
const play = typeof argv [ 0 ] === 'function' ? argv .shift () : await $ ( Symbol .for ( 'senior' ) );
const line = argv .shift ();

if ( line === undefined )
return;

const output = await play ( Object .assign ( story, {

return: true

} ), Symbol .for ( 'prompt' ), ... line );

if ( output === Symbol .for ( 'error' ) )
throw "Could not complete playing this nota";

if ( typeof output === 'function' && argv .length )
argv .unshift ( output );

return argv .length ? $ ( 'play', ... argv ) : Symbol .for ( 'done' );

};

};
