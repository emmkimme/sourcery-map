import * as path from 'path';
import * as minimist from 'minimist';

import { transform } from '../pipe/transform';
import { parseExorcistCommandLine } from '../Options';
import { streamHelp } from './showHelp';

const command = minimist( process.argv.slice( 2 ), {
    boolean: [ 'h', 'help', 'e', 'error-on-missing' ],
    string: [ 'url', 'u', 'root', 'r', 'base', 'b' ],
    alias: {
        u: 'url',
        r: 'root',
        b: 'base',
        h: 'help',
        e: 'error-on-missing'
    }
});

// function onerror(err) {
//   console.error(err.toString());
//   process.exit(err.errno || 1);
// }

if ( command.help ) {
    streamHelp( process.stdout, 'so[u]?rcery-exorcist' );
}

else if ( process.argv.length <= 2 && process.stdin.isTTY ) {
    streamHelp( process.stderr, 'so[u]?rcery-exorcist' );
}
else {
    const mapfile = command._.shift();
    if ( !mapfile ) {
        console.error( 'Missing map file' );
    //   return usage();
    }

    const resolved_mapfile = path.resolve( mapfile );

    const options = parseExorcistCommandLine( command );

    process.stdin
        .pipe( transform( resolved_mapfile, options ) )
        .on( 'error', onerror )
        .on( 'missing-map', console.error.bind( console ) )
        .pipe( process.stdout );
}