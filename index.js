export default class Scenarist {

ready = [];

constructor ( scenario = {}, details = {} ) {

this .scenario = scenario;
this .play = Object .defineProperty ( Scenarist .director .bind ( this ), 'name', {

value: 'scenarist',
configurable: true

} );
this .plot = new Map;
this .details = details;

if ( details .story ?.direction )
this .direction = details .story .direction;

if ( details .senior instanceof Scenarist )
this .senior = details .senior;

this .prefix = details .prefix instanceof Array ? details .prefix : [];

Object .defineProperty ( this .scenario, '$--reproduce', { value: Object .getPrototypeOf ( this .scenario ) .constructor } );

if ( typeof scenario ?.$_producer !== 'undefined' )
this .ready .push ( this .play ( Symbol .for ( 'producer' ), this .scenario .details || this .senior ?.scenario ?.details ) );

}; // this .constructor

async publish () {

await Promise .all ( this .ready );

return this .play;

}; // this .publish

static Story = class Story {

scene = []

}; // this .constructor .Story

ticket = 0;

static async director ( ... scene ) {

let story = scene [ 0 ] instanceof this .constructor .Story ? Object .create ( scene .shift () ) : new this .constructor .Story;

story .ticket = ++this .ticket;
story .play = this .play;
story .scene = scene;
story .location = this .constructor .location ( story .direction = scene .shift () );

if ( ( typeof story .direction === 'symbol' || this .scenario .priority !== true ) && this [ story .location ] )
story .conflict = await ( story .setting = this ) [ story .location ];

else
story .conflict = await ( story .setting = this .scenario ) [ story .location ];

if ( story .conflict === undefined ) {

if ( story .direction !== undefined )
story .scene .unshift ( story .direction );

if ( typeof story .setting .$_director !== 'undefined' )
return await story .play ( story, Symbol .for ( 'director' ), ... story .scene );

else if ( story .direction === undefined )
return;

else
throw "Unknown direction: " + story .direction .toString ();

}

switch ( typeof story .conflict ) {

case 'object':

if ( ! this .plot .has ( story .conflict ) ) {

const junior = new this .constructor ( story .conflict, Object .assign ( Object .create ( this .details || {} ), {

story,
senior: this,
prefix: this .prefix

} ) );

this .plot .set ( story .conflict, junior );

await junior .publish ();

}

story .resolution = await this .plot .get ( story .conflict ) .play ( story, ... scene );

break;

case 'function':

if ( story .conflict === story .conflict ?.prototype ?.constructor ) {

if ( ! scene .length )
throw `direction for the new ${ story .conflict .name } scenario is missing`;

story .location = this .constructor .location ( story .direction = scene .shift () );

if ( story .setting [ story .location ] !== undefined )
throw `Scenario with the direction ${ story .direction } already exists`;

story .setting [ story .location ] = new story .conflict ( story .details !== undefined ? story .details : this .scenario .details );

story .resolution = await this .play ( story, story .direction, ... scene );

}

else
story .resolution = await story .conflict .call ( story .setting, story, ... scene );

break;

default:

story .resolution = story .conflict;

}

return story .resolution;

}; // this .constructor .director

static location ( direction ) {

return typeof direction === 'symbol' ? '$_' + Symbol .keyFor ( direction ) : '$' + direction;

}; // this .constructor .location

$$ ( _, direction ) {

if ( direction === undefined )
return this .scenario .direction;

if ( this .senior )

this .senior .scenario [ location ];

return this .scenario .direction = direction;

};

get [ '$.' ] () { return this .$_this };

$_this ( story, ... argv ) {

return argv .length ? this .play ( story, ... argv ) : this .play;

}; // this .play ( '.', ... argv )

get [ '$..' ] () { return this .$_senior };

$_senior ( story, ... argv ) {

return ( this .senior ?.play || this .play ) ( story, '.', ... argv );

}; // this .play ( '..', ... argv )

[ '$~' ] ( story, ... argv ) {

return this .senior ?.play ? this .senior .play ( story, '~', ... argv ) : this .play ( story, '.', ... argv );

};

[ '$--prefix' ] () { return this .prefix };

get [ '$--direction' ] () { return this .$_direction };

$_direction ( _, direction = this .direction ) {

return typeof direction === 'symbol' ? undefined : this .direction = direction;

}; // this .play ( '--direction', direction )

get [ '$--location' ] () { return this .$_location };

async $_location ( { play: $ } ) {

const location = [];
const direction = await $ ( '--direction' );

if ( direction !== undefined )
location .push ( direction );

if ( ! this .senior )
return location;

return [ ... await this .senior .play ( Symbol .for ( 'location' ) ), ... location ];

}; // this .play ( Symbol .for ( 'location ) )

[ '$--directory' ] ( _, scenario ) {

const directory = [];

for ( const location of Object .keys ( this .scenario ) ) {

if (

location [ 0 ] === '$' && location [ 1 ] !== '_'
&& typeof this .scenario [ location ] === 'object'
&& ( scenario === undefined || Object .getPrototypeOf ( this .scenario [ location ] ) .constructor .name === scenario )

) directory .push ( [

Object .getPrototypeOf ( this .scenario [ location ] ) .constructor .name,
location .slice ( 1 )

] );

}

return directory;

};

};
