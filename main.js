// import axios from 'axios';

const slider = document.getElementById("myrange");
const output = document.getElementById("slider-value");
const texts = document.querySelector('.texts');
// const recognition  = new webkitSpeechRecognition();
let recognition;
let isRecognizing = false;
let shouldReadContent = false;
let sectionCount = 0;
goToSectionBoolean = false;
goToSectionPaulBoolean = false;


    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }


function startSpeechRecognition() {
    texts.innerHTML = '';    //clear previous
    if (!recognition || !isRecognizing) {
        recognition  = new webkitSpeechRecognition();
        recognition.interimResults = true;
        let p = document.createElement('p');

        recognition.addEventListener('result', (e) => {
            // console.log(e);
            const text = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript.toLowerCase())
                .join('');

            p.innerText = text.toLowerCase(); 
            texts.appendChild(p);

            handleResponse(text.toLowerCase()); // pass lowercase text to handleResponse function

            // if (e.results[0].isFinal) {
            //     p = document.createElement('p');
            //     handleResponse(text.toLowerCase()); // pass lowercase text to handleResponse function
            // }
        });

        recognition.addEventListener('end', ()=> {
            // isRecognizing = false;
            if (isRecognizing) {
                setTimeout(() => {
                    recognition.start();
                }, 2000);
            }
        });

        isRecognizing = true;
        recognition.start();
    }
}

function handleResponse(text) {
    let replyP;

    if (text.includes('hello')) {
        replyP = createReply('Hello');
        texts.appendChild(replyP);
        textToSpeech('Welcome to vision voice. which website would you like to go to? ');   //You can either go to maths is fun, oxnotes, mathplanet or pauls online notes
    }
    else if (text.includes('maths is fun')) {
        replyP = createReply('opening mathsisfun');
        textToSpeech('Please wait a moment. Opening maths is fun website.');
        texts.appendChild(replyP);
        // textToSpeech('Welcome to maths is fun. These are the sections you can go to in this website');  
        // readtextFile('Text_com/mathsisfun_sections.txt');
        goToSectionBoolean = true;
        // url = 'https://www.mathsisfun.com/algebra/index.html';
        chrome.runtime.sendMessage({ action: 'openNewTab', url: 'https://www.mathsisfun.com/algebra/index.html'});
        // chrome.runtime.sendMessage({ action: 'readHeadings', url: url });
    }
    else if (text.includes('aux notes') || text.includes('Ox notes') || text.includes('ox notes')) {
        replyP = createReply('opening oxnotes');
        textToSpeech('Please wait a moment. Opening oxnotes website.');
        texts.appendChild(replyP);
        // textToSpeech('Welcome to oxnotes, these are the sections you can go to in this website.');
        // readtextFile('Text_com/oxnotes_links.txt');
        // url = 'https://www.oxnotes.com/igcse-mathematics.html';
        chrome.runtime.sendMessage({ action: 'openNewTab', url: 'https://www.oxnotes.com/igcse-mathematics.html'});
        // chrome.runtime.sendMessage({ action: 'readHeadings', url: url });
    }
    else if (text.includes('mathplanet') || text.includes('math planet') || text.includes('maths planet')) {
        replyP = createReply('opening mathplanet website');
        textToSpeech('Please wait a moment. Opening mathplanet website.');
        texts.appendChild(replyP);
        // textToSpeech('Welcome to mathplanet website, these are the sections you can go to in this website.' ) 
        // readtextFile('Text_com/mathplanet_links.txt');
        // url = 'https://www.mathplanet.com/education/algebra-2';
        chrome.runtime.sendMessage({ action: 'openNewTab', url: 'https://www.mathplanet.com/education/algebra-2'});
        // chrome.runtime.sendMessage({ action: 'readHeadings', url: url });
    }
    else if (text.includes('online notes') || text.includes('pauls online notes') || text.includes('paulsonlinenotes')) {
        replyP = createReply('opening pauls online notes website');
        textToSpeech('Please wait a moment. Opening Pauls online notes website.');
        texts.appendChild(replyP);
        // textToSpeech('Welcome to pauls online notes. These are the sections you can go to in this website');
        // readtextFile('Text_com/paul_links.txt');
        goToSectionPaulBoolean = true;
        // url = 'https://tutorial.math.lamar.edu/Classes/Alg/Alg.aspx';
        chrome.runtime.sendMessage({ action: 'openNewTab', url: 'https://tutorial.math.lamar.edu/Classes/Alg/Alg.aspx'});
        // chrome.runtime.sendMessage({ action: 'readHeadings', url: url });
    }    
    else if (text.includes('the basics') || text.includes('exponents') || text.includes('simplifying') || text.includes('factoring') || text.includes('logarithms') || text.includes('polynomials') || text.includes('linear equations') || text.includes('quadratic equations') || text.includes('solving word questions') || text.includes('functions') || text.includes('sequences and series')) {
        if (goToSectionBoolean) {
            goToSection(text);
        } else {
            const userInput = text.toLowerCase(); 
            // assign userInput to a variable
            console.log('User Input:', userInput);
            chrome.runtime.sendMessage({ action: 'userInput', userInput: text });
        }
    }
    else if (text.includes('preliminaries') || text.includes('solving equations') || text.includes('graphing') || text.includes('common graphs') || text.includes('polynomial functions') || text.includes('exponential and logarithm functions') || text.includes('systems of equations')) {
        if (goToSectionPaulBoolean) {  
            goToSectionPaul(text);  
        } else {
            const userInput = text.toLowerCase(); 
            // assign userInput to a variable
            console.log('User Input:', userInput);
            chrome.runtime.sendMessage({ action: 'userInput', userInput: text });
        }
    }
    else {
        const userInput = text.toLowerCase(); 
        // assign userInput to a variable
        console.log('User Input:', userInput);
        chrome.runtime.sendMessage({ action: 'userInput', userInput: text });
    }
}

