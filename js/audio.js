(function() {
    'use strict';

    var guitar;

    var chords = {
        'Open': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'Em':   ['E2', 'G3', 'C3', 'G3', 'B3', 'E4'],
        'G':    ['G2', 'B2', 'D2', 'G2', 'B2', 'G3'],
        'D':    [            'D3', 'A4', 'D4', 'Gb4'],
        'A':    [      'A2', 'A4', 'Db4', 'E4', 'A5'],
        'C':    [      'C2', 'G3' , 'C4', 'E4', 'G4'],
        'B':    ['B2', 'Eb3', 'Gb3', 'B4', 'Eb4', 'Gb4'],
        'Am':   ['A2', 'C3', 'E3', 'A4', 'C4', 'E4'],
        //'As':   ['Bb2','Bb3','Bb4','Bb5'],
        'As':   [      'D2', 'F3', 'C4', 'D4', 'F4'],
        'F':    ['F2', 'A3', 'C3', 'F3' ,'A4', 'C4'],
        'Cs':   ['Db1', 'Db2','Db3','Db4','Db5'] 
    }

    /*
     * I: g major
     * II: a minor
     * III: b minor
     * IV: c major
     * V: d major
     * VI: e minor
     */

    var progressions = [
        ['Em', 'G', 'D', 'A'],
        ['G', 'Em', 'C', 'D']
        // Gm, D7, G7
    ]

    var chordKeyCodes = {
        65: 'A',
        83: 'Am',
        68: 'D', 
        69: 'Em',
        71: 'G',
        67: 'C',
        66: 'B',
        70: 'F',
        81: 'As',
        86: 'Cs'
    }

    function play(note, volume) {
        var audio = $('#' + note)[0];
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play();
    }

    function tranpose(chord, octaves) {
        var newChord = [];
        _.forEach(chord, function(note) {
            var num = parseInt(note[note.length - 1], 10);
            newChord.push(note.substr(0, note.length - 1) + (num + octaves));
        });

        return newChord;
    }

    function fadeOut(audio) {
        for (var i = 0; i < 10; i++) {
            setTimeout(_.bind(function(j) {
                audio.volume = (10 - j) / 10;
            }, {}, i), i * 300);
        }
        setTimeout(function() {
            audio.remove();
        }, 3000);
    }

    function playChord(chord, down) { 
        //_.each(document.getElementsByTagName('audio'), fadeOut);
        
        for (var i = 0; i < chord.length; i++) {
            setTimeout(_.bind(function(j) {
                var volume = 0.7 + j / chord.length * 0.3;
                play(chord[down ? j : (chord.length - j - 1)], volume);
            }, {}, i), 150 * i);
        }
    }

    var usingKey = false;
    var chordHeld;
    $(document).keydown(function(e) {
        usingKey = true;
        chordHeld = chordKeyCodes[e.which];
        //playChord(chords[chordHeld], down);
    });

    $(document).keyup(function(e) {
        if (chordKeyCodes[e.which] == chordHeld) {
            usingKey = false;
        }
    });

    var down = true;
    var chordIndex = 0;
    var repeats = 0;
    var prog = 1;
    window.onStrum = function() {
        if (usingKey && chordHeld) {
            playChord(chords[chordHeld], down);
        } else {
            var chord = tranpose(chords[progressions[prog][chordIndex]], Math.floor((current.chord - 2) / 2));
            console.log(chordIndex, prog);
            if (repeats == 1) {
                if (chordIndex == progressions[prog].length - 1) {
                    prog = ++prog % progressions.length;
                    chordIndex = 0;
            } else {
                chordIndex = ++chordIndex % progressions[prog].length;
            }
            repeats = 0;
            } else {
                repeats++;
            }
            playChord(chord, down);
        }

        down = !down;
    }

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "electric_guitar_jazz",
        callback: function() {        
            //guitar = MIDI.Soundfont.acoustic_guitar_steel;
            guitar = MIDI.Soundfont[_.keys(MIDI.Soundfont)[0]];
            _.each(guitar, function(src, key) {
                var audio = document.createElement('audio');
                audio.src = src;
                audio.id = key;
                document.body.appendChild(audio);    
            });
        }
    });
})();
