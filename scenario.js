export default class Scenario extends Map {

constructor ( setting ) {

super ();

this .setting = Object .create ( setting );

};

async $_producer ( _ ) {

return _ .play ( Symbol .for ( 'read' ), 'README' )
.catch ( error => {

if ( error ?.code === 'ENOENT' )
return false;

throw error;

} );

};

get $_director () { return this [ '$--from' ] };

[ '$--from' ] ( _, ... argv ) {

if ( argv .length && ! this .open && ! this .reading )
return _ .play ( Symbol .for ( 'read' ), ... argv );

};

$_enter ( _, ... argv ) {

if ( argv [ 0 ] === '```' )
return this .open = false;

if ( _ .script instanceof Array )
_ .script .push ( argv );

this .set ( this .size + 1, argv );

return true;

};

static book = new Map;

async $_read ( _, ... argv ) {

const { play: $ } = _;
const { path } = await $ ( Symbol .for ( 'path' ), ... argv );

if ( ! this .constructor .book .has ( path ) )
throw `No script is found at ${ path }`;

const script = this .constructor .book .get ( path );

this .reading = true;

_ .script = [];

for ( let line of script )
if ( ( line = line .trim () ) .length ) {

let argv = line .split ( /\s+/ );

if ( ! this .open ) {

if ( argv .shift () === '```scenario' )
await $ ( Symbol .for ( 'open' ), ... argv );

}

else
await $ ( _, Symbol .for ( 'enter' ), ... argv )

}

this .reading = false;

return $ ( _, 'play' );

};

async $_path ( _, ... argv ) {

const $ = await _ .play ( '..' );
const file = argv [ argv .length - 1 ] .endsWith ( '.md' ) ? argv .pop () : `${ argv .pop () }.md`;
const location = await $ ( '--location', ... argv );

if ( location === false )
throw `No location exists at ${ argv .join ( ' ' ) }`;

const directory = location .join ( '/' );
const path = directory + '/' + file;

return { directory, file, path };

};

[ '$--print' ] ( { numbered } ) {

if ( ! argv .length )
return [ ... this .values () ] .map (

( argv, index ) => `${ numbered ? ( ++index + ' ' ) : '' }${ argv .join ( ' ' ) }`

);

};

[ '$--numbered' ] ( _, answer ) {

switch ( answer ) {

case 'no':
case 'false':
case 'balash':

_ .numbered = false;

break;

default:

_ .numbered = true;

}

return _ .play ( _, '--print' );

};

open = false;

async $_open ( { play: $ }, ... argv ) {

if ( argv .join ( ' ' ) !== ( await $ ( '--prefix' ) ) .join ( ' ' ) )
return;

if ( this .open )
throw "Scenario is already open for writing";

return this .open = true;

};

async $_file ( { play: $ } ) {

const { directory, path } = await $ ( Symbol .for ( 'path' ) );

this .constructor .book .set (

path,
[ ... this .values () ] .map ( argv => argv .join ( ' ' ) ) .join ( '\n' )

);

return $ ();

};

async $play ( _ ) {

const $ = await _ .play ( '..' );

if ( _ .script === undefined )
_ .script = [ ... this .values () ];

if ( ! _ .script .length )
return true;

const argv = _ .script .shift ();

_ .script .line = _ .script .line === undefined ? 1 : ++_ .script .line;

try {

const output = await $ ( ... argv );

if ( typeof output === 'function' )
return output ( _, '--read', 'play' );

return $ ( _, '--read', 'play' );

} catch ( error ) {

throw `

${ [ '~', ... await $ ( '--location' ) ] .join ( ' ' ) }: Could not complete playing this scenario

line #${ _ .script .line } ${ argv .join ( ' ' ) }

${ error ?.message || error }

` .trim ();

}

};

};
