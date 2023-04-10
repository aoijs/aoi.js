/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require( "fs" );

const file = process.cwd() + "/src/functions";

const dirs = fs.readdirSync( file, { withFileTypes: true } ).filter( x => x.isDirectory() ).map( x => x.name );

const folders = {};
for ( const dir of dirs )
{
    const subdirs = fs.readdirSync( file + "/" + dir, { withFileTypes: true } ).filter( x => x.isDirectory() ).map( x => x.name );
    const obj = {};
    for ( const subdir of subdirs )
    {
        const files = fs.readdirSync( file + "/" + dir + "/" + subdir, { withFileTypes: true } ).filter( x => x.isFile() && x.name.startsWith( ( "$" ) ) ).map( x => x.name.split( "." )[ 0 ] );
        if( files.length)
            obj[ subdir ] = files;
    }
    folders[ dir ] = obj;
}
console.log( folders );

const readme = `# Functions

## Directory Structure
\`\`\`mermaid
graph RL;
    ${ Object.keys( folders ).map( x => `${ x } --> Functions` ).join( ";\n" )}
    ${ Object.keys( folders ).map( x => Object.keys( folders[ x ] ).map( y => `${ x } <-- ${ y }` ).join( ";\n" ) ).join( ";\n" )}
    ${ Object.keys( folders ).map( x => Object.keys( folders[ x ] ).map( y =>  folders[ x ][ y ] .map( z => `${ y } <-- ${ z }` ).join( ";\n" ) ).join( ";\n" ) ).join( ";\n" )}
\`\`\`

## Divisions

${ Object.keys( folders ).map( x => ` - \`${ x }\`: Contains functions related to ${ x }` ).join( "\n" )}
`;

fs.writeFileSync( file+"/README.md", readme );