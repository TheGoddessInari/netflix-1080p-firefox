const fnSetMaxBitrate = () => {
  const getElementByXPath = (xpath) => {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  };
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      keyCode: 83,
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    })
  );

  const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate']");
  const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
  const BUTTON = getElementByXPath("//button[text()='Override']");

  if (!VIDEO_SELECT || !AUDIO_SELECT || !BUTTON) {
    return false;
  }

  [VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
    const parent = el.parentElement;

    const options = parent.querySelectorAll("select > option");

    let index = options.length - 1;
    if (index < 1) {
      return false;
    }

    options[index--].selected = true;

    while (index >= 0) {
      options[index--].selected = false;
    }
  });

  BUTTON && BUTTON.click();

  return true;
};
