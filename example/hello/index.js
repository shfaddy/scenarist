import Scenarist from '@shfaddy/scenarist';

const scenario = new class {

$hello = "Hello World! This is Shaikh Faddy's Scenarist";

};

const play = await new Scenarist ( scenario ) .publish ();

console .log ( await play ( 'hello' ) );
