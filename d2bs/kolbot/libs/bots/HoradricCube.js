/**
*	@filename	HoradricCube.js
*	@author		Chojun
*	@desc		Obtain the Horadric Cube
*/

function HoradricCube () {

	if (me.getItem(549)) {
		print("I already have the Horadric Cube.");

		return true;
	}

	Town.doChores();
	Pather.useWaypoint(57, true);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(60, true)) {
		throw new Error("Failed to move to Halls of the Dead 3");
	}

	var cubeChest;

	for (var i = 0; i < 3; i++) {
		cubeChest = getPresetUnit(60, 2, 354);

		if (cubeChest) {
			break;
		}

		delay(me.ping * 2 + 250);
	}

	Pather.moveToPreset(60, 2, 354, 0, 0, Config.ClearType, false);

	Attack.clear(20);

	Chest.openChest(cubeChest);

	var cube;

	for (i = 0; i < 50; i++) { // Give the cube plenty of time (up to two seconds) to drop because if it's not detected the script will end.
		cube = getUnit(4, 549);

		if (cube) {
			break;
		}

		delay(40);
	}

	while (!me.findItem(549)) { // Try more than once in case someone grabs the one I'm looking at.
		cube = getUnit(4, 549);

		if (cube) {
			if (Storage.Inventory.CanFit(cube)) {
				Pickit.pickItem(cube);

				delay(me.ping * 2 + 500);
			} else {
				if (Pickit.canMakeRoom()) {
					Town.visitTown(); // Go to Town and do chores. Will throw an error if it fails to return from Town.
				} else {
					print("I don't have enough room for the Horadric Cube!");

					return false;
				}
			}
		} else {
			print("I couldn't find the Horadric Cube!");

			return false;
		}
	}

	return true;

}
