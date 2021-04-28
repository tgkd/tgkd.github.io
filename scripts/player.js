class Player {
  constructor() {
    this.player = null;
    this.playerButton = null;
    this.buttons = {
      play:
        '<img src="data:image/png;base64,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" />',
      pause:
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUPSURBVHgB7Z2NkdM8EIY3VJAO0FcB18FnaAA64DqADi4dkA4OKjhogFwF/DRwMg1wqYAXCfnAhHi1liVbtvXMaDwTRbG02axWsnZDVCgUCoVCoTAGG8oMAFtzqUx5bMqFKaop1Lo+cDSlbl2/mPLVXjebzZEKf2OEW5myN0UjHp9NubafTWumJdx7pEevTuhmsC9MOWA6rKa/pKXSCFgjHzSWJHA4E3FAvmhTFM0V0/mtKW8wH64oIUncOzgNOdC/7pgU65r9dtXIuW71mfdtm6LIuYJPmuuWwqhNeWpcw5pyxwj5JcI8CTtJ7RDBM8Awd9H2/TXljP35oR/3jUAqSoT57AtT3qI/SU1JMOhnj62ArfaG/sRD+qcCBP6GcgJuMSDlBhPO8gECv6YcgFyTNTJamZm+XEJuw6fVbMht8gEjmgkpcNp9IxzDNDbb3PiVsIM7yhy4+ULCuCvJRhMkLlzeblILobDtmBWNBWS27ZJmBpzd9qExhhmEzC7PRpNPsX0XjC/t5AhnMnzsaOZAZkYqSgX8JuOGFgL8O44HSgH89ktjztuNJ8DtPmrPmF9QbAQ3XdxTC7jNKVa5KCYCbc5jmZoA+Bc0zykWcFuYHIoWCvxrhji2Gv6fTxRthrOJ7afi9not+RKHtBX2zeeFVDQU+He6FA0ETmt0x+fb17cp2vbo3xa8Vu9pKOAnwVja7Psy9yna9uzjnrnHPQ0BfrNxQRGAf9/kPkXbnn30yaKiUMBrSzTXBgJStA3op2Zuw/5yHnk++wlT94HWxzumjnXzOgUNN4lwpuE9rY9bpk6BmXg5jeaEfNxsNre0Mpoxc8eB/++qCBX0F1ov3Nj/66oIFfRXWi/c2DvnNE7Qj5m6otHnUV0VnKC5FVVN66Vm6lRXxaOQRsRPCEunpgBCNboE4pxHdVX4FiyFSBRBj0QR9Ehwgq6pcI6guStUoxWtlyC3N1SjFa0XxdQFafQ3pi7Khv9M4cZed1VwguaWmtw+9dLhxt65DxJqOopGn6dTOTlB3zJ1W6wpgL2hGTM3GfYXdJPvoqZuKlof3Fk7NkeIz73jngvGOwo1H7gxs1vHPkFzzwUvIpqP44D6IW3FwB2tUMxbuAe3vKAFz8hiHVt956l/n6htH14zdfXgZ6jwnNBBvCNXuuMe9nWVom2P/vkiHYaf2IL/hM6OIoA/Ea3tg4p7yRc5pK2wb75jZxXFAHyYwbghYSMDvzZ/oljApenhWEzsyikCbY4b6QB/aEVFCwP+SIc7io1AqzUyjPcOBfy56zTa3Lr5wXPjNCFhEwB/7Ep8bW7d3OeBWPLM3NIDyKKDFaUEvF/9wJxDlK8E49tRaiALdLTMLu4QLvGWj3Qm40yHfCFhD8zGjECWf+Q7xl4zQJZyYRbChjyTzjQmEfLMLZMmrOoCzgwehGPY0ZRANjlaNDKy23AelBb2PY+0bOiZ3gzTp2OTJqz61V/KCcg1exKBw5mJK/RL55lXgsEHILfZpwJP9lQdYZnXfyD3TDpwOYlCksBqRMpT2gj3CmFJYK0Ld0mRmVNa4yOdf6ymKF5aYxsN/GwWaY3bIMyUTIE1FTb153x3HyHbbpwKK+CPWNJeOvolXU2NFfAdUiSfygU4gftSB6UU8MdFC/gUOM/ALnQ00mKFaz0Ja4MrWjMtocfU9LuchJvrn5K1XTVFf/6Z4tQrqFtXW6wraA/Q35Y/JSsUCoVCobBOfgJAKoyL6mhdyAAAAABJRU5ErkJggg==" />',
    };
    this;
  }

  async init() {
    this.initDomNodes();
    this.togglePlayerButtonStyle(false);
    await this.addEventListeners();
  }

  initDomNodes() {
    this.player = document.getElementById("player");
    this.playerButton = document.getElementById("playerButton");
  }

  togglePlayerButtonStyle(isPlayed) {
    this.playerButton.innerHTML = isPlayed
      ? this.buttons.pause
      : this.buttons.play;
  }

  addEventListeners() {
    this.playerButton.addEventListener(
      "click",
      this.playButtonHandler.bind(this)
    );
    this.player.addEventListener(
      "loadedmetadata",
      this.loadedmetadataHandler.bind(this)
    );
  }

  loadedmetadataHandler(event) {
    this.playerButton.disabled = false;
  }

  async playButtonHandler(event) {
    if (this.player.paused) {
      await this.player.play();
      this.togglePlayerButtonStyle(true);
    } else {
      await this.player.pause();
      this.togglePlayerButtonStyle(false);
    }
  }
}
const player = new Player().init();
