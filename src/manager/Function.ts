import { Group } from "@akarui/structures";
import { AoiClient } from "../structures/AoiClient.js";
import { FunctionData } from "../typings/interfaces.js";
import fs from "fs/promises";
export class FunctionManager {
    client: AoiClient;
    functions: Group<string, FunctionData> = new Group<string, FunctionData>(Infinity);
    constructor ( client: AoiClient ) {
        this.client = client;
    }
    createFunction ( data: FunctionData ) {
        if ( !data.name ) throw new Error( "Function name is required" );
        if ( !data.code ) throw new Error( "Function code is required" );
        this.functions.set( data.name, data );
    }
    createManyFunctions ( data: FunctionData[] ) {
        for ( const func of data ) this.createFunction( func );
    }
    async load ( path: string ) {
        const stats = await fs.stat( path );
        if ( stats.isDirectory() ) {
            const files =  await fs.readdir( path );
            for ( const file of files ) {
                const filePath = path + "/" + file;
                const stats = await fs.stat( filePath );
                if ( stats.isDirectory() ) await this.load( filePath );
                else if ( stats.isFile() && file.endsWith( ".js" ) ) {
                    const func = await import( filePath );
                    this.createFunction( func.default );
                }
            }
        }
    }
}