module.exports = {
    getInitialState: function () {
        var frame = new Array(28);
        for (var i = 0; i < 28; i++) { frame[i] = 0; }

        return {
            frame: frame
        };
    },

    hook_scan: function (data) {
        var pixels = 0,
            i;

        // Map all output bits to 28bit integer
        for (i = 9; i >= 2; i--) {
            pixels |= data[i] << ((i - 2) * 4);
        }

        // Update entries where bit is "hi"
        for (i = 0; i < 28; i++) {
            if (pixels & (1 << i)) {
                this.state.frame[i] = pixels;
            }
        }
    }
}
