module.exports = {
    // ---- Load ----
    LI: function (imm) {
        if (this.prev_op & 0xF0 !== 0x90) {
            this.acc = imm;
        }
    },
    LM: function(imm) {
        this.acc = this.ram[this.dp];
        this.dp_h ^= imm;
    },
    LDI: function(imm) {
        this.dp = imm;
    },
    LDZ: function (imm) {
        this.dp = imm;
    },

    // ---- Store ----
    S: function() {
        this.ram[this.dp] = this.acc;
    },

    // ---- Transfer ----
    TAL: function() {
        this.dp_l = this.acc;
    },
    TLA: function() {
        this.acc = this.dp_l;
    },
    TAW: function() {
        this.w = this.acc;
    },
    TAZ: function() {
        this.z = this.acc;
    },
    THX: function() {
        this.x = this.dp_h;
    },
    TLY: function() {
        this.y = this.dp_l;
    },

    // ---- Exchange ----
    XM: function(imm) {
        var temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[this.dp] = temp;
        this.dp_h ^= imm;
    },
    XMI: function(imm) {
        var temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[this.dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) {
            this.skip();
        }
    },
    XMD: function(imm) {
        var temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[this.dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) {
            this.skip();
        }
    },
    XAW: function() {
        var temp = this.acc;
        this.acc = this.w;
        this.w = temp;
    },
    XAZ: function() {
        var temp = this.acc;
        this.acc = this.z;
        this.z = temp;
    },
    XHR: function() {
        var temp = this.dp_h;
        this.dp_h = this.r;
        this.r = temp;
    },
    XHX: function() {
        var temp = this.dp_h;
        this.dp_h = this.x;
        this.x = temp;
    },
    XLS: function() {
        var temp = this.dp_l;
        this.dp_l = this.s;
        this.s = temp;
    },
    XLY: function() {
        var temp = this.dp_l;
        this.dp_l = this.y;
        this.y = temp;
    },
    XC: function() {
        var temp = this.carry_s_ff;
        this.carry_s_ff = this.carry_ff;
        this.carry_ff = temp;
    },

    // ---- Arithmatic ----
    AD: function() {
        this.acc += this.ram[this.dp];

        if (this.acc > 0xF) {
            this.acc &= 0xF;
            this.skip();
        }
    },
    ADC: function() {
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (this.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
        }
    },
    ADS: function() {
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (this.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
            this.skip();
        }
    },
    DAA: function() {
        this.acc = (this.acc + 6) & 0xF;
    },
    DAS: function() {
        this.acc = (this.acc + 10) & 0xF;
    },

    // ---- Logical ----
    EXL: function() {
        this.acc ^= this.dp_l;
    },

    // ---- Accumulator ----
    CMA: function() {
        this.acc ^= 0xF;
    },
    CIA: function() {
        this.acc = -this.acc & 0xF;
    },
    RAR: function() {
        var old = this.acc;
        this.acc = (old >> 1) | (this.carry_ff ? 0x08 : 0);
        this.carry_ff = (old & 1) ? true : false;
    },

    // ---- Carry Flag ----
    CLC: function() {
        this.carry_ff = false;
    },
    STC: function() {
        this.carry_ff = true;
    },
    TC: function() {
        if (this.carry_ff) {
            this.skip();
        }
    },

    // ---- Increment and Decrement ----
    INC: function() {
        this.acc = (this.acc + 1) & 0xF;
        if (!this.acc) {
            this.skip();
        }
    },
    DEC: function() {
        this.acc = (this.acc - 1) & 0xF;
        if (this.acc === 0x0F) {
            this.skip();
        }
    },
    IND: function() {
        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) {
            this.skip();
        }
    },
    DED: function() {
        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) {
            this.skip();
        }
    },
    INM: function() {
        this.ram[this.dp] = (this.ram[this.dp] + 1) & 0xF;
        if (!this.ram[this.dp]) {
            this.skip();
        }
    },
    DEM: function() {
        this.ram[this.dp] = (this.ram[this.dp] - 1) & 0xF;
        if (this.ram[this.dp] === 0xF) {
            this.skip();
        }
    },

    // ---- Bit Manipulation ----
    RMB: function(imm) {
        this.ram[this.dp] &= ~(1 << imm);
    },
    SMB: function(imm) {
        this.ram[this.dp] |= (1 << imm);
    },
    REB: function(imm) {
        this.output(4, this.outputs[4] & ~(1 << imm));
    },
    SEB: function(imm) {
        this.output(4, this.outputs[4] | (1 << imm));
    },
    RPB: function(imm) {
        this.output(this.dp_l, this.outputs[4] & ~(1 << imm));
    },
    SPB: function(imm) {
        this.output(this.dp_l, this.outputs[4] | (1 << imm));
    },

    // ---- Jump, Call and Return ----
    JMP: function (imm) {
        this.pc = imm;
    },
    JCP: function (imm) {
        this.pc = (this.pc & ~0x3F) | imm;
    },
    JPA: function() {
        this.pc = (this.pc & ~0x3F) | (this.acc << 2);
    },
    CAL: function (imm) {
        this.call(imm);
    },
    CZP: function (imm) {
        this.call(imm << 2);
    },
    RT: function() {
        this.ret();
    },
    RTS: function() {
        this.ret();
        this.skip();
    },

    // ---- Skip ----
    CI: function(imm) {
        if (imm == this.acc) {
            this.skip();
        }
    },
    CM: function() {
        if (this.ram[this.dp] == this.acc) {
            this.skip();
        }
    },
    CMB: function(imm) {
        if (~(this.ram[this.dp] ^ this.acc) & (1 << imm)) {
            this.skip();
        }
    },
    TAB: function(imm) {
        if (this.acc & (1 << imm)) {
            this.skip();
        }
    },
    CLI: function(imm) {
        if (imm == this.dp_l) {
            this.skip();
        }
    },
    TMB: function(imm) {
        if (this.ram[this.dp] & (1 << imm)) {
            this.skip();
        }
    },
    TPA: function(imm) {
        if (this.input(0) & (1 << imm)) {
            this.skip();
        }
    },
    TPB: function(imm) {
        if (this.input(this.dp_l) & (1 << imm)) {
            this.skip();
        }
    },

    // ---- Interrupt ----
    TIT: function() {
        if (this.int_ff) {
            this.skip();
            this.int_ff = false;
        }
    },
    EI: function() {
        this.ie_ff = true;
    },
    DI: function() {
        this.ie_ff = false;
    },

    // ---- Parallel I/O ----
    IA: function() {
        this.acc = this.input(0);
    },
    IP: function() {
        this.acc = this.input(this.dp_l);
    },
    OE: function() {
        this.output(4, this.acc);
    },
    OP: function() {
        this.output(this.dp_l, this.acc);
    },
    OCD: function(imm) {
        this.output(2, imm & 0xF);
        this.output(3, imm >> 4);
    },

    // ---- CPU Control ----
    NOP: function() {},

    // ---- Flag ----
    SFB: function(imm) {
        this.flag |= 1 << imm;
    },
    RFB: function(imm) {
        this.flag &= ~(1 << imm);
    },
    FBT: function(imm) {
        if (this.flag & (1 << imm)) {
            this.skip();
        }
    },
    FBF: function(imm) {
        if (~this.flag & (1 << imm)) {
            this.skip();
        }
    },

    // ---- Timer ----
    STM: function(imm) {
        this.tim_ff = false;
        this.tc = (imm + 1) * 63;
    },

    TTM: function() {
        if (this.tim_ff) {
            this.skip();
        }
    },
};
