/**
*	@filename	ViperAmulet.js
*	@author		Chojun
*	@desc		Obtain the Viper Amulet
*/

function ViperAmulet () {

	Town.doChores();

	if (me.getItem(521) || me.getItem(91)) { //Viper amulet or horadric staff
		print("I already have the Viper Amulet");

		return true;

	}

	if (me.getQuest(10, 0) && me.getQuest(11, 0)) {
		print("I've already completed the quest");

		return true;

	}

	Pather.useWaypoint(44, true);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(45, true)) {
		throw new Error("Failed to move to Valley of Snakes");
	}

	if (!Pather.moveToExit(58, true)) {
		throw new Error("Failed to move to Claw Viper Temple level 1");
	}

	if (!Pather.moveToExit(61, true)) {
		throw new Error("Failed to move to Claw Viper Temple level 2");
	}

	Pather.moveTo(15044, 14045, 3);

	var altar;

	for (let i = 0; i < 3; i++) {
		altar = getUnit(2, 149);

		if (altar) {
			break;
		}

		delay(me.ping * 2 + 250);

	}

	if (!altar) {
		throw new Error("Failed to locate the altar");
	}

	Pather.moveToPreset(61, 2, 149, 0, 0, Config.ClearType, false);

	Attack.clear(10);

	altar.interact();
	delay(me.ping + 1000);
	altar.interact();
	delay(me.ping + 1000);

	var amulet;

	for (let i = 0; i < 50; i++) { // Give the amulet plenty of time (up to two seconds) to drop because if it's not detected the script will end.
		amulet = getUnit(4, 521);

		if (amulet) {
			break;
		}

		delay(40);
	}

	while (!me.findItem(521)) { // Try more than once in case someone grabs the one I'm looking at.
		amulet = getUnit(4, 521);

		if (amulet) {
			if (Storage.Inventory.CanFit(amulet)) {
				Pickit.pickItem(amulet);

				delay(me.ping * 2 + 500);
			} else {
				if (Pickit.canMakeRoom()) {
					Town.visitTown(); // Go to Town and do chores. Will throw an error if it fails to return from Town.
				} else {
					print("I don't have enough room for the Viper Amulet!");

					return false;
				}
			}
		} else {
			print("I couldn't find the Viper Amulet!");

			return false;
		}
	}

	//Talk to Drognan to open up the Palace
	var drognan;

	Town.move("drognan");

	while (!drognan || !drognan.openMenu()) { // Try more than once to interact with Drognan.

		Town.move("drognan");

		drognan = getUnit(1, "drognan");

		delay(1000);

	}

	me.cancel();

	return true;

}
