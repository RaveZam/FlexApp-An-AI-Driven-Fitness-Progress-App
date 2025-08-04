What i did today:

Initated The implementation for for the session timers, i created a custom hook that is used by the useWorkout To Track the Session Timer along with their new/destroyed or track if theyre abandoned,

Note that there is a new issue tho that everything that is related with the timer rerenders per tick.

Whats Next:

Figure out how to track what the user has worked out vs not, maybe thats on the database also,
So adding all the workouts on that session??? and then having a boolean taken true or false. Basta figure it out.

So TLDR Design the logic flow on how to handle the User Logs,

It should remember what workouts ive taken and show the logs

So It Could be a filter and comparison if it exists in the session log vs the current workout shown on the app since it already tracks it in the client side.

HIGH PRIORITY FIX THE TIMER TRIGGERING RERENDERING. ADD A FINISH WORKOUT FUNCTION EVEN IF ITS JUST A BUTTON

//NOTE FIX ERROR WHEN FRESH OPEN FROM APP IT DOESNT RESUME THE SESSION!
//NOTE FIX RERENDERING ISSUE, ANYTHING THAT USES USEWORKOUTSESSIONTIMER RERENDERS PER TICK ON THE USE EFFECT.
