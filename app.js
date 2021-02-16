var ques = [

    {
        question: "HTML stands for:",
        options: ["HighText Machine Language", "HyperText and links Markup Language", "HyperText Markup Language", "None of these"],
        ans: "2"
    },
    {
        question: "The correct sequence of HTML tags for starting a webpage is -",
        options: ["Head, Title, HTML, body", "HTML, Body, Title, Head", "HTML, Head, Title, Body", "HTML, Head, Title, Body"],
        ans: "3"
    },
    {
        question: "Which of the following element is responsible for making the text bold in HTML?",
        options: ["<pre>", "<a>", "<b>", "<br>"],
        ans: "2"

    },
    {
        question: "Which of the following tag is used for inserting the largest heading in HTML?",
        options: ["<h3>", "<h1>", "<h5>", "<h6>"],
        ans: "1"
    },
    {
        question: "Which of the following tag is used to insert a line-break in HTML?",
        options: ["<br>", "<a>", "<pre>", "<b>"],
        ans: "0"
    },
    {
        question: "How to create an unordered list (a list with the list items in bullets) in HTML?",
        options: ["<ul>", "<ol>", "<li>", "<i>"],
        ans: "0"
    },
    {
        question: "Which character is used to represent the closing of a tag in HTML?",
        options: ["\\", "!", "/", "."],
        ans: "2"
    },
    {
        question: "How to create a hyperlink in HTML?",
        options: ['<a href = "www.javatpoint.com"> javaTpoint.com </a>', '<a url = "www.javatpoint.com" javaTpoint.com /a>', '<a link = "www.javatpoint.com"> javaTpoint.com </a>', '<a> www.javatpoint.com <javaTpoint.com /a>'],
        ans: "0"
    },
    {
        question: "How to create an ordered list (a list with the list items in numbers) in HTML?",
        options: ["<ul>", "<ol>", "<li>", "<i>"],
        ans: "1"
    },
    {
        question: "Which of the following element is responsible for making the text italic in HTML?",
        options: ["<i>", "<italic>", "<it>", "<pre>"],
        ans: "0"
    }
]
var attemptedQuestions = 0
var quesList = document.getElementById("questionsList")
var submitButton = document.createElement("button")
var submitText = document.createTextNode("Submit")
submitButton.appendChild(submitText)
submitButton.disabled = true
submitButton.onclick = submitTest

var inteval;
var marks = 0
function start() {

    interval = setInterval(timer, 10)
    document.getElementById('startButton').disabled = true
}
function submitTest() {
    pause()
    submitButton.disabled=true
    
    for (var i = 0; i < ques.length; i++) {
        marks += checkThisAnswer(i)
    }
    showResult()
}
function pause() {
    document.getElementById('startButton').onclick = start
    return clearInterval(interval)
}

function reset() {
    location.reload()
}

var min = 3
var sec = 0
var milisec = 0



var disMin = document.getElementById('min')
var disSec = document.getElementById('sec')
var disMilisec = document.getElementById('milisec')

if (milisec < 10)
    disMilisec.innerHTML = "0" + milisec
else
    disMilisec.innerHTML = milisec

if (sec < 10)
    disSec.innerHTML = "0" + sec
else
    disSec.innerHTML = sec

disMin.innerHTML = min

function timer() {

    milisec--

    disMilisec.innerHTML = milisec
    if (milisec <= 0) {
        sec--
        disSec.innerHTML = sec
        milisec = 99
    }
    if (sec <= 0) {
        if (min > 0)
            min--
        else {
            
            sec = 0
            disSec.innerHTML = 0
            disMin.innerHTML = 0
            disMilisec.innerHTML=0
            pause()
            
            
            submitTest()
            alert("Time Up")
            return
        }
        sec = 59
        disSec.innerHTML = sec
        disMin.innerHTML = min
    }
}
function startTest() {
    start()
    for (var i = 0; i < ques.length; i++) {
        addToQuesList(ques[i], i)
    }
    quesList.appendChild(submitButton)
}

function addToQuesList(q, n) {
    var quesList = document.getElementById("questionsList")
    var qDiv = document.createElement("div")
    var question = document.createElement("h3")
    var questionText = document.createTextNode("Q" + (n + 1) + ") " + q.question)
    question.appendChild(questionText)
    var clicked = false
    var optionsDiv = document.createElement("div")
    for (var i = 0; i < q.options.length; i++) {
        var optionSpan = document.createElement("div")
        var option = document.createElement("input")
        option.setAttribute("type", "radio")
        option.setAttribute("name", "option" + n)
        option.setAttribute("value", i)
        var optionText = document.createTextNode(q.options[i])
        option.onclick = function () {
            if (!clicked) {
                clicked = true
                attemptedQuestions++
                if (attemptedQuestions == ques.length) {
                    submitButton.disabled = false
                }
            }
        }
        optionSpan.appendChild(option)
        optionSpan.appendChild(optionText)
        optionsDiv.appendChild(optionSpan)
    }
    qDiv.setAttribute("class", "qDiv")
    qDiv.appendChild(question)
    qDiv.appendChild(optionsDiv)
    quesList.appendChild(qDiv)
}
function checkThisAnswer(n) {
    var options = document.getElementsByName("option" + n)   
    
    options[ques[n].ans].parentNode.setAttribute("class","correct")

    for (var i = 0; i < options.length; i++) {
        options[i].disabled=true
        if (options[i].checked) {            
        options[0].parentNode.setAttribute("class","wrong")

            if (ques[n].ans == i) {               
                options[ques[n].ans].parentNode.setAttribute("class","correct")
                return 1
            }
            
        }

    }
    return 0
}

function showResult(){
    var resultDiv=document.getElementById("result")
    var correctQuestions= document.createElement('h2')
    var omText=document.createTextNode("Correct questions:\t "+marks)
    correctQuestions.appendChild(omText)
    resultDiv.appendChild(correctQuestions)
    var totalQuestions= document.createElement('h2')
    var tText=document.createTextNode("Total questions:\t "+ques.length)
    totalQuestions.appendChild(tText)
    resultDiv.appendChild(totalQuestions)
    var percentage= document.createElement('h2')
    var perText=document.createTextNode("Percentage:\t  "+marks/q.length*100)
    percentage.appendChild(perText)
    resultDiv.appendChild(percentage)

}