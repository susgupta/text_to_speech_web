//access speech synthesis API in native Web
const synth = window.speechSynthesis;

// get needed DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

//initalize voices array
let voices = [];

//method to get voices
const getVoices = () => {
  //get from API built-in
  voices = synth.getVoices();

  //loop thru and create option per voice
  voices.forEach(voice => {
    //create actual option element
    const option = document.createElement("option");
    //populate option with voice and langauge
    option.textContent = voice.name + "(" + voice.lang + ")";

    //set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    //add to list
    voiceSelect.appendChild(option);
  });
};

getVoices();

//must use this to trigger loading of voices and done here to see if browser supports it
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//speak function
const speak = () => {
  //check if speaking
  if (synth.speaking) {
    console.log("Already speaking...");
    return;
  }

  //make sure text is not empty
  if (textInput.value !== "") {
    //add background image
    body.style.background = "#141414 url('img/wave.gif')";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";

    //get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //speak end
    speakText.onend = e => {
      console.log("Finished speaking.");
      body.style.background = "#141414";
    };

    //speak error
    speakText.onerror = e => {
      console.error("Something went wrong during speak");
    };

    //selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    //loop thru voices
    voices.forEach(voice => {
      //if voice match, set the speak voice
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //set speak rate and pitch
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //finally speak
    synth.speak(speakText);
  }
};

//wire event listeners

//text form submite
textForm.addEventListener("submit", e => {
  e.preventDefault();
  //go ahead and speak
  speak();
  textInput.blur();
});

//rate value change
rate.addEventListener("change", e => (rateValue.textContent = rateValue.value));
//pitch value change
pitch.addEventListener(
  "change",
  e => (pitchValue.textContent = pitchValue.value)
);

//voice select
voiceSelect.addEventListener("change", e => {
  speak();
});
