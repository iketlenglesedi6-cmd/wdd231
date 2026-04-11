const courses = [
  { code: "CSE 110", name: "Programming Building Blocks", credits: 2, subject: "CSE", completed: true },
  { code: "CSE 111", name: "Programming with Functions", credits: 2, subject: "CSE", completed: true },
  { code: "CSE 210", name: "Programming with Classes", credits: 2, subject: "CSE", completed: false },
  { code: "WDD 130", name: "Web Fundamentals", credits: 2, subject: "WDD", completed: true },
  { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, subject: "WDD", completed: true },
  { code: "WDD 231", name: "Web Frontend Development I", credits: 2, subject: "WDD", completed: false }
];

const courseList = document.querySelector("#course-list");
const totalCredits = document.querySelector("#total-credits");
const filterButtons = document.querySelectorAll(".filters button");

function getFilteredCourses(subject) {
  return subject === "all" ? courses : courses.filter((course) => course.subject === subject);
}

function renderCourses(subject = "all") {
  if (!courseList || !totalCredits) return;

  const filteredCourses = getFilteredCourses(subject);

  courseList.innerHTML = filteredCourses
    .map((course) => {
      const completedClass = course.completed ? "completed" : "";
      return `<article class="course-card ${completedClass}">${course.code}</article>`;
    })
    .join("");

  const credits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  totalCredits.textContent = `The total credits for course listed above is ${credits}`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCourses(button.dataset.filter || "all");
  });
});

renderCourses("all");


