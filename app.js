var edit = false
var ques = []
var availableTests = []
var mdb = firebase.database().ref('/')
mdb.once('value', function (data) {
    var j = 0
    for (var i in data.val()) {
        console.log(i)
        availableTests.push(i)
        var testBtns = document.getElementById("testBtns")
        var btnDiv = document.createElement('div')
        var btn = document.createElement('button')
        btnDiv.appendChild(btn)

        var edtBtn = document.createElement('button')
        edtBtn.innerHTML = "Edit"
        btnDiv.appendChild(edtBtn)
        edtBtn.setAttribute('onclick', 'editTest(this)')

        var rmvBtn = document.createElement('button')
        rmvBtn.innerHTML = "Remove"
        btnDiv.appendChild(rmvBtn)
        rmvBtn.setAttribute('onclick', 'rmvTest(this)')

        btn.innerHTML = availableTests[j] + " Quiz"
        btn.setAttribute('onclick', "goToTest(this)")
        btn.setAttribute('id', j)
        edtBtn.setAttribute('id', j)
        rmvBtn.setAttribute('id', j)
        j++
        testBtns.appendChild(btnDiv)
    }
})

var attemptedQuestions = 0
var quesList = document.getElementById("questionsList")
var submitButton = document.createElement("button")
var submitText = document.createTextNode("Submit")
submitButton.appendChild(submitText)
submitButton.disabled = true
submitButton.onclick = submitTest

var inteval;
var marks = 0

for (var i = 0; i < availableTests.length; i++) {

    var btn = document.createElement('button')
    btn.innerHTML = availableTests[i].dsp
    btn.setAttribute('onclick', "goToTest(this)")
    btn.setAttribute('id', i)
    testBtns.appendChild(btn)
}
testBtns.innerHTML += '<button onclick="signIn()">Sign In To Edit Or Add Tests</button>'
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
            disMilisec.innerHTML = 0
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
function editTest(btn) {
    testBtns.style.display = 'none'
    var heading = document.getElementById("heading")
    heading.innerHTML = "This is the " + availableTests[btn.id] + " Quiz"
    var db = firebase.database().ref('/').child(availableTests[btn.id]);
    db.once('value', function (data) {
        console.log(data.val())
        ques = data.val()
        showEditableTest(db)
    })
    //    console.log(nameOfTest)
    var mn = document.getElementById("main")
    mn.style.display = 'block'
}
function showEditableTest(db) {
    for (var i = 0; i < ques.length; i++) {
        editQuestion(ques[i], i)
    }
    var saveBtn = document.createElement('button')
    saveBtn.innerHTML = 'Save Changes'
    var addQuesBtn = document.createElement('button')
    addQuesBtn.innerHTML = 'Add Question'
    addQuesBtn.onclick = function(){
        ques.push({question:"",options:[""],ans:"0"})
        editQuestion(ques[ques.length-1],ques.length-1)
    }
    saveBtn.onclick = function () {
        
        for (var i = 0; i < ques.length; i++)
            db.child(i).set(ques[i])
    }
    quesList.appendChild(addQuesBtn)
    document.getElementById("main").appendChild(saveBtn)
}
function goToTest(btn) {
    testBtns.style.display = 'none'
    var heading = document.getElementById("heading")
    heading.innerHTML = "This is the " + availableTests[btn.id] + " Quiz"
    var db = firebase.database().ref('/').child(availableTests[btn.id]);
    db.once('value', function (data) {
        console.log(data.val())
        ques = data.val()
    })
    //    console.log(nameOfTest)
    var mn = document.getElementById("main")
    mn.style.display = 'block'

    var d = document.getElementById("timerAndStart")
    d.style.display = 'block'
}
function start() {
    interval = setInterval(timer, 10)
    document.getElementById('startButton').disabled = true
}
function submitTest() {
    pause()
    submitButton.disabled = true

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

    options[ques[n].ans].parentNode.setAttribute("class", "correct")

    for (var i = 0; i < options.length; i++) {
        options[i].disabled = true
        if (options[i].checked) {
            options[i].parentNode.setAttribute("class", "wrong")

            if (ques[n].ans == i) {
                options[i].parentNode.setAttribute("class", "correct")
                return 1
            }

        }

    }
    return 0
}

