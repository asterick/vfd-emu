module.exports = function (rate) {
    var mixin = {
        _schedule: function () {
            this.setState({
                _animID: window.requestAnimationFrame(this._advance)
            });
        },

        componentDidMount: function () {
            this._schedule();
        },

        componentDidUnmount: function () {
            window.cancelAnimationFrame(this.state._animID);
        }
    }

    var prev = +new Date();

    if (rate % 1000) {
        var acc = 0;

        mixin._advance = function () {
            var time = +new Date();

            acc += (time - prev) * rate;
            prev = time;

            this.update((acc / 1000)|0);
            acc %= 1000;

            this._schedule();
        };
    } else {
        rate /= 1000;

        mixin._advance = function () {
            var time = +new Date();

            this.update((time - prev) * rate);
            prev = time;

            this._schedule();
        };
    }

    return mixin;
};
