import { getObjectsByPrototype } from "game/utils";
import { Creep, Flag } from "game/prototypes";

export function loop() {
	var enemyFlag = getObjectsByPrototype(Flag).find((object) => !object.my);
	var myFlag = getObjectsByPrototype(Flag).find((object) => object.my);
	var myCreeps = getObjectsByPrototype(Creep).filter((object) => object.my);
	var enemies = getObjectsByPrototype(Creep).filter((object) => !object.my);

	// making groups with specific tasks
	for (var i = 0; i < myCreeps.length; i++) {
		var creep = myCreeps[i];

		if (i < 4) {
			// defender- shoot and don't move
			var target = creep.findInRange(enemies, 10)[0];
			if (target) {
				// enemy spotted- shoot them
				creep.rangedAttack(target);
			} else {
				// no enemy = go to flag to protext
				creep.moveTo(myFlag);
			}
		} else if (i < 9) {
			// runner- shoot and move to flag
			var target = creep.findInRange(enemies, 10)[0];
			if (target) {
				creep.rangedAttack(target);
			}
			creep.moveTo(enemyFlag);
		} else {
			// fighter- shoot and chase enemies
			var target = creep.findClosestByRange(enemies);
			if (target) {
				creep.rangedAttack(target);
				creep.moveTo(target);
			}
		}
	}
}
