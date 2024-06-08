# Discord

## Directory Structure

```mermaid
graph RL;
$clientAvatar --> client;
$clientId --> client;
$clientTag --> client;
$clientToken --> client;
$ping --> client;
$guildId --> guild;
$guildName --> guild;
$autocompleteRespond --> interaction;
$interactionData --> interaction;
$interactionDefer --> interaction;
$interactionDeferUpdate --> interaction;
$interactionModal --> interaction;
$interactionReply --> interaction;
$interactionUpdate --> interaction;
$description --> message;
$message --> message;
$title --> message;
$eval --> misc;
$authorAvatar --> user;
$authorId --> user;
$authorName --> user;
$authorTag --> user;
$userAvatar --> user;
$userId --> user;
$userTag --> user;
$username --> user;

```

## Divisions

 - `client`: Contains functions related to client
 - `guild`: Contains functions related to guild
 - `interaction`: Contains functions related to interaction
 - `message`: Contains functions related to message
 - `misc`: Contains functions related to misc
 - `user`: Contains functions related to user
