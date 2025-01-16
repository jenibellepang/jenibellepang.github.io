window.addEventListener("DOMContentLoaded", () => { 
  toggleNavigationButtons("page1"); 
  toggleNavigationButtons("page2"); 
  toggleNavigationButtons("page3"); 
  toggleNavigationButtons("page4"); 
  toggleNavigationButtons("page5"); 
});
/********************
 * Scroll Functions *
 ********************/

// Scroll to the next section
function scrollToNext(nextId) {
    const nextSection = document.getElementById(nextId);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with ID "${nextId}" not found.`);
    }
  }
  
  // Scroll back to the first section
  function scrollToStart() {
    const firstSection = document.getElementById("welcome");
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with ID "welcome" not found.`);
    }
  }
  
  // Update progress bar on scroll
  window.addEventListener("scroll", () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const progress = (scrollTop / scrollHeight) * 100;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }
  });
  /****************************
   * Content Navigation Logic *
   ****************************/
  function nextContent(pageId) { 
    const page = document.getElementById(pageId); 
    const currentContent = page.querySelector(".content.active"); 
    const next = currentContent?.nextElementSibling; 
   
    if (next && next.classList.contains("content")) { 
      currentContent.classList.remove("active"); 
      next.classList.add("active"); 
      toggleNavigationButtons(pageId); 
    } else { 
      console.warn("No more content to navigate to."); 
    } 
  } 
   
   
  function prevContent(pageId) { 
    const page = document.getElementById(pageId); 
    const currentContent = page.querySelector(".content.active"); 
    const prev = currentContent?.previousElementSibling; 
   
    if (prev && prev.classList.contains("content")) { 
      currentContent.classList.remove("active"); 
      prev.classList.add("active"); 
      toggleNavigationButtons(pageId); 
    } else { 
      console.warn("No previous content to navigate to."); 
    } 
  } 
   
  function toggleNavigationButtons(pageId) { 
    const page = document.getElementById(pageId); 
    const currentContent = page.querySelector(".content.active"); 
    const prevButton = page.querySelector(".arrow.left"); 
    const nextButton = page.querySelector(".arrow.right"); 
   
    const hasPrevious = currentContent?.previousElementSibling?.classList.contains("content"); 
    const hasNext = currentContent?.nextElementSibling?.classList.contains("content"); 
   
    if (prevButton) { 
      prevButton.style.display = hasPrevious ? "block" : "none"; 
    } 
   
    if (nextButton) { 
      nextButton.style.display = hasNext ? "block" : "none"; 
    } 
  }
  /**********************************************
 * Multi-Question Timed Quiz (Page 6) 
 **********************************************/
const startBtn       = document.getElementById("start-btn");
const nextBtn        = document.getElementById("next-btn");
const quizContainer  = document.getElementById("quiz-container");
const questionEl     = document.getElementById("question");
const answersEl      = document.getElementById("answers");
const scoreEl        = document.getElementById("score");
const timerEl        = document.getElementById("timer");
const timeEl         = document.getElementById("time");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let userAnswers = [];

// Example set of multiple questions
const questions = [
  {
    question: "What does AI stand for?",
    answers: [
      "A. Artificial Intelligence",
      "B. Automated Internet",
      "C. Advanced Integration"
    ],
    correct: "A"
  },
  {
    question: "Which is a key part of AI?",
    answers: [
      "A. Learning from data",
      "B. Ignoring everything",
      "C. Random guessing"
    ],
    correct: "A"
  },
  {
    question: "AI can create _____ ?",
    answers: [
      "A. Only text-based messages",
      "B. Various types of content (images, music, text)",
      "C. Nothing beyond basic calculations"
    ],
    correct: "B"
  },
  {
    question: "Which is an example of AI in daily life?",
    answers: [
      "A. Email spam filters",
      "B. Tying shoelaces",
      "C. Eating a sandwich"
    ],
    correct: "A"
  },
  {
    question: "Why is AI important in technology?",
    answers: [
      "A. It can personalize experiences and handle large data",
      "B. It reduces electricity to zero",
      "C. It randomly deletes user data"
    ],
    correct: "A"
  }
];

// Event listeners for quiz buttons
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", handleNextOrSubmit);

/**
 * Start (or restart) the quiz
 */
function startQuiz() {
  // Reset all quiz state
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  userAnswers = [];
// Hide videos and reset their playback
const videosContainer = document.getElementById("videos-container");
const winVideo = document.getElementById("win-video");
const loseVideo = document.getElementById("lose-video");

videosContainer.classList.add("hidden");
winVideo.pause();
winVideo.currentTime = 0;
loseVideo.pause();
loseVideo.currentTime = 0;
  // Show/hide elements
  startBtn.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  scoreEl.style.display = "none";
  nextBtn.classList.remove("hidden");
  nextBtn.textContent = "Next Question";
  timerEl.style.display = "block";

  // Start timer countdown
  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);

  // Load first question
  loadQuestion();
}

/**
 * Load the current question & answers into the DOM
 */
function loadQuestion() {
  answersEl.innerHTML = "";
  const qObj = questions[currentQuestionIndex];
  questionEl.textContent = qObj.question;

  // For each answer option, build a radio button
  qObj.answers.forEach((answer) => {
    const label = document.createElement("label");
    label.style.display = "block";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    // The first character 'A', 'B', 'C' ...
    radio.value = answer[0];

    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + answer));
    answersEl.appendChild(label);
  });

  // If last question, label the button as "Submit Quiz"
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = "Submit Quiz";
  } else {
    nextBtn.textContent = "Next Question";
  }
}

/**
 * Handle the Next/Submit button click
 */
function handleNextOrSubmit() {
  // Check if user selected an answer
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    alert("Please select an answer first!");
    return;
  }

  // Store user’s choice for this question
  userAnswers[currentQuestionIndex] = selectedOption.value;

  // If we have more questions, go to the next one
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    // Last question => end the quiz
    endQuiz();
  }
}

/**
 * End quiz: stop timer, hide quiz, show score
 */
function endQuiz() {
  clearInterval(timerInterval);
  quizContainer.classList.add("hidden");
  timerEl.style.display = "none";
  nextBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
  startBtn.textContent = "Restart Quiz";

  // Calculate final score
  score = 0;
  for (let i = 0; i < questions.length; i++) {
    const correctLetter = questions[i].correct[0];
    if (userAnswers[i] === correctLetter) {
      score++;
    }
  }

  scoreEl.textContent = `You scored ${score} out of ${questions.length}!`;
  scoreEl.style.display = "block";
  const videosContainer = document.getElementById("videos-container");
  const winVideo = document.getElementById("win-video");
  const loseVideo = document.getElementById("lose-video");

  videosContainer.classList.remove("hidden");

  if (score === 5) {
    winVideo.classList.remove("hidden");
    winVideo.play();
    loseVideo.classList.add("hidden");
  } else {
    loseVideo.classList.remove("hidden");
    loseVideo.play();
    winVideo.classList.add("hidden");
  }
}
