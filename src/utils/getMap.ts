import type { Node } from '../Node';
import type { SourceMapProps } from '../SourceMap';

import { getMapFromUrl, getMapFromUrlSync } from './getMapFromUrl.js';
import { getSourceMappingUrl } from './getSourceMappingUrl';

/** @internal */
export function getMap ( node: Node ): Promise<SourceMapProps | null> {
    // 'undefined' never seen
    // 'null' seen but empty
    const map = node.map;
    if ( map === undefined ) {
        const url = getSourceMappingUrl( node.content );
        if ( url ) {
            return getMapFromUrl( url, node.origin )
                .catch( ( err ) => {
                // throw new Error(`Error when reading map ${url}`);
                    return null;
                });
        }
        return Promise.resolve( null );
    }
    return Promise.resolve( map );
}

/** @internal */
export function getMapSync ( node: Node ): SourceMapProps | null {
    // 'undefined' never seen
    // 'null' seen but empty
    const map = node.map;
    if ( map === undefined ) {
        const url = getSourceMappingUrl( node.content );
        if ( url ) {
            try {
                return getMapFromUrlSync( url, node.origin );
            }
            catch ( err ) {
                // throw new Error(`Error when reading map ${url}`);
            }
        }
        return null;
    }
    return map;
}