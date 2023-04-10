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
js <-- array;
js <-- conditions;
js <-- fs;
js <-- loops;
js <-- maths;
js <-- misc;
js <-- object;
js <-- process;
js <-- string
    client <-- $clientAvatar.ts;
client <-- $clientId.ts;
client <-- $clientTag.ts;
client <-- $clientToken.ts;
client <-- $ping.ts;
guild <-- $guildId.ts;
guild <-- $guildName.ts;
message <-- $message.ts;
misc <-- $eval.ts;
user <-- $authorId.ts;
;
conditions <-- $and.ts;
conditions <-- $case.ts;
conditions <-- $checkCondition.ts;
conditions <-- $default.ts;
conditions <-- $else.ts;
conditions <-- $elseif.ts;
conditions <-- $if.ts;
conditions <-- $onlyif.ts;
conditions <-- $or.ts;
conditions <-- $switch.ts;
;
loops <-- $forIn.ts;
loops <-- $loop.ts;
loops <-- $while.ts;
maths <-- $abs.ts;
maths <-- $divide.ts;
maths <-- $math.ts;
maths <-- $modulo.ts;
maths <-- $multi.ts;
maths <-- $pow.ts;
maths <-- $root.ts;
maths <-- $round.ts;
maths <-- $sub.ts;
maths <-- $sum.ts;
misc <-- $break.ts;
misc <-- $catch.ts;
misc <-- $comment.ts;
misc <-- $env.ts;
misc <-- $finally.ts;
misc <-- $get.ts;
misc <-- $inc.ts;
misc <-- $jseval.ts;
misc <-- $let.ts;
misc <-- $log.ts;
misc <-- $passData.ts;
misc <-- $try.ts;
object <-- $addObjectProperty.ts;
object <-- $cloneObject.ts;
object <-- $createObject.ts;
object <-- $deleteObjectProperty.ts;
object <-- $getObject.ts;
object <-- $getObjectKeys.ts;
object <-- $getObjectProperty.ts;
object <-- $getObjectValues.ts;
object <-- $objectExists.ts;
process <-- $cpu.ts;
process <-- $ram.ts;
string <-- $includes.ts
```

## Divisions

 - `discord`: Contains functions related to discord
 - `js`: Contains functions related to js
