/**
*	@filename	Duriel.js
*	@author		kolton
*	@desc		kill Duriel
*/

function Duriel () {
	this.killDuriel = function () {
		var i, target;

		for (i = 0; i < 3; i += 1) {
			target = getUnit(1, 211);

			if (target) {
				break;
			}

			delay(500);
		}

		if (!target) {
			throw new Error("Duriel not found.");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + 211);
		}

		for (i = 0; i < 300; i += 1) {
			ClassAttack.doCast(target, Config.AttackSkill[1], Config.AttackSkill[2]);

			if (target.dead) {
				return true;
			}

			if (getDistance(me, target) <= 10) {
				Pather.moveTo(22638, me.y < target.y ? 15722 : 15693);
			}
		}

		return target.dead;
	};

	this.cubeStaff = function () {
		var amulet = me.getItem(521),
			staff = me.getItem(92);

		if (!amulet || !staff) {
			return false;
		}

		Town.move("stash");

		if (!Town.openStash()) {
			Town.openStash();

		}

		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();

		delay(750 + me.ping);
		Cubing.emptyCube();

		me.cancel();

		if (!me.getItem(91)) {
			return false;
		}

		return true;

	};

	this.placeStaff = function () {
		var staff = me.getItem(91),
			orifice;

		if (!staff || !Storage.Inventory.CanFit(staff)) {
			print("I don't have the Horadric Staff or I can't fit it in my inventory");

			return false;

		}

		//Go to town and get the staff
		Town.goToTown();
		Town.move("stash");

		if (!Town.openStash()) {
			Town.openStash();
		}

		Storage.Inventory.MoveTo(staff);

		delay(1000);

		me.cancel();

		if (!Pather.usePortal(getRoom().correcttomb, me.name)) {
			print("Couldn't return to Tal Rasha's tomb");

			return false;
		}

		delay(1000);

		//Place the staff in the orifice
		orifice = getUnit(2, 152);

		if (!orifice) {
			print("Couldn't find the orifice");

			return false;
		}

		Chest.openChest(orifice);
		staff.toCursor();
		submitItem();

		//Wait for the fanfare and hole to open up
		delay(10000);

		return true;

	};

	this.talkToTyrael = function () {
		var tyrael;

		Pather.teleport = false;
		Pather.moveTo(22608, 15706, 3);
		Pather.moveTo(22583, 15704, 3);
		Pather.moveTo(22582, 15651, 3);
		Pather.moveTo(22577, 15602, 3);

		tyrael = getUnit(1, "tyrael");

		if (!tyrael) {
			Pather.teleport = true;

			return false;
		}

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, tyrael) > 3) {
				Pather.moveToUnit(tyrael);
			}

			tyrael.interact();
			delay(1000 + me.ping);
			me.cancel();

			if (Pather.getPortal(null)) {
				me.cancel();

				break;
			}
		}

		Pather.teleport = true;

		delay(1000);

		Town.goToTown();

		return true;

	};

	var i, unit, haveStaff;

	Town.doChores();

	//Check and see if we need to make the staff
	if (!me.getQuest(10, 0) && !me.getQuest(14, 1) && !me.getQuest(14, 3) && !me.getQuest(14, 4)) {
		//Haven't completed the quest
		if (!me.getItem(91)) {	//Don't have the staff
			if (!me.getItem(92) || !me.getItem(521)) {
				throw new Error("Don't have staff components");
			}

			if (!me.getItem(549)) {
				throw new Error("Don't have the Horadric Cube");
			}

			if (!this.cubeStaff()) {
				throw new Error("Failed to create the Horadric Staff");
			}

		}

		haveStaff = me.getItem(91);

	}

	Pather.useWaypoint(46);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(getRoom().correcttomb, true)) {
		throw new Error("Failed to move to Tal Rasha's Tomb");
	}

	if (!Pather.moveToPreset(me.area, 2, 152, -11, 3)) {
		throw new Error("Failed to move to Orifice");
	}

	if (haveStaff) {
		if (!this.placeStaff()) {
			throw new Error("Failed to place the staff in the orifice");
		}
	}

	for (i = 0; i < 10; i += 1) {
		if (getUnit(2, 100)) {
			break;
		}

		delay(500);
	}

	if (me.gametype === 1 && me.classid !== 1) {
		Attack.clear(5);
	}

	unit = getUnit(2, 100);

	if (unit) {
		for (i = 0; i < 3; i += 1) {
			if (me.area === unit.area) {
				Skill.cast(43, 0, unit);
			}

			if (me.area === 73) {
				break;
			}
		}
	}

	if (me.area !== 73 && !Pather.useUnit(2, 100, 73)) {
		Attack.clear(10);
		Pather.useUnit(2, 100, 73);
	}

	if (me.area !== 73) {
		throw new Error("Failed to move to Duriel");
	}

	if (me.classid === 1 && me.gametype === 0) {
		this.killDuriel();
	} else {
		Attack.kill(211); // Duriel
	}

	Pickit.pickItems();

	if (!me.getQuest(14, 0)) {
		//First time completing the quest, so go finish it
		if (!this.talkToTyrael()) {
			throw new Error("Failed to complete the Seven Tombs Quest (Kill Duriel)");
		}

	}

	return true;
}
