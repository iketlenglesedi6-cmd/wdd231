const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const heroCard = document.querySelector("#heroCard");
const cardLabel = document.querySelector("#cardLabel");
const verseText = document.querySelector("#verseText");
const verseRef = document.querySelector("#verseRef");
const affirmText = document.querySelector("#affirmText");
const nextVerseButton = document.querySelector("#next-verse");
const versesGrid = document.querySelector("#versesGrid");

const verses = [
  {
    tag: "When you are weary",
    quote: '"Come to me, all who are weary and burdened, and I will give you rest."',
    ref: "Matthew 11:28",
    affirmation: "You are allowed to stop striving. Rest is not giving up. It is receiving."
  },
  {
    tag: "When you feel alone",
    quote: '"The Lord himself goes before you and will be with you; he will never leave you nor forsake you."',
    ref: "Deuteronomy 31:8",
    affirmation: "You have not been abandoned. Not in this room, not in this moment, not ever."
  },
  {
    tag: "When you are afraid",
    quote: '"Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you."',
    ref: "Isaiah 41:10",
    affirmation: "Fear does not mean you are faithless. It means you are honest. And honesty is the beginning of peace."
  },
  {
    tag: "When you feel unseen",
    quote: '"Are not five sparrows sold for two pennies? Yet not one of them is forgotten by God. And even the very hairs of your head are all numbered."',
    ref: "Luke 12:6-7",
    affirmation: "You are not invisible. You are known in ways more detailed than you can imagine."
  },
  {
    tag: "When you need hope",
    quote: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."',
    ref: "Jeremiah 29:11",
    affirmation: "Hope is not wishful thinking. It is a promise with a name behind it."
  },
  {
    tag: "When you feel broken",
    quote: '"He heals the brokenhearted and binds up their wounds."',
    ref: "Psalm 147:3",
    affirmation: "Broken things are not discarded here. They are gathered and tended."
  },
  {
    tag: "When you are overwhelmed",
    quote: '"Cast all your anxiety on him because he cares for you."',
    ref: "1 Peter 5:7",
    affirmation: "You do not have to carry this quietly. You are allowed to hand it over."
  },
  {
    tag: "When you feel distant",
    quote: '"Draw near to God and he will draw near to you."',
    ref: "James 4:8",
    affirmation: "The distance you feel is not rejection. Take one small step. That is enough."
  },
  {
    tag: "When you need strength",
    quote: '"I can do all this through him who gives me strength."',
    ref: "Philippians 4:13",
    affirmation: "Not strength you have to manufacture. Strength that is given freely, when you ask."
  },
  {
    tag: "When you need peace",
    quote: '"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."',
    ref: "John 14:27",
    affirmation: "The peace being offered here is not the absence of trouble. It is the presence of Someone greater than the trouble."
  },
  {
    tag: "When you feel lost",
    quote: '"Your word is a lamp for my feet, a light on my path."',
    ref: "Psalm 119:105",
    affirmation: "You do not need to see the whole road. Just the next step. The light is enough for that."
  },
  {
    tag: "When you are grieving",
    quote: '"Blessed are those who mourn, for they will be comforted."',
    ref: "Matthew 5:4",
    affirmation: "Your grief is not a sign that God has forgotten you. It is the very place where comfort waits."
  }
];

let currentIndex = Math.floor(Math.random() * verses.length);

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

function renderVerse(verse) {
  cardLabel.textContent = verse.tag;
  verseText.textContent = verse.quote;
  verseRef.textContent = verse.ref;
  affirmText.textContent = verse.affirmation;
}

function showVerse(index) {
  const verse = verses[index];

  if (!heroCard || !verse) {
    return;
  }

  heroCard.style.opacity = "0";
  heroCard.style.transform = "translateY(10px)";

  window.setTimeout(() => {
    renderVerse(verse);
    heroCard.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    heroCard.style.opacity = "1";
    heroCard.style.transform = "translateY(0)";
  }, 220);
}

function selectCard(card, verse) {
  document.querySelectorAll(".vcard").forEach((item) => item.classList.remove("on"));
  card.classList.add("on");
  currentIndex = verses.findIndex((item) => item.ref === verse.ref && item.tag === verse.tag);
  renderVerse(verse);
  window.scrollTo({ top: heroCard.offsetTop - 100, behavior: "smooth" });
}

function buildGrid() {
  if (!versesGrid) {
    return;
  }

  const picked = [...verses]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  versesGrid.innerHTML = picked
    .map((verse) => {
      const excerpt = verse.quote.length > 90 ? `${verse.quote.slice(0, 90)}...` : verse.quote;

      return `
        <article class="vcard" tabindex="0">
          <div class="vtag">${verse.tag}</div>
          <p class="vq">${excerpt}</p>
          <div class="vr">${verse.ref}</div>
        </article>
      `;
    })
    .join("");

  const cards = versesGrid.querySelectorAll(".vcard");

  cards.forEach((card, index) => {
    const verse = picked[index];

    card.addEventListener("click", () => selectCard(card, verse));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard(card, verse);
      }
    });
  });
}

if (nextVerseButton) {
  nextVerseButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % verses.length;
    nextVerseButton.classList.remove("spin");
    void nextVerseButton.offsetWidth;
    nextVerseButton.classList.add("spin");
    showVerse(currentIndex);
  });
}

showVerse(currentIndex);
buildGrid();
