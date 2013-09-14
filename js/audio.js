(function() {
    'use strict';

    var guitar;

    function play(src, volume) {
        var audio = document.createElement('audio');
        audio.autoplay = true;
        audio.src = src;
        audio.volume = volume;
        document.body.appendChild(audio);    
    }

    var chords = {
        'Open': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'Em':   ['E2', 'G3', 'C3', 'G3', 'B3', 'E4'],
        'G':    ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'],
        'D':    [            'D3', 'A4', 'D4', 'Gb4'],
        'A':    [      'A2', 'E3', 'A4', 'Db4', 'E4'],
        'C':    [      'C2', 'E3', 'G3', 'D4', 'E4']
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
    ]

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
        _.each(document.getElementsByTagName('audio'), fadeOut);
        
        for (var i = 0; i < chord.length; i++) {
            setTimeout(_.bind(function(j) {
                var volume = 0.7 + j / chord.length * 0.3;
                play(guitar[chord[down ? j : (chord.length - j - 1)]], volume);
            }, {}, i), 10 * i);
        }
    }

    var down = true;
    var chordIndex = 0;
    var repeats = 0;
    var prog = 1;
    window.onStrum = function() {
        var chord = tranpose(chords[progressions[prog][chordIndex]], current.chord);
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
        down = !down;
    }

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_guitar_steel",
        callback: function() {        
            guitar = MIDI.Soundfont.acoustic_guitar_steel;
            /*setInterval(function() {
                var chord = chords[progressions[prog][chordIndex]];
                if (repeats == 1) {
                    chordIndex = ++chordIndex % progressions[prog].length;
                    repeats = 0;
                } else {
                    repeats++;
                }
                playChord(chord, down);
                down = !down;
            }, 1000);*/
        }
    });
})();