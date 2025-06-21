import { readdir as list, mkdir as make, readFile as read, writeFile as write } from 'node:fs/promises';

export default class Nota extends Array {

async $_producer ( story ) {

const { play: $ } = story;

try {

const file = await read (

( await $ ( Symbol .for ( 'location' ) ) ) .join ( '/' ) + '.nota',
'utf8'

) .then ( file => file .split ( '\n' ) )
.catch ( () => false );

if ( file !== false )
for ( let line of file )
if ( ( line = line .trim () ) .length )
await $ ( 'enter', ... line .split ( /\s+/ ) );

await $ ( Object .assign ( story, { return: true } ), Symbol .for ( 'prompt' ), 'play' );

} catch ( _ ) {}

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

const location = [ '.', ... await $ ( Symbol .for ( 'location' ) ) ];

await make ( location .slice ( 0, -1 ) .join ( '/' ), { recursive: true } );

await write ( location .join ( '/' ) + '.nota', ( await $ () ) .join ( '\n' ), 'utf8' );

return $ ();

};

async $play ( story, ... argv ) {

if ( ! argv .length )
argv = this .slice ( 0 );

const { play: $ } = story;
const line = argv .shift ();

if ( line === undefined )
throw "There is nothing to play in this nota";

if ( await $ ( Object .assign ( story, { return: true } ), Symbol .for ( 'senior' ), Symbol .for ( 'prompt' ), ... line ) === Symbol .for ( 'error' ) )
throw "Could not complete playing this nota";

return argv .length ? $ ( Symbol .for ( 'play' ), ... argv ) : Symbol .for ( 'done' );

};

};
