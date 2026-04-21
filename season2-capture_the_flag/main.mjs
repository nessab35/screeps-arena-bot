import { getObjectsByPrototype } from "game/utils";
import { Creep, Flag } from "game/prototypes";

function runDefenders(defenders, enemies, myFlag) {
	// defender logic
	for (var creep of defenders) {
		var target = creep.findInRange(enemies, 10)[0];
		if (target) {
			// enemy spotted- shoot them
			creep.rangedAttack(target);
		} else {
			// no enemy- go to flag to protect
			creep.moveTo(myFlag);
		}
	}
}

function runRunners(runners, enemies, enemyFlag) {
	// runner logic
	for (var creep of runners) {
		var target = creep.findInRange(enemies, 10)[0];
		if (target) {
			// enemy spotted- shoot them
			creep.rangedAttack(target);
		}
		// prioritize going to enemy flag
		creep.moveTo(enemyFlag);
	}
}

function runFighters(fighters, enemies) {
	// fighter logic
	for (var creep of fighters) {
		var target = creep.findClosestByRange(enemies);
		// fighting only
		if (target) {
			creep.rangedAttack(target);
			creep.moveTo(target);
		}
	}
}

export function loop() {
	var enemyFlag = getObjectsByPrototype(Flag).find((object) => !object.my);
	var myFlag = getObjectsByPrototype(Flag).find((object) => object.my);
	var myCreeps = getObjectsByPrototype(Creep).filter((object) => object.my);
	var enemies = getObjectsByPrototype(Creep).filter((object) => !object.my);

	runDefenders(myCreeps.slice(0, 4), enemies, myFlag);
	runRunners(myCreeps.slice(4, 9), enemies, enemyFlag);
	runFighters(myCreeps.slice(9), enemies);
}
