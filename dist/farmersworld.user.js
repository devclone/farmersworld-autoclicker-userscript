
// ==UserScript==
// @name			farmersworld
// @version			1.0.0
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
                saw: 15,
                fishingRod: 5,
                ancientStoneAxe: 1,
            },
            energy: 470,
        },
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
    function appendLabel() {
        const container = document.querySelector(".game-container");
        const label = document.createElement("div");
        label.id = "auto-clicker";
        label.innerText = `Auto-Clicker activated`;
        label.style.top = "50px";
        label.style.left = "50%";
        label.style.transform = "translateX(-50%)";
        label.style.border = "1px solid transparent";
        label.style.borderRadius = "5px";
        label.style.padding = "3px 8px";
        label.style.backgroundColor = "#D1A79D";
        label.style.position = "absolute";
        label.style.color = "#fafafa";
        label.style.fontSize = "15px";
        container.appendChild(label);
    }

    const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    function handleChargeTime(string) {
        const array = string.split(" ");
        // const newArray = array.map((item) => {
        //   console.log(item);
        //   let seconds;
        //   switch (item[1]) {
        //     case ("hours", "hour"):
        //       seconds = +item[0] * 3600;
        //       console.log(seconds);
        //       break;
        //     case "mins":
        //       seconds = +item[0] * 60;
        //       console.log(seconds);
        //       break;
        //     default:
        //       seconds = +item[0];
        //       console.log(seconds);
        //       break;
        //   }
        //   return seconds;
        // });
        return +array[0] * 60 * 1000 + 5 * 1000;
    }
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
        const hours = seconds / 3600; // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        const minutes = seconds / 60; // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return `${hours > 0 ? hours + " hours" : ""} ${minutes > 0 ? minutes + " minutes" : ""} ${seconds > 0 ? seconds + " seconds" : ""}`.trim();
    }

    function getToolData(domArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialArray = [];
            for (let index = 0; index < domArray.length; index++) {
                domArray[index].click();
                yield timer(2000);
                const name = document.querySelector(".info-title-name").textContent;
                const countDown = document.querySelector(".card-container--time").textContent;
                const chargeTime = document.querySelectorAll(".info-description")[2].textContent;
                const toolObj = {
                    name,
                    id: index,
                    quantity: +document.querySelector(".info-title-level").textContent.split("/")[1],
                    energyConsumed: +document.querySelectorAll(".info-description")[3].textContent,
                    durabilityConsumed: +document.querySelectorAll(".info-description")[4].textContent,
                    minDurability: config.minAmount.durability[sentenceToCamelCase(name)],
                    countdown: handleCountDown(countDown),
                    chargeTime: handleChargeTime(chargeTime),
                };
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

    // async function handleToolRepair(currentDurability) {
    //   let response;
    //   if (currentDurability <= minAmount.durability) {
    //     logger(
    //       `Current durability (${currentDurability}) less than or equal to specified limit (${minAmount.durability}), repairing...`
    //     );
    //     const repairButton = document.querySelectorAll(
    //       ".plain-button.semi-short"
    //     )[1];
    //     if (repairButton.className.includes("disabled")) {
    //       logger(
    //         `You dont have enough gold to perform repair action\/nTool repair action is FAILED`
    //       );
    //       response = false;
    //       return response;
    //     }
    //     logger(`---===Tool Repair Action Performing===---`);
    //     setTimeout(() => {
    //       repairButton.click();
    //     }, 5000);
    //     logger("Tool has been repaired");
    //   }
    //   response = true;
    //   return response;
    // }
    function handleEnergyRestore(currentEnergy, maxCapEnergy) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (currentEnergy <= config.minAmount.energy) {
                logger(`Current energy (${currentEnergy}) less than or equal to specified limit (${config.minAmount.energy})`);
                const currentFood = +document.querySelectorAll(".resource-number")[2].textContent;
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
                    const foodRequired = Math.floor((maxCapEnergy - currentEnergy) / pointsPerFood);
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
                const exchangeSuccess = yield waitForElement(".flash-container");
                if (exchangeSuccess) {
                    logger("Energy restore action is SUCCESSFUL");
                }
            }
            response = true;
            return response;
        });
    }
    function checkIfOneMoreClickIsAvailable(currentTool, currentValue, action) {
        let response;
        const durabilityPerClick = +document.querySelectorAll(".info-description")[4];
        switch (action) {
            case "durability":
                if (currentValue > durabilityPerClick) {
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
    function checkResources(currentTool) {
        return __awaiter(this, void 0, void 0, function* () {
            // const currentDurability = +document
            //   .querySelector(".card-number")
            //   .textContent.split("/")[0];
            const currentEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[0];
            const maxCapEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[1];
            if (
            // currentDurability <= minAmount.durability ||
            currentEnergy <= config.minAmount.energy) {
                const clicker = document.getElementById("#auto-clicker");
                const energyRestoreResult = yield handleEnergyRestore(currentEnergy, maxCapEnergy);
                if (!energyRestoreResult) {
                    const checker = checkIfOneMoreClickIsAvailable(currentTool, currentEnergy, "energy");
                    if (!checker) {
                        clicker.textContent = "Auto-Click deactivated(fail occurred)";
                        logger("You dont have enough energy to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
                        return;
                    }
                }
                // const toolRepairResult = await handleToolRepair(currentDurability);
                // if (!toolRepairResult) {
                //   const checker = checkIfOneMoreClickIsAvalible(
                //     currentDurability,
                //     "durability"
                //   );
                //   if (!checker) {
                //     clicker.textContent = "Auto-Click deactivated(fail occurred)";
                //     logger(
                //       "You dont have enough durability to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down..."
                //     );
                //     return;
                //   }
                // }
            }
        });
    }

    function handleClickOnMineButton(currentTool, dataArray) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Check if 'Mine' button is available
            const mineButton = document.querySelector(".button-section");
            const arrayOfToolsDOM = document.querySelector("section.vertical-carousel-container").children;
            if (mineButton.textContent !== "Mine") {
                const countDownString = document.querySelector(".card-container--time").textContent;
                const countDown = handleCountDown(countDownString);
                const toolWithLowestCd = findItemWithLowestCd(dataArray);
                logger(`Current tool [${currentTool.name}:id${currentTool.id}]: Tool with lowest CD [${currentTool.name}:id${currentTool.id}]`);
                console.log(dataArray);
                if (toolWithLowestCd.id === currentTool.id) {
                    logger(`[${currentTool.name}:id${currentTool.id}] Mine button not active yet, the click action will be performed in ${msToTime(countDown)}`);
                    setTimeout(() => {
                        handleClickOnMineButton(currentTool, dataArray);
                    }, countDown);
                }
                else {
                    logger(`[debugger] on click fail]`);
                    console.log(dataArray);
                    findLowestCdAndClick(arrayOfToolsDOM, dataArray);
                }
                return;
            }
            //  2) Check resources
            checkResources(currentTool);
            logger("---===Click Action Performing===---");
            mineButton.click();
            yield handleModalClose();
            logger(`Mine button click on ${currentTool.name}[id:${currentTool.id}] is SUCCESSFUL`);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const updatedData = yield getToolData(arrayOfToolsDOM);
                findLowestCdAndClick(arrayOfToolsDOM, updatedData);
            }), 10000);
        });
    }
    function findLowestCdAndClick(domArray, dataArray) {
        const toolWithLowestCD = findItemWithLowestCd(dataArray);
        console.log(toolWithLowestCD);
        domArray[toolWithLowestCD.id].click();
        setTimeout(() => handleClickOnMineButton(toolWithLowestCD, dataArray), 3000);
    }

    // CONFIG
    function activateAutoClicker() {
        return __awaiter(this, void 0, void 0, function* () {
            const isGameLoaded = yield waitForElement(".button-section");
            if (!isGameLoaded) {
                return logger("Error with login occurred");
            }
            logger("Auto-Click script is running...");
            appendLabel();
            // If login succeed, then get info about all tools
            const arrayOfToolsDOM = document.querySelector("section.vertical-carousel-container").children;
            const initialToolsData = yield getToolData(arrayOfToolsDOM);
            if (initialToolsData) {
                logger("Initial Tool data is complete");
                console.log(initialToolsData);
                findLowestCdAndClick(arrayOfToolsDOM, initialToolsData);
            }
        });
    }
    activateAutoClicker();

})();
