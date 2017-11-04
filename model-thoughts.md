Reducers

Elevators:
```js
[
  {
    status: idle,
    floor: 0,
    doors: 'closed',
    elevatorRequestId: null,
  }, {
    status: en-route,
    destinationFloor: 4,
    elevatorRequestId: 'abc',
  }, {
    status: delivering,
    passengerIds: ['a', 'b', 'c', ...],
    nextStop: 3,
    remainingStops: [3, 5, 8, ...],
  },
]
```

ElevatorRequests:
These are the floor-level button presses.

```js
{
  abc: {
    direction: 'up',
    floor: 0,
  },
  def: {
    direction: 'down',
    floor: 4,
  },
}
```

When a person calls an elevator, it creates an elevator request.

Redux Saga seems like an obvious choice.

A saga would listen for an action like REQUEST_ELEVATOR_AT_FLOOR. This would
immediately create an `elevatorRequest`.

An elevator has to claim it immediately, although it can be added to an
elevator's queue.



Let's say Elevator 0 claims request 'abc'. Other elevators would see it as
unavailable. When the elevator arrives to Floor 0, it accepts passengers.

Those passengers press buttons (say, 3 and 4). So the elevator goes up to floor
3. When it lets those passengers off, an action should be dispatched, like
ELEVATOR_ARRIVE_AT_FLOOR. There may be another elevator request to take the
user in the same direction, after all.

If not, it continues up to floor 4. After ejecting all of its passengers, it
first checks for any elevator request at this floor, going in either direction.
It sees that there's a request for 'down', so it claims it, picks up the
passengers.

That passenger pushes the button for '2', and so the elevator goes down. Before
leaving Floor 4, it checks for any corresponding elevator requests, and claims
them.

```js
take(ELEVATOR_ARRIVE_AT_FLOOR, action => {
    elevator = state.elevators[action.elevatorId]

   peopleGettingOut = elevator.people && elevator.people.filter(person.destinationFloor === action.floor)
    if (peopleGettingOut) {
        ejectFolksFromElevator({ peopleGettingOut })
        delay(ELEVATOR_DOOR_TIME + peopleGettingOut.length * PERSON_DISPATCH_TIME)
    }

   // Anyone on that floor might want to get on the elevator
    peopleGettingOn = state.floors[action.floor].people.filter(person.floor === action.floor and elevator.direction === person.direction)

   if (peopleGettingOn) {
        // This action should also update elevator status, eg. from Idle to Delivering
        boardElevator({ elevator, peopleGettingOn })
        delay(TIME)
    }

   // Figure out what this elevator should do next!
    // It's possible that the elevator was fulfilling a request, and now that request is fulfilled.
    // Additionally, the people who boarded the elevator have pressed buttons, and so we have

})
```

The process for a single person is actually quite convoluted:
- Person is generated at ground floor
- Person walks to the elevator request button
- Person requests elevator, if it isn't already requested, for their direction
- Person waits
- Elevator arrives
- Elevator doors open
- Other people get out of the elevator
- Person gets in elevator
- Elevator doors close
- Person requests their floor
- Elevator makes 0-n stops before the Person's floor
- Elevator arrives at Person's floor
- Elevator doors open
- Person leaves elevator
- Person walks a bit and fades away.

Some of these are directly tied to Redux actions, and others are derivations of the current state (state => UI and all that)

A person is generated with a floorId (0 in most cases, unless I wanna invent negative parking levels?). Their first job is to go push the elevator button.

They spawn with a desired floorId, so the elevator direction is derivable.

Currently, Person has a `destinationX` prop, which controls the offset amount. Maybe this should be derived, though.

The Person starts at 0 x-offset. We can pass in the elevator buttons ref, and figure out how far they have to walk before triggering their callback.

Persons will have the following callback:
- onRequestElevator
- onBoardElevator
- onArriveAtDestinationFloor

My current thinking is that Person callbacks are fired whenever the person finishes moving... when they arrive at the buttons, they fire `requestElevator`. When the elevator door opens and they line themselves up with the door, they fire `boardElevator`. When the elevator arrives at their floor, they walk a few steps and fade away (or w/e), and fire `arrive`.

The START of their movement is handled by external events. When the elevator fires `ELEVATOR_ARRIVES_AT_FLOOR` for the floor a Person is waiting on, going in a direction they can use, that action updates their reducer state, which causes the person's `destinationX` to change, and so they start moving.

---------------


Current setup:

Person is initialized by Building (later, from above), with a buncha random stats, including an initial floor and a destination floor.

PersonController has state that dictates the current X position (in terms of offset from the parent container), and the destination X position.

When the person's Status changes, the PersonController figures out where it has to walk to, and does something when it gets there (typically a redux action).

There are also a couple Sagas that interact in a call-and-response kind of way.

When the person is first initialized, the PersonController is handed a ref for the elevator button container. It uses it to figure out how far it has to move, and kicks off its animation loop. Every 1/60th of a frame (hopefully) it moves a little closer to the destination.

When it gets there (or, if another person gets there first), it fires `finishedWalking`, which in turn fires off the appropriate
