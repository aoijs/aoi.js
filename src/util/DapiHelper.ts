import { AoiClient } from "..";
import { autoFetchDataTypes } from "../typings/types";

export function isAutoFetchDataEnabled ( string: autoFetchDataTypes,client:AoiClient )
{
    if ( !string ) return false;
    if ( client.options.autoFetchData?.includes( string ) || client.options.autoFetchData?.includes( 'all' ) ) return true;
    else return false;
}