function goToSection(text) {
    const section = extractSection(text);
    console.log(section);
    if (isValidSection(section)) {
        const sectionFiles = {
            'the basics': 'Text_com/mathsisfun_thebasics.txt',
            'exponents': 'Text_com/mathsisfun_exponents.txt',
            'simplifying': 'Text_com/mathsisfun_simplifying.txt',
            'factoring': 'Text_com/mathsisfun_factoring.txt',
            'logarithms': 'Text_com/mathsisfun_logarithms.txt',
            'polynomials': 'Text_com/mathsisfun_polynomials.txt',
            'linear equations': 'Text_com/mathsisfun_linearequations.txt',
            'quadratic equations': 'Text_com/mathsisfun_quadraticequations.txt',
            'solving word questions': 'Text_com/mathsisfun_solvingwordequations.txt',
            'functions': 'Text_com/mathsisfun_functions.txt',
            'sequences and series': 'Text_com/mathsisfun_sequencesandseries.txt'
        }; 

        if (section in sectionFiles) {
            readtextFile(sectionFiles[section]);
            const content = `This is the content for ${section} section.`;
            textToSpeech(content, () => {
                sectionCount++;
                console.log(`Section "${section}" identified ${sectionCount} times.`);

                if (sectionCount >= 1) {
                    return; // Terminate the function
                }
            });
        } else {
            textToSpeech('Invalid section mentioned. Please try again.');
            console.log('Invalid section mentioned:', section);
        }
    } 
}

function goToSectionPaul(text) {
    const section = extractSection(text);
    console.log(section);
    if (isValidSectionPaul(section)) {
        const sectionFiles = {
            'preliminaries': 'Text_com/paul_preliminaries.txt',
            'solving equations and inequalities': 'Text_com/paul_solvingequationsandinqualities.txt',
            'graphing and functions': 'Text_com/paul_graphingandfunctions.txt',
            'common graphs': 'Text_com/paul_commongraphs.txt',
            'polynomial functions': 'Text_com/paul_polynomialfunctions.txt',
            'exponential and logarithm functions': 'Text_com/paul_exponentialandlogarithmfunctions.txt',
            'systems of equations': 'Text_com/paul_systemsofequations.txt'
        };

        if (section in sectionFiles) {
            readtextFile(sectionFiles[section]);
            const content = `This is the content for ${section} section.`;
            textToSpeech(content, () => {
                sectionCount++;
                console.log(`Section "${section}" identified ${sectionCount} times.`);

                if (sectionCount >= 1) {
                    return; // Terminate the function
                }
            });
        } else {
            textToSpeech('Invalid section mentioned. Please try again.');
            console.log('Invalid section mentioned:', section);
        }
    }
}

