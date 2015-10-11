function say (something) {
    message = new SpeechSynthesisUtterance(something);
    window.speechSynthesis.speak(message);
}

function nothing () {}

var text = '', mode = 'insert';

function handleKey (event) {
    var character = String.fromCharCode(event.charCode);

    var strategy = ({
        insert: function () {
            var strategy = {
                ' ': sayLastWord
            } [character] || nothing;
            strategy();
            text += character;
        },
        normal: function () {
            ({
                i: activateInsertMode,
                l: sayCurrentLine,
                r: runCode
            }[character] || nothing)();
        }
    })[mode];

    strategy();
}

window.addEventListener('keypress', handleKey);
window.addEventListener('keydown', tryToEnterNormalMode);

function sayLastWord () {
    var lastWord = text.split(' ').pop();
    say(lastWord);
}

function tryToEnterNormalMode (event) {
    ({
        27: function escape () {
            mode = 'normal';
            say('normal mode on');
        },
        8: function deleteWord () {
            event.preventDefault();
            text = text.trim();
            say('deleted ' + text.split(' ').slice(-1));
            text = text.split(' ').slice(0, -1).join(' ') + ' ';
        }
    }[event.keyCode] || nothing)();
}

function sayCurrentLine () {
    say(text.split(/\n/g).pop());
}

function activateInsertMode () {
    mode = 'insert';
    say('insert mode on');
}

var mappings = {
    minus: '-',
    plus: '+',
    times: '*',
    'divided by': '/',
    of: '(',
    invocation: ')',
    does: ') {',
    if: 'if (',
    is: '===',
    isnt: '!==',
    not: '!',
    then: ') {',
    else: '} else {',
    begin: '{',
    end: '}',
    'after that': ';'
};

document.getElementById('mappings').innerHTML = Object.keys(mappings).map(function (key) {
    return '<dt>key</dt><dd><code>value</code></dd>'.replace('key', key).replace('value', mappings[key]);
}).join('');

function runCode () {
    var code =  Object.keys(mappings).reduce(function (text, key) {
        return text.replace(new RegExp(key, 'g'), mappings[key]);
    }, text);

    try {
        say('evaluates to ' + eval(code));
    } catch (e) {
        say('fails to interpret');
    }
}
