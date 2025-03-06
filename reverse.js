const fs = require('fs');

function reverseWord(word) {
    let letters = [...word].filter(char => /\p{L}/u.test(char)); 
    let reversed = letters.reverse(); 
    let letterIndex = 0;

    return [...word].map(char => (/\p{L}/u.test(char) ? reversed[letterIndex++] : char)).join('');
}

let leftover = '';

const readStream = fs.createReadStream('input.txt', { encoding: 'utf8' });
const writeStream = fs.createWriteStream('output.txt');

readStream.on('data', chunk => {
    let text = leftover + chunk; 

    let words = text.split(/(\s+)/);

    if (!/\s$/.test(text)) {
        leftover = words.pop();
    } else {
        leftover = '';
    }

    let processedText = words.map(word => (/\p{L}/u.test(word) ? reverseWord(word) : word)).join('');

    writeStream.write(processedText);
});

readStream.on('end', () => {
    if (leftover) {
        writeStream.write(reverseWord(leftover));
    }
    console.log('Processing complete. Output saved in output.txt.');
});

readStream.on('error', err => console.error('Read Error:', err));
writeStream.on('error', err => console.error('Write Error:', err));