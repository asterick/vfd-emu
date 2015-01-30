function D553(rom) {
    this.ROM_MASK = rom.length - 1;

    this.rom = rom;
    this.ram = new Uint8Array(128);
    this.overflow = 0;

    // Program cursor (stack treated as a ring buffer)
    this.pc_set = [0,0,0,0];
    this.sp = 0;

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

};

D553.prototype.output = function (port, value) {

};

D553.prototype.next = function () {
    var data = this.rom[this.pc];
    this.pc = (this.pc & ~0xFF) | ((this.pc + 1) & 0xFF);
    return data;
};

D553.prototype.push = function () {
    var cur = this.pc;
    this.sp = (this.sp + 1) & 3;
    this.pc = cur;
};

D553.prototype.pop = function () {
    this.sp = (this.sp - 1) & 3;
};

D553.prototype.clock = function (ticks) {
    this.overflow += ticks;

    do {
        this.step();
    } while ((this.overflow -= 4) > 0);
};

D553.prototype.step = function () {
    var op = this.next();

    if (op & 0x80) {
        this.eval_wide(op);
    } else {
        this.eval_narrow(op);
    }

    this.prev_op = op;
};

D553.prototype.skip = function () {
    var o = this.next();

    // Two byte instructions
    if ((o        === 0x1E)
        (o & 0xFC === 0x14)
        (o & 0xF0 === 0xA0)) {
        this.next();
    }
};

