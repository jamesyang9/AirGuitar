(function() {
    'use strict';

    var guitar;

    var chords = {
        'Open': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'Em':   ['E2', 'C3', 'E3', 'G3', 'B3', 'E4'],
        'G':    ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'],
        'D':    [            'D3', 'A3', 'D4', 'G4'],
        'A':    [      'A2', 'E3', 'A3', 'E4', 'A4'],
        'C':    [      'C3', 'E3', 'G3', 'C4', 'E4'],
        'B':    [      'B2', 'F3', 'B3', 'D4', 'G4'], // ??
        'Am':   ['E2', 'A2', 'E3', 'A3', 'C4', 'E4'],
        'As':   ['Bb2', 'D3', 'F3', 'Bb3', 'D4'],
        'F':    ['F2', 'A2', 'F3', 'A3', 'C4', 'F4'],
        'Cs':   ['F2', 'Ab2', 'Db3', 'F3', 'Ab3', 'Db4']
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
        //['Em', 'G', 'Em', 'G', 'C', 'D']
        //['G', 'Em', 'C', 'D']
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
                var volume = 0.8 + j / chord.length * 0.2;
                play(chord[down ? j : (chord.length - j - 1)], volume);
            }, {}, i), current.chordDelay * i);
        }
    }

    var usingKey = false;
    var chordHeld;
    $(document).keydown(function(e) {
        usingKey = true;
        if (e.which == 82) {
            chordIndex = 0;
            repeats = 0;
        }
        chordHeld = chordKeyCodes[e.which];
    });

    $(document).keyup(function(e) {
        if (chordKeyCodes[e.which] == chordHeld) {
            usingKey = false;
        }
    });

    $('button').click(function() {
        $('button').removeClass('current');
        $(this).addClass('current');
        
        current.mode = this.id;
        switch (current.mode) {
        case 'easy':
        case 'medium':
            current.chordDelay = 15;
		    current.strumThreshold = 600;
            break;

        case 'harp':
            current.chordDelay = 150;
		    current.strumThreshold = 800;
            break;
        }
    });

    var down = true;
    var chordIndex = 0;
    var repeats = 0;
    var prog = 0;

    window.onStrum = function() {
        if (usingKey && chordHeld) {
            playChord(chords[chordHeld], down);
            down = !down;
            return;
        }
        
        switch (current.mode) {
        case 'easy':
            var chord = tranpose(chords[progressions[prog][chordIndex]], Math.floor((current.chord - 2) / 2));
            if (repeats == 1) {
                if (chordIndex == progressions[prog].length - 1) {
                    prog = ++prog % progressions.length;
                    chordIndex = 0;
                } else {
                    chordIndex = ++chordIndex % progressions[prog].length;
                }

                current.chord = chordIndex;
                onNoteChange();
                repeats = 0;
            } else {
                repeats++;
            }
            playChord(chord, down);
            break;

        case 'medium':
            var progression = ['G', 'As', 'C', 'Cs'];
            playChord(chords[progression[Math.min(current.chord, 3)]], down)
            break;

        case 'harp':
            var chordNames = _.keys(chords);
            playChord(chords[chordNames[current.chord]], down);
            break;
        }

        down = !down;
    }

    window.onNoteChange = function() {
        var chord;
        if (usingKey && chordHeld) {
            chord = chordHeld;
        } else {
            switch (current.mode) {
            case 'easy':
                chord = progressions[prog][current.chord];
                break;
                
            case 'medium':
                var progression = ['G', 'As', 'C', 'Cs'];
                chord = progression[Math.min(current.chord, 3)]
                break;
                
            case 'harp':
                var chordNames = _.keys(chords);
                chord = chordNames[current.chord];
                break;
            }
        }

        $('#chord').html(chord);
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
