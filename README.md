[![Release](https://img.shields.io/github/v/release/coke5151/probability-independent-study)](https://github.com/coke5151/probability-independent-study/releases)
[![License](https://img.shields.io/github/license/coke5151/probability-independent-study)](LICENSE)
[![Stars](https://img.shields.io/github/stars/coke5151/probability-independent-study)]()

# 機率自主學習模擬程式 (課號 2355)

## 組員

- 電資二 4112064214 侯竣奇
- 電資二 4112064205 鄭弘翊

## 作業說明

透過程式模擬統計出以下四個題目的機率是否靠近數學推理的精確值：

1. [Bertrand paradox](https://en.wikipedia.org/wiki/Bertrand_paradox_(probability))
2. [Catalan number and its extension](https://en.wikipedia.org/wiki/Catalan_number)
3. [Secretary problem](https://en.wikipedia.org/wiki/Secretary_problem)
4. [Prisoners' problem](https://en.wikipedia.org/wiki/100_prisoners_problem)

# How to run?

- 方法一：安裝好 Go、Wails 後自行編譯
- 方法二：下載 Release 的程式

## Environment

- Backend: Go
- Frontend: React with TypeScript
- GUI: Wails V2
- Compile command: `wails build -webview2 embed -platform darwin,darwin/amd64,darwin/arm64,darwin/universal,windows,windows/amd64,windows/arm64,linux,linux/amd64,linux/arm64`
