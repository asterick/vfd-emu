var D553 = require("../d553"),
    ROMS = require("../roms");

var Stream = require("../util/audiostream");

function Dracula() {
    var stream = new Stream(),
        cpu = new D553(ROMS.EPOCH_DRACULA);

    this.cpu = cpu;

    this.cpu.audio(stream.sampleRate, 100000, function () {
        stream.output(cpu.outputs[8] >> 2);
    })
}

Dracula.prototype.tick = function (ticks) {
    this.cpu.clock(ticks);
};

module.exports = Dracula;
