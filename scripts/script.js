let mario_size = 5.86;
let goomba_size = 3.9;
let ground_height = 7;

//global vars
var lives = 0;
var move_goomba_interval = null;

$("#easy_mode").click(function (e) {
    e.preventDefault();
    start_game("easy");
});

$("#medium_mode").click(function (e) {
    e.preventDefault();
    start_game("medium");
});

$("#hard_mode").click(function (e) {
    e.preventDefault();
    start_game("hard");
});

$("#retry_button").click(function (e) {
    e.preventDefault();
    choose_stage(1);
});

$("#answer_button").click(function (e) {
    e.preventDefault();
    checkResult();
});

$('#answer_input').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        e.preventDefault();
        checkResult();
    }
});

function start_game(mode) {
    var time = null;
    lives = 3;
    switch (mode) {
        case "easy": time = 1000;
            break;

        case "medium": time = 700;
            break;

        case "hard": time = 400;
            break;

        default:
            time = 1000;
    }

    console.log("The Difficulty is " + mode + " and the time is " + time);


    alignCharacters();
    $("#goomba").css("left", "0%");
    $("#mario").css("left", "10%");
    choose_stage(2);
    generateQuestion();
    $("#answer_input").focus();
    move_goomba_interval = setInterval(move_goomba, time);
}
function alignCharacters() {
    var bg_height = $("#game_content").height();
    $("#goomba img").height((bg_height / 100) * goomba_size);
    $("#mario img").height((bg_height / 100) * mario_size);
    $("#goomba").css("bottom", (bg_height / 100) * ground_height);
    $("#mario").css("bottom", (bg_height / 100) * ground_height);
}

function getLeftPercentage(character) {
    var left_px = parseInt($("#" + character).css("left"));
    var bg_width = $("#game_content").width();
    var left_per = (100 / bg_width) * left_px;

    return left_per;
}

function move_character(character, percent) {
    var left_per = getLeftPercentage(character);
    $("#" + character).css("left", left_per + percent + "%");

    left_per = getLeftPercentage(character);
    return left_per;
}

function move_goomba() {
    //TODO Make a better collision detection algorithm.
    var left_per = move_character("goomba", 1.0);
    if (left_per > getLeftPercentage("mario")) {
        gameover();
    }
}

function generateQuestion() {
    $("#first_num_label").text(Math.floor((Math.random() * 10) + 1));
    $("#second_num_label").text(Math.floor((Math.random() * 10) + 1));
}

function checkResult() {
    if ($("#answer_input").val() === '') {
        return;
    }
    var firstNum = parseInt($("#first_num_label").text());
    var secondNum = parseInt($("#second_num_label").text());

    var answer = parseInt($("#answer_input").val());
    $("#answer_input").val('');
    if ((firstNum * secondNum) === answer) {
        correct_answer();
    } else {
        wrong_answer();
    }
    $("#answer_input").focus();
}

function correct_answer() {
    generateQuestion();
    var left_per = move_character("mario", 5.0);
}
function wrong_answer() {
    lives--;
    if (lives < 1) {
        gameover();
    } else {
        console.log(lives + " lives left");
        generateQuestion();
    }
}

function gameover() {
    clearInterval(move_goomba_interval);
    choose_stage(3);
    console.log("GaMeOvEr");
}

function choose_stage(stage) {
    switch (stage) {
        case 1:
            $("#game_start").css("display", "flex");
            $("#gameplay").css("display", "none");
            $("#game_result").css("display", "none");
            break;
        case 2:
            $("#game_start").css("display", "none");
            $("#gameplay").css("display", "flex");
            $("#game_result").css("display", "none");
            break;
        case 3:
            $("#game_start").css("display", "none");
            $("#gameplay").css("display", "none");
            $("#game_result").css("display", "flex");
            break;
        default:
            $("#game_start").css("display", "flex");
            $("#gameplay").css("display", "none");
            $("#game_result").css("display", "none");
    }
}