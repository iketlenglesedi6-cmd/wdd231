const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const state = { feeling: null, duration: null };

const responses = {
  overwhelmed: {
    word: "You are not failing. You are carrying something real, and it is heavy. That weight is not a sign that something is wrong with your faith - it is a sign that you are human.",
    scripture: '"Come to me, all who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart."',
    ref: "Matthew 11:28-29",
    closing: "You do not have to carry this alone today. Rest is not the opposite of faith - sometimes it is the deepest form of it."
  },
  distant: {
    word: "Feeling far from God does not mean God has moved. Sometimes the distance is the very place where He draws closest, quietly and without announcement.",
    scripture: '"Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there."',
    ref: "Psalm 139:7-8",
    closing: "You are still found. Even in the silence, you have not been left."
  },
  afraid: {
    word: "Fear is honest. Bringing it here, even wordlessly, is already an act of courage. You do not have to resolve it today. You just have to hold it.",
    scripture: '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts and your minds."',
    ref: "Philippians 4:6-7",
    closing: "Peace that passes understanding is not the peace of having answers. It is the peace of being held while the questions remain."
  },
  lost: {
    word: "Not knowing the way is not a failure of direction. It is an invitation to be led. You are allowed to not have a map right now.",
    scripture: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
    ref: "Proverbs 3:5-6",
    closing: "The path does not have to be clear for you to take the next step. One step at a time is enough."
  },
  grief: {
    word: "Grief is love with nowhere to go. It is not weakness. It is the evidence of something that mattered deeply. You are allowed to mourn.",
    scripture: '"He heals the brokenhearted and binds up their wounds."',
    ref: "Psalm 147:3",
    closing: "You are not being punished. You are being held by the One who wept at a tomb and called it sacred."
  },
  numb: {
    word: "Numbness is its own kind of exhaustion. You do not have to feel something in order to be here. Showing up in the emptiness is still showing up.",
    scripture: '"The Lord is close to the brokenhearted and saves those who are crushed in spirit."',
    ref: "Psalm 34:18",
    closing: "He is not waiting for you to feel better before He draws near. He is already here, in the stillness."
  }
};

function showStep(index) {
  document.querySelectorAll(".step").forEach((step) => step.classList.remove("active"));
  document.getElementById(`step-${index}`).classList.add("active");

  for (let i = 0; i < 4; i += 1) {
    const dot = document.getElementById(`dot-${i}`);
    dot.className = "progress-dot" + (i < index ? " done" : i === index ? " active" : "");
  }

  if (index === 3) {
    buildResponse();
  }
}

function buildResponse() {
  const response = responses[state.feeling] || responses.overwhelmed;
  document.getElementById("responseWord").textContent = response.word;
  document.getElementById("responseScripture").innerHTML = `<blockquote>${response.scripture}</blockquote><cite>${response.ref}</cite>`;
  document.getElementById("responseClosing").textContent = response.closing;
}

function restart() {
  state.feeling = null;
  state.duration = null;
  document.querySelectorAll(".choice-btn").forEach((button) => button.classList.remove("selected"));
  document.getElementById("userWords").value = "";
  showStep(0);
}

document.querySelectorAll(".choice-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const { step, value } = button.dataset;
    const group = step === "0" ? "feeling" : "duration";
    state[group] = value;
    button.closest(".choices").querySelectorAll(".choice-btn").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.getElementById("to-step-1").addEventListener("click", () => {
  showStep(1);
});

document.getElementById("to-step-2").addEventListener("click", () => {
  showStep(2);
});

document.getElementById("to-step-3").addEventListener("click", () => {
  showStep(3);
});

document.getElementById("back-step-0").addEventListener("click", () => {
  showStep(0);
});

document.getElementById("back-step-1").addEventListener("click", () => {
  showStep(1);
});

document.getElementById("restart").addEventListener("click", () => {
  restart();
});
