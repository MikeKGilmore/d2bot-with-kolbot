/**
*	@filename	Radament.js
*	@author		kolton
*	@desc		kill Radament
*/

function Radament () {
	Town.doChores();
	Pather.useWaypoint(48);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(49, true) || !Pather.moveToPreset(me.area, 2, 355)) {
		throw new Error("Failed to move to Radament");
	}

	Attack.kill(229); // Radament

	//Use the book, if it's found
	var book = getUnit(4, 552);

	if (book) {
		Pickit.pickItem(book);
		delay(300);
		clickItem(1, book);
	}

	Pickit.pickItems();
	Chest.scan(20);
	Chest.openChests();

	return true;
}
