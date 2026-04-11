const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const nameLine = document.querySelector("#nameLine");
const summaryType = document.querySelector("#summaryType");
const summaryPrayer = document.querySelector("#summaryPrayer");
const summaryPrayerRow = document.querySelector("#summaryPrayerRow");
const responseVerse = document.querySelector("#responseVerse");
const responseRef = document.querySelector("#responseRef");

const params = new URLSearchParams(window.location.search);

const typeLabels = {
  personal: "yourself",
  someone: "someone you love",
  healing: "healing",
  guidance: "guidance and direction",
  grief: "grief and loss",
  gratitude: "gratitude",
  other: "something on your heart"
};

const versesByType = {
  personal: { quote: '"Cast all your anxiety on him because he cares for you."', reference: "1 Peter 5:7" },
  someone: { quote: '"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."', reference: "Numbers 6:24-25" },
  healing: { quote: '"He heals the brokenhearted and binds up their wounds."', reference: "Psalm 147:3" },
  guidance: { quote: '"Trust in the Lord with all your heart and lean not on your own understanding."', reference: "Proverbs 3:5" },
  grief: { quote: '"Blessed are those who mourn, for they will be comforted."', reference: "Matthew 5:4" },
  gratitude: { quote: `"Give thanks in all circumstances; for this is God's will for you in Christ Jesus."`, reference: "1 Thessalonians 5:18" },
  other: { quote: '"Call to me and I will answer you and tell you great and unsearchable things you do not know."', reference: "Jeremiah 33:3" }
};

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const firstName = params.get("firstName") || "";
const prayerType = params.get("prayerType") || "other";
const prayerText = params.get("prayerText") || "";

nameLine.textContent = firstName
  ? `${firstName}, you are not alone in this.`
  : "You are not alone in this.";

summaryType.textContent = typeLabels[prayerType] || typeLabels.other;

if (prayerText.trim()) {
  const preview = prayerText.length > 200
    ? `${prayerText.slice(0, 200)}...`
    : prayerText;

  summaryPrayer.textContent = `"${preview}"`;
} else {
  summaryPrayerRow.hidden = true;
}

const verse = versesByType[prayerType] || versesByType.other;
responseVerse.textContent = verse.quote;
responseRef.textContent = verse.reference;
