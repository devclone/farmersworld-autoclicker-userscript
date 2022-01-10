
// ==UserScript==
// @name			farmersworld
// @version			1.1.1
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
                saw: 15,
                chainSaw: 270,
                fishingRod: 150,
                fishingNet: 20,
                fishingBoat: 32,
                miningExcavator: 5,
            },
            energy: 470,
        },
        timer: true,
    };

    function waitForElement(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            while (document.querySelector(selector) === null) {
                yield new Promise((resolve) => requestAnimationFrame(resolve));
            }
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            return document.querySelector(selector);
        });
    }
    function handleModalClose() {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield waitForElement(".modal");
            if (modal) {
                const wrapper = document.querySelector(".wapper");
                setTimeout(() => {
                    wrapper.click();
                    logger("Modal is closed");
                }, 10000);
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

    function getToolObject(index) {
        const name = document.querySelector(".info-title-name").textContent;
        const countDown = document.querySelector(".card-container--time").textContent;
        const toolObj = {
            name,
            id: index,
            type: "mining",
            quantity: +document.querySelector(".info-title-level").textContent.split("/")[1],
            energyConsumed: +document.querySelectorAll(".info-description")[3].textContent,
            durabilityConsumed: +document.querySelectorAll(".info-description")[4].textContent,
            minDurability: config.minAmount.durability[sentenceToCamelCase(name)],
            countdown: handleCountDown(countDown),
        };
        return toolObj;
    }

    function getToolData(arrayOfToolNodes) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialArray = [];
            for (let index = 0; index < arrayOfToolNodes.length; index++) {
                arrayOfToolNodes[index].click();
                yield timer(4000);
                const toolObj = getToolObject(index);
                initialArray.push(toolObj);
            }
            return initialArray;
        });
    }

    function findItemWithLowestCd(arrayOfTools) {
        const toolWithLowestCD = arrayOfTools.reduce((prev, cur) => {
            return prev.countdown < cur.countdown ? prev : cur;
        });
        return toolWithLowestCD;
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
            if (energyModal) {
                const plusEnergyButton = document.querySelector('img[alt="Plus Icon"]');
                const pointsPerFood = 5;
                const foodRequired = Math.floor((Number(maxCapEnergy) - currentEnergy) / pointsPerFood);
                if (currentFood >= foodRequired) {
                    // DO FULL ENERGY RESTORE
                    for (let i = 0; i < foodRequired; i++) {
                        plusEnergyButton.click();
                    }
                    logger(`Total energy restored: ${pointsPerFood * foodRequired}, food spent: ${foodRequired}`);
                }
                else {
                    // DO ENERGY RESTORE WITH AVAILABLE AMOUNT OF FOOD
                    for (let i = 0; i < Math.floor(currentFood); i++) {
                        plusEnergyButton.click();
                    }
                    logger(`Total energy restored: ${pointsPerFood * Math.floor(currentFood)}, food spent: ${Math.floor(currentFood)}`);
                }
                const exchangeButton = yield waitForElement(".plain-button.long:not(.disabled)");
                exchangeButton.click();
            }
            yield timer(5000);
            if (energyContent.textContent === `${maxCapEnergy} /${maxCapEnergy}`) {
                logger("Energy restore action is SUCCESSFUL");
                response = true;
                return response;
            }
            else {
                handleEnergyRestore(currentEnergy);
            }
        });
    }
    function checkIfOneMoreClickIsAvailable(currentTool, currentValue, action) {
        let response;
        switch (action) {
            case "durability":
                if (currentValue > currentTool.durabilityConsumed) {
                    response = true;
                }
                else {
                    response = false;
                }
                break;
            case "energy":
                if (currentValue > currentTool.energyConsumed) {
                    response = true;
                }
                else {
                    response = false;
                }
                break;
        }
        return response;
    }
    function checkLimitsHandler(currentTool) {
        return __awaiter(this, void 0, void 0, function* () {
            const clicker = document.getElementById("#auto-clicker");
            let response;
            logger("---===Limit check Action Performing===---");
            const currentEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[0];
            if (currentEnergy <= config.minAmount.energy) {
                logger(`Current energy (${currentEnergy}) less than or equal to specified limit (${config.minAmount.energy})`);
                const energyRestoreResult = yield handleEnergyRestore(currentEnergy);
                logger("await energy restore?");
                if (!energyRestoreResult) {
                    const checker = checkIfOneMoreClickIsAvailable(currentTool, currentEnergy, "energy");
                    if (!checker) {
                        clicker.textContent = "Auto-Click deactivated(fail occurred)";
                        logger("You dont have enough energy to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
                        response = false;
                    }
                }
            }
            const currentDurability = +document.querySelector(".card-number").textContent.split("/")[0];
            if (currentDurability <= config.minAmount.durability[sentenceToCamelCase(currentTool.name)]) {
                logger(`Current durability (${currentDurability}) less than or equal to specified limit (${config.minAmount.durability[sentenceToCamelCase(currentTool.name)]}), repairing...`);
                const toolRepairResult = yield handleToolRepair();
                if (!toolRepairResult) {
                    const checker = checkIfOneMoreClickIsAvailable(currentTool, currentDurability, "durability");
                    if (!checker) {
                        clicker.textContent = "Auto-Click deactivated(fail occurred)";
                        logger("You dont have enough durability to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
                        response = false;
                    }
                }
            }
            logger("Limit check action SUCCESSFUL");
            response = true;
            return response;
        });
    }

    function labelInit() {
        const container = document.querySelector(".game-container");
        const divWrapper = document.createElement("div");
        divWrapper.classList.add("label");
        divWrapper.id = "auto-clicker";
        divWrapper.style.top = "50px";
        divWrapper.style.left = "50%";
        divWrapper.style.transform = "translateX(-50%)";
        divWrapper.style.border = "1px solid transparent";
        divWrapper.style.borderRadius = "5px";
        divWrapper.style.padding = "3px 8px";
        divWrapper.style.backgroundColor = "#D1A79D";
        divWrapper.style.position = "absolute";
        divWrapper.style.color = "#fafafa";
        divWrapper.style.fontSize = "15px";
        divWrapper.style.display = "flex";
        divWrapper.style.flexDirection = "column";
        const divTitle = document.createElement("div");
        divTitle.classList.add("label__title");
        divTitle.innerText = `Auto-Clicker activated`;
        const divContent = document.createElement("div");
        divContent.classList.add("label__content");
        container.appendChild(divWrapper);
        divWrapper.appendChild(divTitle);
        divWrapper.appendChild(divContent);
    }
    function labelTimer(string, ms) {
        const end = Date.now() + ms;
        const interval = setInterval(() => {
            const content = document.querySelector(".label__content");
            let start = Date.now();
            let diff = end - start;
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((diff % (1000 * 60)) / 1000);
            content.innerHTML =
                string +
                    " " +
                    `in ${hours > 0 ? hours + (hours > 1 ? " hours" : " hour") : ""} ${minutes > 0 ? minutes + (minutes > 1 ? " mins" : " min") : ""} ${seconds > 0 ? seconds + (seconds > 1 ? " seconds" : " second") : ""}`.trim();
            if (diff < 0) {
                clearInterval(interval);
                content.innerHTML = string + " EXPIRED";
            }
        }, 1000);
    }

    function handleClickOnMineButton(arrayOfToolNodes, toolWithLowestCd, toolData) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Check if 'Mine' button is available
            const mineButton = document.querySelector(".button-section");
            if (mineButton.textContent !== "Mine") {
                const countDownString = document.querySelector(".card-container--time").textContent;
                const countDown = handleCountDown(countDownString);
                const visibleToolName = document.querySelector(".info-title-name").textContent;
                console.log(toolData);
                console.log(toolWithLowestCd.name, visibleToolName);
                if (toolWithLowestCd.name !== visibleToolName) {
                    logger("Names doesn't matches, searching for tool with lowest cd again...");
                    return clickHandler(arrayOfToolNodes, toolData);
                }
                else {
                    logger(`CD diff ${msToTime(toolData[1].countdown - toolData[0].countdown)}`);
                    logger(`[${toolWithLowestCd.name}: id ${toolWithLowestCd.id}] Mine button not active yet, the click action will be performed in ${msToTime(countDown)}`);
                    labelTimer(`Next click: ${toolWithLowestCd.name} [id ${toolWithLowestCd.id}]`, countDown);
                    return setTimeout(() => {
                        handleClickOnMineButton(arrayOfToolNodes, toolWithLowestCd, toolData);
                    }, countDown);
                }
            }
            // 2) Check resources
            const checkedResult = yield checkLimitsHandler(toolWithLowestCd);
            // 3) Click action
            if (checkedResult) {
                logger("---===Click Action Performing===---");
                mineButton.click();
                yield handleModalClose();
                logger(`Mine button click on ${toolWithLowestCd.name}[id:${toolWithLowestCd.id}] is SUCCESSFUL`);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const newToolData = yield getToolData(arrayOfToolNodes);
                    clickHandler(arrayOfToolNodes, newToolData);
                }), 10000);
            }
        });
    }
    function clickHandler(arrayOfToolNodes, toolData) {
        const toolWithLowestCd = findItemWithLowestCd(toolData);
        arrayOfToolNodes[toolWithLowestCd.id].click();
        setTimeout(() => handleClickOnMineButton(arrayOfToolNodes, toolWithLowestCd, toolData), 3000);
    }

    function activateAutoClicker() {
        return __awaiter(this, void 0, void 0, function* () {
            const isGameLoaded = yield waitForElement(".button-section");
            if (!isGameLoaded) {
                return logger("Error with login occurred");
            }
            logger("Auto-Click script is running...");
            labelInit();
            const arrayOfToolNodes = document.querySelector("section.vertical-carousel-container").children;
            const initialToolsData = yield getToolData(arrayOfToolNodes);
            if (initialToolsData) {
                logger("Initial Tool data is complete");
                clickHandler(arrayOfToolNodes, initialToolsData);
            }
        });
    }
    activateAutoClicker();

})();
