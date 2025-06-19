export default class Nota extends Array {

$_director ( { play: $ }, ... argv ) {

if ( ! argv .length )
return this .map (

argv => argv .join ( ' ' )

);

};

$enter ( { play: $ }, ... argv ) {

if ( argv .length )
this .push ( argv );

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
