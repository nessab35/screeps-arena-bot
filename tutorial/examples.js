// Getting tickets
import { getTicks } from "game/utils";

export function loop() {
	console.log("Current tick:", getTicks());
}

// Moving the creep to flag
import { getObjectsByPrototype } from "game/utils";
import { Creep, Flag } from "game/prototypes";

export function loop() {
	var creeps = getObjectsByPrototype(Creep);
	var flags = getObjectsByPrototype(Flag);
	creeps[0].moveTo(flags[0]);
}

// Destroy the enemy creep
import { getObjectsByPrototype } from "game/utils";
import { Creep } from "game/prototypes";
import { ERR_NOT_IN_RANGE } from "game/constants";

export function loop() {
	var myCreep = getObjectsByPrototype(Creep).find((creep) => creep.my);
	var enemyCreep = getObjectsByPrototype(Creep).find((creep) => !creep.my);
	if (myCreep.attack(enemyCreep) == ERR_NOT_IN_RANGE) {
		myCreep.moveTo(enemyCreep);
	}
}

// Defeat the enemy creep (using attack. ranged_attack, etc)
import { getObjectsByPrototype } from "game/utils";
import { Creep } from "game/prototypes";
import { ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL } from "game/constants";

export function loop() {
	var myCreeps = getObjectsByPrototype(Creep).filter((creep) => creep.my);
	var enemyCreep = getObjectsByPrototype(Creep).find((creep) => !creep.my);

	for (var creep of myCreeps) {
		if (creep.body.some((bodyPart) => bodyPart.type == ATTACK)) {
			if (creep.attack(enemyCreep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(enemyCreep);
			}
		}
		if (creep.body.some((bodyPart) => bodyPart.type == RANGED_ATTACK)) {
			if (creep.rangedAttack(enemyCreep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(enemyCreep);
			}
		}
		if (creep.body.some((bodyPart) => bodyPart.type == HEAL)) {
			var myDamagedCreeps = myCreeps.filter((i) => i.hits < i.hitsMax);
			if (myDamagedCreeps.length > 0) {
				if (creep.heal(myDamagedCreeps[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(myDamagedCreeps[0]);
				}
			}
		}
	}
}

// resource energy, build structures, spawn creeps, and perform other activites. using Tower to defeat enemy at distance
import { prototypes, utils, constants } from "game";

export function loop() {
	const tower = utils.getObjectsByPrototype(prototypes.StructureTower)[0];
	if (tower.store[constants.RESOURCE_ENERGY] < 10) {
		var myCreep = utils
			.getObjectsByPrototype(prototypes.Creep)
			.find((creep) => creep.my);
		if (myCreep.store[constants.RESOURCE_ENERGY] == 0) {
			var container = utils.getObjectsByPrototype(
				prototypes.StructureContainer,
			)[0];
			myCreep.withdraw(container, constants.RESOURCE_ENERGY);
		} else {
			myCreep.transfer(tower, constants.RESOURCE_ENERGY);
		}
	} else {
		var target = utils
			.getObjectsByPrototype(prototypes.Creep)
			.find((creep) => !creep.my);
		tower.attack(target);
	}
}

// using terrains such as plain terrian, natural indestructible walls, constructred destructible walls, swamps, roads
import { getObjectsByPrototype } from "game/utils";
import { Creep, Flag } from "game/prototypes";

export function loop() {
	var creeps = getObjectsByPrototype(Creep).filter((i) => i.my);
	var flags = getObjectsByPrototype(Flag);
	for (var creep of creeps) {
		var flag = creep.findClosestByPath(flags);
		creep.moveTo(flag);
	}
}

// creating creeps using 'Spawn' objective: spawn two creps and move ecah one onto a different flag
import { getObjectsByPrototype } from "game/utils";
import { Creep, Flag, StructureSpawn } from "game/prototypes";
import { MOVE } from "game/constants";

var creep1, creep2;

export function loop() {
	var mySpawn = getObjectsByPrototype(StructureSpawn)[0];
	var flags = getObjectsByPrototype(Flag);

	if (!creep1) {
		creep1 = mySpawn.spawnCreep([MOVE]).object;
	} else {
		creep1.moveTo(flags[0]);

		if (!creep2) {
			creep2 = mySpawn.spawnCreep([MOVE]).object;
		} else {
			creep2.moveTo(flags[1]);
		}
	}
}

// objective: harvest/ trasnfer 1000 energy to the spawn
import { prototypes, utils, constants } from "game";

export function loop() {
	var creep = utils.getObjectsByPrototype(prototypes.Creep).find((i) => i.my);
	var source = utils.getObjectsByPrototype(prototypes.Source)[0];
	var spawn = utils
		.getObjectsByPrototype(prototypes.StructureSpawn)
		.find((i) => i.my);

	if (creep.store.getFreeCapacity(constants.RESOURCE_ENERGY)) {
		if (creep.harvest(source) == constants.ERR_NOT_IN_RANGE) {
			creep.moveTo(source);
		}
	} else {
		if (
			creep.transfer(spawn, constants.RESOURCE_ENERGY) ==
			constants.ERR_NOT_IN_RANGE
		) {
			creep.moveTo(spawn);
		}
	}
}

// objective: build a tower. creep consumes energy and stores it goes back and forth between energy supply and construction site
import { prototypes, utils } from "game";
import { RESOURCE_ENERGY, ERR_NOT_IN_RANGE } from "game/constants";

export function loop() {
	const creep = utils.getObjectsByPrototype(prototypes.Creep).find((i) => i.my);
	if (!creep.store[RESOURCE_ENERGY]) {
		const container = utils.findClosestByPath(
			creep,
			utils.getObjectsByPrototype(prototypes.StructureContainer),
		);
		if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(container);
		}
	} else {
		const constructionSite = utils
			.getObjectsByPrototype(prototypes.ConstructionSite)
			.find((i) => i.my);
		if (!constructionSite) {
			utils.createConstructionSite(50, 55, prototypes.StructureTower);
		} else {
			if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
				creep.moveTo(constructionSite);
			}
		}
	}
}

// final tutorial
import { getObjectsByPrototype } from "game/utils";
import { Creep, Source, StructureSpawn } from "game/prototypes";
import {
	MOVE,
	WORK,
	RESOURCE_ENERGY,
	ERR_NOT_IN_RANGE,
	RANGED_ATTACK,
} from "game/constants";

export function loop() {
	var creeps = getObjectsByPrototype(Creep);
	var sources = getObjectsByPrototype(Source);
	var mySpawn = getObjectsByPrototype(StructureSpawn)[0];
	var enemyCreep = getObjectsByPrototype(Creep).find((creep) => !creep.my);

	for (var creep of creeps) {
		var source = creep.findClosestByPath(sources);
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source);
		}
		if (
			enemyCreep &&
			creep.body.some((bodyPart) => bodyPart.type == RANGED_ATTACK)
		) {
			if (creep.rangedAttack(enemyCreep) == ERR_NOT_IN_RANGE) {
			}
		}
	}
	if (mySpawn.store[RESOURCE_ENERGY] >= 250) {
		creep = mySpawn.spawnCreep([MOVE, WORK, RANGED_ATTACK]).object;
	}
}
