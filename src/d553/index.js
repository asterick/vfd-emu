var Table = require("./table");

function D553(rom) {
    this.ROM_MASK = rom.length - 1;

    this.rom = rom;
    this.ram = new Uint8Array(128);
    this.overflow = 0;

    // Program cursor (stack treated as a ring buffer)
    this.pc_set = [0,0,0,0];
    this.sp = 0;
    this.tc = 0;

    this.inputs      = [
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0];
    this.outputs     = [
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0];
    this.output_mask = [
        0x0,0x0,0xF,0xF,
        0xF,0xF,0xF,0xF,
        0x7,0x0,0x0,0x0,
        0x0,0x0,0x0,0x0];

    this.reset();
}

Object.defineProperties(D553.prototype, {
    pc: {
        get: function () {
            return this.pc_set[this.sp];
        },
        set: function (v) {
            this.pc_set[this.sp] = v & this.ROM_MASK;
        }
    },

    dp: {
        get: function () {
            return this.dp_l | (this.dp_h << 4);
        },
        set: function (v) {
            this.dp_l = v & 0x0F;
            this.dp_h = (v >> 4) & 0x07;
        }
    },

    flag: {
        get: function () {
            return this.ram[0x79];
        },
        set: function (v) {
            this.ram[0x79] = v;
        }
    },

    z: {
        get: function () {
            return this.ram[0x7A];
        },
        set: function (v) {
            this.ram[0x7A] = v;
        }
    },


    w: {
        get: function () {
            return this.ram[0x7B];
        },
        set: function (v) {
            this.ram[0x7B] = v & 0xF;
        }
    },


    s: {
        get: function () {
            return this.ram[0x7C];
        },
        set: function (v) {
            this.ram[0x7C] = v & 0xF;
        }
    },


    r: {
        get: function () {
            return this.ram[0x7D];
        },
        set: function (v) {
            this.ram[0x7D] = v & 0xF;
        }
    },


    y: {
        get: function () {
            return this.ram[0x7E];
        },
        set: function (v) {
            this.ram[0x7E] = v & 0xF;
        }
    },


    x: {
        get: function () {
            return this.ram[0x7F];
        },
        set: function (v) {
            this.ram[0x7F] = v & 0xF;
        }
    }
});

D553.prototype.reset = function () {
    this.pc = 0;

    // Registers
    this.acc = 0;
    this.tc = 0;
    this.dp_l = 0;
    this.dp_h = 0;

    // Flip flops
    this.carry_ff = false;
    this.carry_s_ff = false;
    this.int_ff = false;
    this.ie_ff = false;
    this.tim_ff = false;
};

D553.prototype.input = function (port) {
    return this.outputs[port] | this.inputs[port];
};

D553.prototype.output = function (port, value) {
    this.outputs[port] = this.output_mask[port] & value;
};

D553.prototype.next = function () {
    var data = this.rom[this.pc];
    this.pc = (this.pc & ~0xFF) | ((this.pc + 1) & 0xFF);
    return data;
};

D553.prototype.call = function (next) {
    this.sp = (this.sp + 1) & 3;
    this.pc = next;
};

D553.prototype.ret = function () {
    this.sp = (this.sp - 1) & 3;
};

D553.prototype.clock = function (ticks) {
    this.overflow += ticks;

    while (this.overflow > 0) {
        this.step();
    }
};

D553.prototype.interrupt = function () {
    this.int_ff = true;
}

D553.prototype.tick = function (cycles) {
    this.overflow -= cycles;
    this.tc -= cycles;
    if (this.tc <= 0) { this.tim_ff = true; }
};

D553.prototype.step = function () {
    // Interrupt logic (might be wrong)
    if (this.ie_ff && this.int_ff) {
        this.overflow -= 2;
        this.call(0x3C);
        this.int_ff = false;
    }

    // Load instruction formation
    var inst = this.next(),
        data = inst,
        op = Table[data];

    this.tick(op.clocks);

    if (!op) {
        throw new Error("Unknown opcode " + data.toString(16));
    }

    for (var b = 1; b < op.bytes; b++) {
        data = (data << 8) | this.next();
    }

    var mask = (1 << op.immediate) - 1,
        imm = data & mask;

    op.execute.call(this, imm);

    this.prev_op = inst;
};

D553.prototype.skip = function () {
    var op = Table[this.next()];

    for (var i = op.bytes; i > 1; i--) {
        this.next();
    }

    this.tick(op.bytes);
};

module.exports = D553;
