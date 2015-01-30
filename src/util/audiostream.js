var BUFFER_LENGTH = 1 << 12,
    TOTAL_SIZE = BUFFER_LENGTH * 2,
    BUFFER_MASK = TOTAL_SIZE - 1;

function Stream () {
    this.context = window.webkitAudioContext && (new webkitAudioContext());

    if (this.context) {
        this.node = this.context.createScriptProcessor(BUFFER_LENGTH, 2, 2);
        this.node.onaudioprocess = this.process.bind(this);
        this.sampleRate = this.context.sampleRate;
    } else {
        this.sampleRate = 0;
    }

    this.sampleIndex = ~0;
    this.sampleBuffer = new Float32Array(TOTAL_SIZE);

    this.play();
}

Stream.prototype.play = function () {
    if (!this.node) {
        return ;
    }

    this.node.connect(this.context.destination);
};

Stream.prototype.mute = function () {
    if (!this.node) {
        return ;
    }

    this.node.disconnect();
};

Stream.prototype.output = function(s) {
    this.sampleIndex = (this.sampleIndex + 1) & BUFFER_MASK;
    this.sampleBuffer[this.sampleIndex] = s;
};

Stream.prototype.process = function(e) {
    var left = e.outputBuffer.getChannelData(0),
        right = e.outputBuffer.getChannelData(1),
        s = BUFFER_LENGTH & ~this.sampleIndex;

    for(var i = 0; i < left.length; i++, s++) {
        right[i] = left[i] = this.sampleBuffer[s];
    }
};

module.exports = Stream;
