'use strict';

const $ = (selector) => document.querySelector(selector);

const memorySize = 256;

const asciiCodeSize = 128;

document.addEventListener("DOMContentLoaded", () => {
  const bfCode = window.sessionStorage.getItem(["bfCode"]);
  if (bfCode) {
    $(".container__code textarea").value = bfCode;
  }

  for (let i = 0; i < memorySize; i++) {
    $(".inner__memory_view").insertAdjacentHTML("beforeend", `
      <div class="component__memory memory_num_${i}">
        <div class="memory_content">
          <div class="code">
            <p>0</p>
          </div>
          <div class="chara">
            <p>${String.fromCharCode(1)}</p>
          </div>
        </div>
        <div class="memory_num">${i}</div>
      </div>
    `);
  }
  for (let i = 0; i < 5; i++) {
    $(".inner__memory_view").insertAdjacentHTML("beforeend", `
      <div class="component__memory memory_spacer_${i}"></div>
    `);
  }
})

$(".container__code textarea").addEventListener("input", () => {
  const bfCode = $(".container__code textarea").value;
  window.sessionStorage.setItem(["bfCode"], [bfCode]);
});

$("button.button__clear").addEventListener("click", () => {
  $(".container__code textarea").value = "";
  window.sessionStorage.setItem(["bfCode"], []);
})

$(".button__run").addEventListener("click", () => {
  const bfCode = $(".container__code textarea").value;
  const bfCodeLength = bfCode.length;
  console.log(bfCode);

  const inputCharas = $(".container__input textarea").value;
  let inputPtr = 0;

  let bfCodeList = Array(memorySize).fill(0);;
  let bfCodePtr = 0;
  let loopBeforeIndex = -1;

  let runResult = "";

  let i = 0;
  for ( ;; ) {
    const bfCodeCommand = bfCode[i];

    if (loopBeforeIndex > -9999) {
      switch (bfCodeCommand) {
        case ">":
          bfCodePtr = (bfCodePtr + 1) % memorySize;
          break;
        case "<":
          bfCodePtr = (bfCodePtr - 1) % memorySize;
          break;

        case "+":
          bfCodeList[bfCodePtr] = (bfCodeList[bfCodePtr] + 1) % asciiCodeSize;
          break;
        case "-":
          bfCodeList[bfCodePtr] = (bfCodeList[bfCodePtr] - 1) % asciiCodeSize;
          if (bfCodeList[bfCodePtr] < 0) bfCodeList[bfCodePtr] = asciiCodeSize + bfCodeList[bfCodePtr];
          break;

        case ".":
          runResult += String.fromCharCode(bfCodeList[bfCodePtr]);
          break;
        case ",":
          bfCodeList[bfCodePtr] = inputCharas.charCodeAt(inputPtr);
          inputPtr += 1;
          break;

        default:
          break;
      }
    }

    switch (bfCodeCommand) {
      case "[":
        if (bfCodeList[bfCodePtr] > 0) {
          loopBeforeIndex = i;
        } else {
          loopBeforeIndex = -9999;
        }
        break;
      case "]":
        if (bfCodeList[bfCodePtr] <= 0) {
          loopBeforeIndex = -1
        } else {
          i = loopBeforeIndex;
        }
        break;
      default:
        break
    }

    i += 1;
    if (i >= bfCodeLength) break;
  }

  $(".container__output textarea").value = runResult;
  console.log(bfCodeList);

  for (let i = 0; i < bfCodeList.length; i++) {
    $(`.memory_num_${i} .code p`).innerText = bfCodeList[i];
    $(`.memory_num_${i} .chara p`).innerText = String.fromCharCode(bfCodeList[i]);
  }
});