D553.prototype.eval_narrow = function (op) {
    var imm = op & 0x03,
        temp;

    switch (op) {
    // ---- Load ----
    /* LM  */ case 0x38: case 0x39: case 0x3A: case 0x3B:
        debugger ;
        this.acc = this.ram[this.dp];
        this.dp_h ^= imm;
        break ;
    /* LDI */ case 0x15:
        debugger ;
        this.dp = this.next()& 0x7F;
        break ;

    // ---- Store ----
    /* S   */ case 0x02:
        debugger ;
        this.ram[this.dp] = this.acc;
        break ;

    // ---- Transfer ----
    /* TAL */ case 0x07:
        debugger ;
        this.dp_l = this.acc;
        break ;
    /* TLA */ case 0x12:
        debugger ;
        this.acc = this.dp_l;
        break ;
    /* TAW */ case 0x43:
        debugger ;
        this.w = this.acc;
        break ;
    /* TAZ */ case 0x42:
        debugger ;
        this.z = this.acc;
        break ;
    /* THX */ case 0x47:
        debugger ;
        this.x = this.dp_h;
        break ;
    /* TLY */ case 0x46:
        debugger ;
        this.y = this.dp_l;
        break ;

    // ---- Exchange ----
    /* XM  */ case 0x28: case 0x29: case 0x2A: case 0x2B:
        debugger ;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;
        break ;
    /* XMI */ case 0x3C: case 0x3D: case 0x3E: case 0x3F:
        debugger ;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) { this.skip(); }
        break ;
    /* XMD */ case 0x2C: case 0x2D: case 0x2E: case 0x2F:
        debugger ;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) { this.skip(); }
        break ;
    /* XAW */ case 0x4B:
        debugger ;
        temp = this.acc;
        this.acc = this.w;
        this.w = temp;
        break ;
    /* XAZ */ case 0x4A:
        debugger ;
        temp = this.acc;
        this.acc = this.z;
        this.z = temp;
        break ;
    /* XHR */ case 0x4D:
        debugger ;
        temp = this.dp_h;
        this.dp_h = this.r;
        this.r = temp;
        break ;
    /* XHX */ case 0x4F:
        debugger ;
        temp = this.dp_h;
        this.dp_h = this.x;
        this.x = temp;
        break ;
    /* XLS */ case 0x4C:
        debugger ;
        temp = this.dp_l;
        this.dp_l = this.s;
        this.s = temp;
        break ;
    /* XLY */ case 0x4E:
        debugger ;
        temp = this.dp_l;
        this.dp_l = this.y;
        this.y = temp;
        break ;
    /* XC */ case 0x1A:
        debugger ;
        temp = this.carry_s_ff;
        this.carry_s_ff = this.carry_ff;
        this.carry_ff = temp;
        break ;

    // ---- Arithmatic ----
    /* AD  */ case 0x08:
        debugger ;
        this.acc += this.ram[this.dp];
        if (this.acc > 0xF) {
            this.acc &= 0xF;
            this.skip();
        }
        break ;
    /* ADC */ case 0x19:
        debugger ;
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (thos.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
        }
        break ;
    /* ADS */ case 0x09:
        debugger ;
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (thos.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
            this.skip();
        }
        break ;
    /* DAA */ case 0x06:
        debugger ;
        this.acc = (this.acc + 6) & 0xF;
        break ;
    /* DAS */ case 0x0A:
        debugger ;
        this.acc = (this.acc + 10) & 0xF;
        break ;

    // ---- Logical ----
    /* EXL */ case 0x18:
        debugger ;
        this.acc ^= this.dp_l;
        break ;

    // ---- Accumulator ----
    /* CMA */ case 0x10:
        debugger ;
        this.acc ^= 0xF;
        break ;
    /* CIA */ case 0x11:
        debugger ;
        this.acc = (~this.acc + 1) & 0xF;
        break ;
    /* RAR */ case 0x30:
        debugger ;
        temp = this.acc;
        this.carry_ff = (this.acc & 1) ? true : false;
        this.acc = (temp >> 1) | (this.carry_ff ? 0x08 : 0);
        break ;

    // ---- Carry Flag ----
    /* CLC */ case 0x0B:
        debugger ;
        this.carry_ff = false;
        break ;
    /* STC */ case 0x1B:
        debugger ;
        this.carry_ff = true;
        break ;
    /* TC  */ case 0x04:
        debugger ;
        if (this.carry_ff) { this.skip(); }
        break ;

    // ---- Increment and Decrement ----
    /* INC */ case 0x0D:
        debugger ;
        this.acc = (this.acc + 1) & 0xF;
        if (!this.acc) { this.skip(); }
        break ;
    /* DEC */ case 0x0F:
        debugger ;
        this.acc = (this.acc - 1) & 0xF;
        if (this.acc === 0x0F) { this.skip(); }
        break ;
    /* IND */ case 0x33:
        debugger ;
        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) { this.skip(); }
        break ;
    /* DED */ case 0x13:
        debugger ;
        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) { this.skip(); }
        break ;
    /* INM */ case 0x1D:
        debugger ;
        this.ram[this.dp] = (this.ram[this.dp] + 1) & 0xF;
        if (!this.ram[this.dp]) { this.skip(); }
        break ;
    /* DEM */ case 0x1F:
        debugger ;
        this.ram[this.dp] = (this.ram[this.dp] - 1) & 0xF;
        if (this.ram[this.dp] === 0xF) { this.skip(); }
        break ;

    // ---- Bit Manipulation ----
    /* RMB */ case 0x68: case 0x69: case 0x6A: case 0x6B:
        debugger ;
        this.ram[this.dp] &= ~(1 << imm);
        break ;
    /* SMB */ case 0x78: case 0x79: case 0x7A: case 0x7B:
        debugger ;
        this.ram[this.dp] |= 1 << imm;
        break ;
    /* REB */ case 0x64: case 0x65: case 0x66: case 0x67:
        debugger ;
        this.output(4, this.input(4) & ~(1 << imm));
        break ;
    /* SEB */ case 0x74: case 0x75: case 0x76: case 0x77:
        debugger ;
        this.output(4, this.input(4) | (1 << imm));
        break ;
    /* RPB */ case 0x60: case 0x61: case 0x62: case 0x63:
        debugger ;
        this.output(this.dp_l, this.input(this.dp_l) & ~(1 << imm));
        break ;
    /* SPB */ case 0x70: case 0x71: case 0x72: case 0x73:
        debugger ;
        this.output(this.dp_l, this.input(this.p_l) | (1 << imm));
        break ;

    // ---- Jump, Call and Return ----
    /* JPA */ case 0x41:
        debugger ;
        this.pc = (this.pc & ~0x3F) | (this.acc << 2);
        break ;
    /* RT  */ case 0x48:
        debugger ;
        this.pop();
        break ;
    /* RTS */ case 0x49:
        debugger ;
        this.skip();
        break ;

    // ---- Skip ----
    /* CI  */ case 0x17:
        debugger ;
        if (this.next() & 0xF == this.acc) {
            this.skip();
        }
        break ;
    /* CM  */ case 0x0C:
        debugger ;
        if (this.ram[this.dp] == this.acc) {
            this.skip();
        }
        break ;
    /* CMB */ case 0x34: case 0x35: case 0x36: case 0x37:
        debugger ;
        if ((this.ram[this.dp] ^ ~this.acc) & (1 << imm)) {
            this.skip();
        }
        break ;
    /* TAB */ case 0x24: case 0x25: case 0x26: case 0x27:
        debugger ;
        if (this.acc & (1 << imm)) {
            this.skip();
        }
        break ;
    /* CLI */ case 0x16:
        debugger ;
        if (this.next() & 0xF == this.dp_l) {
            this.skip();
        }
        break ;
    /* TMB */ case 0x58: case 0x59: case 0x5A: case 0x5B:
        debugger ;
        if (this.ram[this.dp] & (1 << imm)) {
            this.skip();
        }
        break ;
    /* TPA */ case 0x54: case 0x55: case 0x56: case 0x57:
        debugger ;
        if (this.read(0) & (1 << imm)) {
            this.skip();
        }
        break ;
    /* TPB */ case 0x50: case 0x51: case 0x52: case 0x53:
        debugger ;
        if (this.read(this.dp_l) & (1 << imm)) {
            this.skip();
        }
        break ;

    // ---- Interrupt ----
    /* EI  */ case 0x31:
        debugger ;
        this.ie_ff = true;
        break ;
    /* DI  */ case 0x01:
        debugger ;
        this.ie_ff = false;
        break ;
    /* TIT */ case 0x03:
        debugger ;
        if (this.int_ff) {
            this.skip();
            this.int_ff = false;
        }
        break ;

    // ---- Parallel I/O ----
    /* IA  */ case 0x40:
        debugger ;
        this.acc = this.input(0);
        break ;
    /* IP  */ case 0x32:
        debugger ;
        this.acc = this.input(this.dp_l);
        break ;
    /* OE  */ case 0x44:
        debugger ;
        this.output(4, this.acc);
        break ;
    /* OP  */ case 0x0E:
        debugger ;
        this.output(this.dp_l, this.acc);
        break ;
    /* OCD */ case 0x1E:
        debugger ;
        imm = this.next();
        this.output(2, imm & 0xF);
        this.output(3, imm >> 4);
        break ;

    // ---- CPU Control ----
    /* NOP */ case 0x00:
        break ;

    // ---- Flag ----
    /* SFB */ case 0x7C: case 0x7D: case 0x7E: case 0x7F:
        debugger ;
        this.flag |= 1 << imm;
        break ;
    /* RFB */ case 0x6C: case 0x6D: case 0x6E: case 0x6F:
        debugger ;
        this.flag &= ~(1 << imm);
        break ;
    /* FBT */ case 0x5C: case 0x5D: case 0x5E: case 0x5F:
        debugger ;
        if (this.flag & (1 << imm)) { this.skip(); }
        break ;
    /* FBF */ case 0x20: case 0x21: case 0x22: case 0x23:
        debugger ;
        if (~this.flag & (1 << imm)) { this.skip(); }
        break ;

    // ---- Timer ----
    /* STM */ case 0x14:
        debugger ;
        this.tim_ff = false;
        this.tc = this.next() & 0x3F;
        // TODO: RESET POLY COUNTER
        break ;

    /* TTM */ case 0x05:
        debugger ;
        if (this.tim_ff) {
            this.skip();
        }
        break ;

    default:
        throw new Error("UNHANDLED OP: " + op.toString(16));
    }
};

D553.prototype.eval_wide = function (op) {
    var imm = op & 0xF;

    switch (op & 0xF0) {
    // ---- Load ----
    /* LI  */ case 0x90:
        debugger ;
        if (this.prev_op & 0xF0 !== 0x90) {
            this.acc = imm;
        }
        break ;
    /* LDZ */ case 0x80:
        debugger ;
        this.dp = imm;
        break ;

    // ---- Jump, Call and Return ----
    /* JMP / CAL */ case 0xA0:
        var addr = ((imm & 0x07) << 8) | this.next();
        if (imm & 0x08) { this.push(); }
        this.pc = addr;
        break ;

    /* JCP */ case 0xC0: case 0xD0: case 0xE0: case 0xF0:
        debugger ;
        this.pc = (this.pc & ~0x3F) | (op & 0x3F);
        break ;

    /* CZP */ case 0xB0:
        debugger ;
        this.push();
        this.pc = imm << 2;
        break ;
    }
};

module.exports = D553;
