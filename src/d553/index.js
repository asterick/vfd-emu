function D553(rom) {
    this.ROM_MASK = rom.length - 1;

    this.rom = rom;
    this.ram = new Uint8Array(128);
    this.overflow = 0;

    // Program cursor (stack treated as a ring buffer)
    this.pc_set = [0,0,0,0];
    this.sp = 0;

    // Registers
    this.acc = 0;
    this.r = 0;
    this.s = 0;
    this.w = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.tc = 0;

    // Flip flops
    this.carry_ff = false;
    this.carry_s_ff = false;
    this.int_ff = false;
    this.ie_ff = false;
    this.tim_ff = false;
}

Object.defineProperties(D553.prototype, {
    pc: {
        get: function () {
            return this.pc_set[this.sp];
        },
        set: function (v) {
            this.pc_set[this.sp] = v & this.ROM_MASK;
        }
    }
});

D553.prototype.push = function () {
    var cur = this.pc;
    this.sp = (this.sp + 1) & 3;
    this.pc = cur;
};

D553.prototype.pop = function () {
    this.sp = (this.sp - 1) & 3;
}

D553.prototype.step = function (ticks) {
    this.overflow += ticks;

    do {
        this.eval();
    } while ((this.overflow -= 4) > 0);
};

D553.prototype.eval = function () {
    var op = this.rom[this.pc++];

    if (op & 0x80) {
        this.eval_wide(op);
    } else {
        this.eval_narrow(op);
    }

    this.prev_op = op;
};


D553.prototype.eval_narrow = function (op) {
    var imm = op & 0x03;

    switch (op) {
    case 0x00: // NOP
        break ;
    case 0x01: // DI
        this.ie_ff = false;
        break ;
    case 0x02: // S
    case 0x03: // TIT
    case 0x04: // TC
    case 0x05: // TTM
    case 0x06: // DAA
    case 0x07: // TAL
    case 0x08: // AD
    case 0x09: // ADS
    case 0x0A: // DAS
    case 0x0B: // CLC
    case 0x0C: // CM
    case 0x0D: // INC
    case 0x0E: // OP
    case 0x0F: // DEC
    case 0x10: // CMA
    case 0x11: // CIA
    case 0x12: // TLA
    case 0x13: // DED
    case 0x14: // STM
    case 0x15: // LDI #Data7
    case 0x16: // CLI #data
    case 0x17: // CI #Data
    case 0x18: // EXL
    case 0x19: // ADC
    case 0x1A: // XC
    case 0x1B: // STC
    case 0x1D: // INM
    case 0x1E: // OCD
    case 0x1F: // DEM
    case 0x20: case 0x21: case 0x22: case 0x23: // FBF
    case 0x24: case 0x25: case 0x26: case 0x27: // TAB
    case 0x28: case 0x29: case 0x2A: case 0x2B: // XM
    case 0x2C: case 0x2D: case 0x2E: case 0x2F: // XMD
    case 0x30: // RAR
    case 0x31: // EI
    case 0x32: // IP
    case 0x33: // IND
    case 0x34: case 0x35: case 0x36: case 0x37: // CMB
    case 0x38: case 0x39: case 0x3A: case 0x3B: // LM
    case 0x3C: case 0x3D: case 0x3E: case 0x3F: // XMI

    case 0x40: // IA
    case 0x41: // JPA
    case 0x42: // TAZ
    case 0x43: // TAW
    case 0x44: // OE
    case 0x46: // TLY
    case 0x47: // THX
    case 0x48: // RT
    case 0x49: // RTS
    case 0x4A: // XAZ
    case 0x4B: // XAW
    case 0x4C: // XLS
    case 0x4D: // XHR
    case 0x4E: // XLY
    case 0x4F: // XHX

    case 0x50: case 0x51: case 0x52: case 0x53: // TPB
    case 0x54: case 0x55: case 0x56: case 0x57: // TPA
    case 0x58: case 0x59: case 0x5A: case 0x5B: // TMB
    case 0x5C: case 0x5D: case 0x5E: case 0x5F: // FBT
    case 0x60: case 0x61: case 0x62: case 0x63: // RPB
    case 0x64: case 0x65: case 0x66: case 0x67: // REB
    case 0x68: case 0x69: case 0x6A: case 0x6B: // RMB
    case 0x6C: case 0x6D: case 0x6E: case 0x6F: // RFB
    case 0x70: case 0x71: case 0x72: case 0x73: // SPB
    case 0x74: case 0x75: case 0x76: case 0x77: // SEB
    case 0x78: case 0x79: case 0x7A: case 0x7B: // SMB
    case 0x7C: case 0x7D: case 0x7E: case 0x7F: // SFB

    default:
        throw new Error("UNHANDLED OP: " + op.toString(16));
    }
};

D553.prototype.eval_wide = function (op) {
    var imm = op & 0xF, addr;

    switch (op & 0xF0) {
    /* LDZ */ case 0x80:
        this.dp = imm;
        break ;

    /* LI  */ case 0x90:
        if (this.prev_op & 0xF0 !== 0x90) {
            this.a = imm;
        }
        break ;

    /* JMP / CAL */ case 0xA0:
        addr = ((imm & 0x07) << 8) | this.rom[this.pc++];
        if (imm & 0x08) this.push();
        this.pc = imm;
        break ;

    /* CZP */ case 0xB0:
        this.push();
        this.pc = imm << 2;
        break ;

    /* JCP */ case 0xC0: case 0xD0: case 0xE0: case 0xF0:
        this.pc = (this.pc & ~0x3F) | (op & 0x3F);
        break ;
    default:
        throw new Error("Unhandled op: " + op)
    }
};

module.exports = D553;
