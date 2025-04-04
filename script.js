const questions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "Which is the largest planet in our solar system?",
        answers: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Ag", "Fe", "Au", "Cu"],
        correct: 2
    },
    {
        question: "Which country is home to the kangaroo?",
        answers: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the hardest natural substance on Earth?",
        answers: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const timeElement = document.getElementById('time');
const currentScoreElement = document.getElementById('current-score');
const finalScoreElement = document.getElementById('final-score');
const leaderboardList = document.getElementById('leaderboard-list');

// Button Event Listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('leaderboard-btn').addEventListener('click', showLeaderboard);
document.getElementById('save-score-btn').addEventListener('click', saveScore);
document.getElementById('play-again-btn').addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
document.getElementById('back-btn').addEventListener('click', () => {
    leaderboardScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    answersElement.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersElement.appendChild(button);
    });

    timeLeft = 30;
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(-1);
        }
    }, 1000);
}

function selectAnswer(selectedIndex) {
    clearInterval(timer);
    
    if (selectedIndex === questions[currentQuestion].correct) {
        score += Math.max(10, timeLeft);
        currentScoreElement.textContent = score;
    }

    currentQuestion++;
    loadQuestion();
}

function endQuiz() {
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function saveScore() {
    const name = document.getElementById('name-input').value.trim();
    if (name) {
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep only top 10
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        showLeaderboard();
    }
}

function showLeaderboard() {
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
    
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(item);
    });
}