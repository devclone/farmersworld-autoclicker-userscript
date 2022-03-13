
// ==UserScript==
// @name			farmersworld
// @version			1.2.0
// @author			splash07
// @grant			none
// @match			https://play.farmersworld.io/
// @namespace		http://tampermonkey.net/
//
// Created with love using Gorilla
// ==/UserScript==

(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const config = {
        minAmount: {
            durability: {
                ancientStoneAxe: 24,
                stoneAxe: 3,
                axe: 5,
                saw: 45,
                chainsaw: 270,
                fishingRod: 50,
                fishingNet: 20,
                fishingBoat: 32,
                miningExcavator: 5,
            },
            energy: 120,
        },
        timer: true,
    };

    const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    function handleCountDown(string) {
        // convert string to ms
        const delay = 5;
        const arr = string.split(":");
        const ms = (Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2])) * 1000 + delay * 1000;
        return ms;
    }
    function msToTime(ms) {
        // 1- Convert to seconds:
        let seconds = ms / 1000;
        // 2- Extract hours:
        const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return `${hours > 0 ? hours + (hours > 1 ? " hours" : " hour") : ""} ${minutes > 0 ? minutes + (minutes > 1 ? " mins" : " min") : ""} ${seconds > 0 ? seconds + (seconds > 1 ? " seconds" : " second") : ""}`.trim();
    }

    function waitForElement(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            while (document.querySelector(selector) === null) {
                yield new Promise((resolve) => requestAnimationFrame(resolve));
            }
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            return document.querySelector(selector);
        });
    }
    function handleModalClose() {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield waitForElement(".modal");
            if (modal) {
                const wrapper = document.querySelector(".wapper");
                wrapper.click();
                yield timer(1000);
                logger("Modal is closed");
                return true;
            }
        });
    }
    function logger(string) {
        const date = new Date().toTimeString().split(" ")[0];
        return console.log(`[${date}] ${string}`);
    }
    function sentenceToCamelCase(string) {
        return string
            .split(" ")
            .map((word, index) => (index === 0 ? word.toLowerCase() : word))
            .join("");
    }

    function handleToolRepair() {
        return __awaiter(this, void 0, void 0, function* () {
            const durabilityContent = document.querySelector(".content");
            const maxDurability = durabilityContent.textContent.split("/ ")[1];
            const repairButton = document.querySelectorAll(".plain-button.semi-short")[1];
            let response;
            // if repair button is disabled, then return false
            if (repairButton.className.includes("disabled")) {
                logger(`You dont have enough gold to perform repair action. Tool repair action is FAILED`);
                response = false;
                return response;
            }
            logger(`---===Tool Repair Action Performing===---`);
            repairButton.click();
            yield timer(5000);
            if (durabilityContent.textContent === `${maxDurability}/ ${maxDurability}`) {
                logger("Tool repair action is SUCCESSFUL");
                response = true;
                return response;
            }
            else {
                handleToolRepair();
            }
        });
    }
    function handleEnergyRestore(currentEnergy) {
        return __awaiter(this, void 0, void 0, function* () {
            const energyContent = document.querySelectorAll(".resource-number")[3];
            const maxCapEnergy = energyContent.textContent.split(" /")[1];
            const currentFood = +document.querySelectorAll(".resource-number")[2].textContent;
            let response;
            if (currentFood < 1) {
                logger(`You need at least 1 whole piece of food to perform energy restoration action\/n Energy restore action is FAILED`);
                response = false;
                return response;
            }
            logger(`---===Energy Restore Action Performing===---`);
            const addEnergyButton = document.querySelector(".resource-energy--plus");
            addEnergyButton.click();
            const energyModal = yield waitForElement(".exchange-modal");
            let result;
            if (energyModal) {
                const plusEnergyButton = document.querySelector('img[alt="Plus Icon"]');
                const pointsPerFood = 5;
                const foodRequired = Math.floor((Number(maxCapEnergy) - currentEnergy) / pointsPerFood);
                if (currentFood >= foodRequired) {
                    // DO FULL ENERGY RESTORE
                    for (let i = 0; i < foodRequired; i++) {
                        plusEnergyButton.click();
                    }
                    result = `Total energy restored: ${pointsPerFood * foodRequired}, food spent: ${foodRequired}`;
                }
                else {
                    // DO ENERGY RESTORE WITH AVAILABLE AMOUNT OF FOOD
                    for (let i = 0; i < Math.floor(currentFood); i++) {
                        plusEnergyButton.click();
                    }
                    result = `Total energy restored: ${pointsPerFood * Math.floor(currentFood)}, food spent: ${Math.floor(currentFood)}`;
                }
                const exchangeButton = yield waitForElement(".plain-button.long:not(.disabled)");
                exchangeButton.click();
            }
            yield timer(5000);
            if (energyContent.textContent === `${maxCapEnergy} /${maxCapEnergy}`) {
                logger(result);
                logger("Energy restore action is SUCCESSFUL");
                response = true;
                return response;
            }
            else {
                handleEnergyRestore(currentEnergy);
            }
        });
    }
    function checkIfOneMoreClickIsAvailable(currentItem, currentValue, action) {
        let response;
        switch (action) {
            case "durability":
                if (currentValue > currentItem.durabilityConsumed) {
                    response = true;
                }
                else {
                    response = false;
                }
                break;
            case "energy":
                if (currentValue > currentItem.energyConsumed) {
                    response = true;
                }
                else {
                    response = false;
                }
                break;
        }
        return response;
    }
    function checkLimitsHandler(currentItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const clicker = document.getElementById("#auto-clicker");
            let response;
            if (currentItem.type !== "tool") {
                response = true;
                return response;
            }
            const currentEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[0];
            if (currentEnergy <= config.minAmount.energy) {
                logger("---===Limit check Action Performing===---");
                logger(`Current energy (${currentEnergy}) less than or equal to specified limit (${config.minAmount.energy})`);
                const energyRestoreResult = yield handleEnergyRestore(currentEnergy);
                if (!energyRestoreResult) {
                    const checker = checkIfOneMoreClickIsAvailable(currentItem, currentEnergy, "energy");
                    if (!checker) {
                        clicker.textContent = "Auto-Click deactivated(fail occurred)";
                        logger("You dont have enough energy to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
                        response = false;
                    }
                }
            }
            const currentDurability = +document.querySelector(".card-number").textContent.split("/")[0];
            if (currentDurability <= config.minAmount.durability[sentenceToCamelCase(currentItem.name)]) {
                logger("---===Limit check Action Performing===---");
                logger(`Current durability (${currentDurability}) less than or equal to specified limit (${config.minAmount.durability[sentenceToCamelCase(currentItem.name)]}), repairing...`);
                const toolRepairResult = yield handleToolRepair();
                if (!toolRepairResult) {
                    const checker = checkIfOneMoreClickIsAvailable(currentItem, currentDurability, "durability");
                    if (!checker) {
                        clicker.textContent = "Auto-Click deactivated(fail occurred)";
                        logger("You dont have enough durability to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
                        response = false;
                    }
                }
            }
            response = true;
            return response;
        });
    }

    function handleItemsData(arrayOfToolNodes) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialArray = [];
            for (let index = 0; index < arrayOfToolNodes.length; index++) {
                arrayOfToolNodes[index].click();
                yield timer(3000);
                const toolObj = makeItemObject(index);
                initialArray.push(toolObj);
            }
            return initialArray;
        });
    }
    function makeItemObject(index) {
        var _a, _b, _c;
        const name = document.querySelector(".info-title-name").textContent;
        const id = index;
        const countDown = handleCountDown(document.querySelector(".card-container--time").textContent);
        const isMember = name.toLowerCase().includes("member");
        const minDurability = config.minAmount.durability[sentenceToCamelCase(name)];
        const energyConsumed = +((_a = document.querySelectorAll(".info-description")[3]) === null || _a === void 0 ? void 0 : _a.textContent);
        const durabilityConsumed = +((_b = document.querySelectorAll(".info-description")[4]) === null || _b === void 0 ? void 0 : _b.textContent);
        const charges = +((_c = document.querySelector(".info-title-level")) === null || _c === void 0 ? void 0 : _c.textContent.split("/")[0]);
        if (isMember) {
            const resultMemberData = {
                name,
                type: "member",
                countDown,
                id,
            };
            return resultMemberData;
        }
        const resultToolData = {
            name,
            id,
            type: "tool",
            countDown,
            minDurability,
            energyConsumed,
            durabilityConsumed,
            charges,
        };
        return resultToolData;
    }
    function findItemWithLowestCd(arrayOfItems) {
        const item = arrayOfItems.reduce((prev, cur) => {
            return prev.countDown < cur.countDown ? prev : cur;
        });
        return item;
    }

    function navigateToItem(arrayOfNodes, id) {
        return __awaiter(this, void 0, void 0, function* () {
            arrayOfNodes[id].click();
            yield timer(3000);
        });
    }

    const handleClick = (arrayOfItemNodes, itemsData, currentItem) => __awaiter(void 0, void 0, void 0, function* () {
        const mainButton = document.querySelector(".button-section");
        if (mainButton.textContent.toLocaleLowerCase() === "countdown") {
            return handleDisabledButton(arrayOfItemNodes, itemsData, currentItem);
        }
        const clickIsPossible = yield checkLimitsHandler(currentItem);
        if (clickIsPossible) {
            handleActiveButton(arrayOfItemNodes, currentItem, mainButton);
        }
    });
    const handleActiveButton = (arrayOfItemNodes, currentItem, button) => __awaiter(void 0, void 0, void 0, function* () {
        logger("---===Click Action Performing===---");
        button.click();
        const isModalClosed = yield handleModalClose();
        if (isModalClosed) {
            if (button.textContent.toLowerCase() === "countdown") {
                logger(`Mine button click on ${currentItem.name}[id:${currentItem.id}] is SUCCESSFUL`);
                return setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    const newItemsData = yield handleItemsData(arrayOfItemNodes);
                    if (newItemsData) {
                        proceedToLowestCDAndClick(arrayOfItemNodes, newItemsData);
                    }
                }), 4000);
            }
            logger("Button still active, retry click");
            handleActiveButton(arrayOfItemNodes, currentItem, button);
        }
    });
    const handleDisabledButton = (arrayOfItemNodes, itemsData, currentItem) => {
        const countDownString = document.querySelector(".card-container--time").textContent;
        const countDown = handleCountDown(countDownString);
        const visibleItemName = document.querySelector(".info-title-name").textContent;
        if (visibleItemName !== currentItem.name) {
            proceedToLowestCDAndClick(arrayOfItemNodes, itemsData);
        }
        logger(`[${currentItem.name}: id ${currentItem.id}] Mine button not active yet, the click action will be performed in ${msToTime(countDown)}`);
        return setTimeout(() => {
            handleClick(arrayOfItemNodes, itemsData, currentItem);
        }, countDown);
    };
    const proceedToLowestCDAndClick = (arrayOfItemNodes, itemsData) => __awaiter(void 0, void 0, void 0, function* () {
        const item = findItemWithLowestCd(itemsData);
        yield navigateToItem(arrayOfItemNodes, item.id);
        handleClick(arrayOfItemNodes, itemsData, item);
    });

    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            const isGameLoaded = yield waitForElement(".button-section");
            if (!isGameLoaded) {
                return logger("Error with login occurred");
            }
            logger("Auto-Click script is running...");
            const arrayOfItemNodes = document.querySelector("section.vertical-carousel-container").children;
            const initialItemsData = yield handleItemsData(arrayOfItemNodes);
            if (initialItemsData) {
                console.log(initialItemsData);
                proceedToLowestCDAndClick(arrayOfItemNodes, initialItemsData);
            }
        });
    }
    init();

})();
