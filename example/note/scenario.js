export default class Note {

book = [];

$_director ( story, ... argv ) {

const { play } = story;

if ( ! argv .length )
return play ( Symbol .for ( 'print' ) );

return play ( Symbol .for ( 'record' ), ... argv );

};

$_print () {

console .log ( this .book .join ( '\n' ) );

};

$_record ( story, ... argv ) {

if ( ! argv .length )
return;

this .book .push ( argv );

return story .play ();

};

};
