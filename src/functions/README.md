# Functions

## Directory Structure
```mermaid
graph RL;
    discord --> Functions;
js --> Functions
    discord <-- client;
discord <-- guild;
discord <-- message;
discord <-- misc;
discord <-- user;
js <-- conditions;
js <-- loops;
js <-- maths;
js <-- misc;
js <-- object;
js <-- process;
js <-- string
    client <-- $clientAvatar;
client <-- $clientId;
client <-- $clientTag;
client <-- $clientToken;
client <-- $ping;
guild <-- $guildId;
guild <-- $guildName;
message <-- $message;
misc <-- $eval;
user <-- $authorId;
conditions <-- $and;
conditions <-- $case;
conditions <-- $checkCondition;
conditions <-- $default;
conditions <-- $else;
conditions <-- $elseif;
conditions <-- $if;
conditions <-- $onlyif;
conditions <-- $or;
conditions <-- $switch;
loops <-- $forIn;
loops <-- $loop;
loops <-- $while;
maths <-- $abs;
maths <-- $divide;
maths <-- $math;
maths <-- $modulo;
maths <-- $multi;
maths <-- $pow;
maths <-- $root;
maths <-- $round;
maths <-- $sub;
maths <-- $sum;
misc <-- $break;
misc <-- $catch;
misc <-- $comment;
misc <-- $env;
misc <-- $finally;
misc <-- $get;
misc <-- $inc;
misc <-- $jseval;
misc <-- $let;
misc <-- $log;
misc <-- $passData;
misc <-- $try;
object <-- $addObjectProperty;
object <-- $cloneObject;
object <-- $createObject;
object <-- $deleteObjectProperty;
object <-- $getObject;
object <-- $getObjectKeys;
object <-- $getObjectProperty;
object <-- $getObjectValues;
object <-- $objectExists;
process <-- $cpu;
process <-- $ram;
string <-- $includes
```

## Divisions

 - `discord`: Contains functions related to discord
 - `js`: Contains functions related to js