function showResult() {
    var resultDiv = document.getElementById("result")
    var correctQuestions = document.createElement('h2')
    var omText = document.createTextNode("Correct questions:\t " + marks)
    correctQuestions.appendChild(omText)
    resultDiv.appendChild(correctQuestions)
    var totalQuestions = document.createElement('h2')
    var tText = document.createTextNode("Total questions:\t " + ques.length)
    totalQuestions.appendChild(tText)
    resultDiv.appendChild(totalQuestions)
    var percentage = document.createElement('h2')
    var perText = document.createTextNode("Percentage:\t  " + marks / q.length * 100)
    percentage.appendChild(perText)
    resultDiv.appendChild(percentage)

}
function imagePressed(id) {

    if (id < 0) {
        id = 13
    }
    var dsp = document.getElementById('dsp')
    dsp.innerHTML = `<img src=${imgArr[id]} alt="galleryimage"  height="100%"><br>
                    <button class="leftbtn" onclick="imagePressed(${(id - 1) % 14})" >&#8592;</button>
                   <button  class="rightbtn" onclick="imagePressed(${(id + 1) % 14})">&#8594;</button>`
    select.style.display = "block"
}
function imageReleased() {
    if (event.target === event.currentTarget)
        select.style.display = 'none'
}
document.onkeydown = function (evt) {

    evt = evt || window.event;
    if (evt.key == "Escape") {
        select.style.display = 'none'
    }
};
function signIn() {
    edit = true

}

function editQuestion(q, n) {

    var quesList = document.getElementById("questionsList")
    var qDiv = document.createElement("div")
    var question = document.createElement("span")
    var questionText = document.createTextNode("Q" + (n + 1) + ")")
    question.appendChild(questionText)
    var questionTextInput=document.createElement('input')
    
    questionTextInput.setAttribute("type", "text")
    questionTextInput.setAttribute("id", n+"input")
    questionTextInput.onchange=function(){
        ques[n].question=this.value
    }
    questionTextInput.value=q.question
    question.appendChild(questionTextInput)
    // var clicked = false
    var optionsDiv = document.createElement("div")
    for (var i = 0; i < q.options.length; i++) {
        var optionSpan = document.createElement("div")
        var option = document.createElement("input")
        
        option.setAttribute("type", "radio")
        option.setAttribute("name", "option" + n)
        option.setAttribute("value", i)
        if(i==q.ans){
            option.checked=true
        }
        option.onclick=function(){
            q.ans=this.value
        }
        var optionInput=document.createElement('input')
        optionInput.setAttribute('type','text')
        optionSpan.setAttribute('id',i)
        optionInput.onchange=function(){
            q.options[this.parentNode.id]=this.value
        }
        
        optionInput.value=q.options[i]
        optionRemoveBtn=document.createElement("button")
        optionRemoveBtn.innerHTML="Remove Option"
        optionRemoveBtn.onclick=function(){
            q.options.splice(this.parentNode.id,1)
            this.parentNode.remove()
            if(this.parentNode.id>=q.ans)
                q.ans--
        }
        optionSpan.appendChild(option)
        optionSpan.appendChild(optionInput)
        optionSpan.appendChild(optionRemoveBtn)
        optionsDiv.appendChild(optionSpan)

        //.splice(i, 1);
    }
    var optionAddButton=document.createElement("button")
    optionAddButton.innerHTML="Add Option"
    optionAddButton.onclick = function(){
        q.options.push("")

        var optionSpan = document.createElement("div")
        var option = document.createElement("input")
        
        option.setAttribute("type", "radio")
        option.setAttribute("name", "option" + n)
        option.setAttribute("value", i)
        if(i==q.ans){
            option.checked=true
        }
        option.onclick=function(){
            q.ans=this.value
        }
        var optionInput=document.createElement('input')
        optionInput.setAttribute('type','text')
        optionSpan.setAttribute('id',i)
        optionInput.onchange=function(){
            q.options[this.parentNode.id]=this.value
        }
        
        optionInput.value=q.options[i]
        optionRemoveBtn=document.createElement("button")
        optionRemoveBtn.innerHTML="Remove Option"
        optionRemoveBtn.onclick=function(){
            q.options.splice(this.parentNode.id,1)
            this.parentNode.remove()
        }
        optionSpan.appendChild(option)
        optionSpan.appendChild(optionInput)
        optionSpan.appendChild(optionRemoveBtn)
        optionsDiv.appendChild(optionSpan)
        i++
    }
    qDiv.setAttribute("class", "qDiv")
    qDiv.appendChild(question)
    qDiv.appendChild(optionsDiv)
    quesList.appendChild(qDiv)
    qDiv.appendChild(optionAddButton)
}