function extractSection(text) {
    //extract the section from the command
    const match = text.toLowerCase().match(/(\b(?:the basics|exponents|simplifying|factoring|logarithms|polynomials|linear equations|quadratic equations|solving word questions|functions|sequences and series|preliminaries|solving equations and inequalities|graphing and functions|common graphs|polynomial functions|exponential and logarithm functions|systems of equations)\b)/i);
    return match ? match[1] : ''; // Return the captured section
}

function isValidSection(section) {
    //check if the extracted section is valid
    const validSections = ['the basics', 'exponents', 'simplifying', 'factoring', 'logarithms', 'polynomials', 'linear equations', 'quadratic equations', 'solving word questions', 'functions', 'sequences and series'];
    return validSections.includes(section);
}

function isValidSectionPaul(section) {
    //check if the extracted section is valid for Paul's online notes
    const validSectionsPaul = ['preliminaries', 'solving equations and inequalities', 'graphing and functions', 'common graphs', 'polynomial functions', 'exponential and logarithm functions', 'systems of equations'];
    return validSectionsPaul.includes(section);
}

function createReply(replyText) {
    let replyP = document.createElement('p');
    replyP.classList.add('reply');
    replyP.innerText = replyText;
    return replyP;
}

function startRecognition() {
    if (!isRecognizing) {
        if (recognition && recognition.readyState === 'listening') {
            recognition.start();
            isRecognizing = true;
        } else {
            console.log('Recognition is already in progress');
        }
    }
}

function stopRecognition() {
    if (recognition && recognition.readyState === 'listening') {
        recognition.stop();
        isRecognizing = false;
    } else {
        console.log('Recognition is not in progress');
    }
}

function textToSpeech(text, callback) {
    stopRecognition(); // Stop recognition if it's in progress

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = function() {
        stopRecognition(); // Stop recognition if it starts during speech synthesis
        recognition.abort();
    };
    utterance.onend = function() {
        if (callback && typeof callback === 'function') {
            callback();
        }
        setTimeout(startRecognition, 6000);
        // startRecognition(); // Start recognition after speech synthesis ends
    };

    window.speechSynthesis.speak(utterance);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'goToSection') {
        goToSectionBoolean = true;
    }
    if (request.action === 'goToSectionPaul') {
        goToSectionPaulBoolean = true;
    }
    if (request.action === 'callReadtextFile') {
        const { filename } = request;
        readtextFile(filename);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'contentUpdated') {
        // Access the content from the request object
        const content = request.content;
        // Process the content as needed
        textToSpeech(content, () => {
            console.log('Content read:', content);
        });
    }
});

function readtextFile(filename) {
    console.log('DOMContentLoaded event fired.');

    const fileContentArray = []; // Create a new array to store the file content
    chrome.runtime.getPackageDirectoryEntry(function (rootDir) {
        console.log('Got package directory entry.');

        rootDir.getFile(filename, {}, function (fileEntry) {
            console.log('Got file entry.');

            fileEntry.file(function (file) {
                console.log('Got file.');

                const reader = new FileReader();

                reader.onloadend = function (e) {
                    console.log('File loaded successfully.');

                    const content = e.target.result;
                    const lines = content.split('\n'); // Split the content into an array of lines
                    fileContentArray.push(...lines); // Add the lines to the fileContentArray

                    console.log('File content array:', fileContentArray);
                    readTextArray(fileContentArray); // Call the function to read the file content array using TTS
                };

                reader.readAsText(file);
            });
        });
    });
}

function readTextArray(array) {
    array.forEach(line => {
        textToSpeech(line, () => {
            console.log('Line read:', line);
        });
    });
}

startSpeechRecognition(); //start when the window is opened


// function textToSpeech(text, callback) {
//     if (recognition && isRecognizing) {
//         recognition.stop();
//         isRecognizing = false;
//     }
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onend = function() {
//         if (callback && typeof callback === 'function') {
//             callback();
//         }
//         if (recognition) {
//             recognition.start();
//             isRecognizing = true;
//         }
//     };
//     window.speechSynthesis.speak(utterance);
// }

// document.addEventListener('DOMContentLoaded', function() {
//     readtextFile();
// });