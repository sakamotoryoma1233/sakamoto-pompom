document.addEventListener('DOMContentLoaded', function () {
    const numQuestionsSelect = document.getElementById('num-questions');
    const startButton = document.getElementById('start-button');
    const questionContainer = document.getElementById('question');
    const choicesContainer = document.getElementById('choices-container');
    const feedback = document.getElementById('feedback');
    const timeDisplay = document.getElementById('time-taken');
    const resultsContainer = document.getElementById('results-container');
    const correctSound = new Audio('https://otologic.jp/sounds/se/pre/Quiz-Correct_Answer02-1.mp3');
    const wrongSound = new Audio('https://otologic.jp/sounds/se/pre/Quiz-Wrong_Buzzer02-1.mp3');

    let numQuestions, correctAnswer, startTime, intervalId, totalTime, questionCount = 0;

    function startQuiz() {
        numQuestions = parseInt(numQuestionsSelect.value, 10);
        questionCount = 0;
        startTime = Date.now();
        intervalId = setInterval(updateTime, 1000);
        generateQuestion();
        feedback.textContent = '';
        resultsContainer.innerHTML = '';
    }

    function updateTime() {
        totalTime = Math.floor((Date.now() - startTime) / 1000);
        timeDisplay.textContent = `経過時間: ${totalTime}秒`;
    }

    function generateQuestion() {
        if (questionCount >= numQuestions) {
            clearInterval(intervalId);
            showResults();
            return;
        }
        questionCount++;
        const base = Math.floor(Math.random() * 9) + 1;
        const exponent = Math.floor(Math.random() * 5) + 1;
        correctAnswer = Math.pow(base, exponent);

        questionContainer.textContent = `${base}の${exponent}乗は何ですか？`;
        let answers = new Set([correctAnswer]);
        while (answers.size < 4) {
            let wrongAnswer = Math.floor(Math.random() * 10) + correctAnswer - 5;
            if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
                answers.add(wrongAnswer);
            }
        }
        let shuffledAnswers = Array.from(answers);
        shuffledAnswers.sort(() => 0.5 - Math.random());

        choicesContainer.innerHTML = '';
        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'choice';
            button.textContent = answer;
            button.onclick = () => checkAnswer(answer);
            choicesContainer.appendChild(button);
        });
    }

    function checkAnswer(answer) {
        const allButtons = choicesContainer.querySelectorAll('.choice');
        allButtons.forEach(button => button.disabled = true); // Disable all buttons after a choice is made

        if (answer === correctAnswer) {
            feedback.textContent = '正解です！';
            correctSound.play();
            allButtons.forEach(button => {
                if (parseInt(button.textContent) === correctAnswer) {
                    button.style.backgroundColor = '#FFD700'; // Only paint correct answer
                }
            });
            setTimeout(() => {
                allButtons.forEach(button => {
                    button.disabled = false;
                    button.style.backgroundColor = ''; // Clear color after moving to the next question
                });
                generateQuestion();
            }, 1000);
        } else {
            feedback.textContent = '不正解です。もう一度挑戦してください。 +3秒';
            wrongSound.play();
            startTime -= 3000; // 3 seconds penalty
            setTimeout(() => {
                allButtons.forEach(button => {
                    button.disabled = false;
                    button.style.backgroundColor = ''; // Clear color
                });
                feedback.textContent = ''; // Clear feedback text
            }, 1000);
        }
    }

    function showResults() {
        totalTime = Math.floor((Date.now() - startTime) / 1000);
        questionContainer.textContent = 'クイズ終了！';
        choicesContainer.innerHTML = '';
        feedback.textContent = `今回の経過時間: ${totalTime}秒`;
    }

    startButton.addEventListener('click', startQuiz);
});
