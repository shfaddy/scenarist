#!/usr/bin/env node

import Scenarist from '@shfaddy/scenarist/shell';

try {

await new Scenarist () .publish ();

} catch ( error ) {

console .error ( "Scenarist got killed!" );
console .error ( error );

}
