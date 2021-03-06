import * as fc from "fast-check";
import { Fq, Fq2 } from "..";

const NUM_RUNS = Number(process.env.RUNS_COUNT || 10); // reduce to 1 to shorten test time

describe("bls12-381 Fp2", () => {
  it("Fp2 equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        const b = new Fq2([num[0], num[1]]);
        expect(a.equals(b)).toBe(true);
        expect(b.equals(a)).toBe(true);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 non-equality", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          expect(a.equals(b)).toBe(num1[0] === num2[0] && num1[1] === num2[1]);
          expect(b.equals(a)).toBe(num1[0] === num2[0] && num1[1] === num2[1]);
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 square and multiplication equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.square()).toEqual(a.multiply(a));
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 multiplication and add equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.multiply(0n)).toEqual(Fq2.ZERO);
        expect(a.multiply(Fq2.ZERO)).toEqual(Fq2.ZERO);
        expect(a.multiply(1n)).toEqual(a);
        expect(a.multiply(Fq2.ONE)).toEqual(a);
        expect(a.multiply(2n)).toEqual(a.add(a));
        expect(a.multiply(3n)).toEqual(a.add(a).add(a));
        expect(a.multiply(4n)).toEqual(
          a
            .add(a)
            .add(a)
            .add(a)
        );
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 multiplication commutatity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          expect(a.multiply(b)).toEqual(b.multiply(a));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 multiplication associativity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2, num3) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          const c = new Fq2([num3[0], num3[1]]);
          expect(a.multiply(b.multiply(c))).toEqual(a.multiply(b).multiply(c));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 multiplication distributivity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2, num3) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          const c = new Fq2([num3[0], num3[1]]);
          expect(a.multiply(b.add(c))).toEqual(
            b.multiply(a).add(c.multiply(a))
          );
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 division with one equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.div(new Fq2([1n, 0n]))).toEqual(a);
        expect(a.div(Fq2.ONE)).toEqual(a);
        expect(a.div(a)).toEqual(Fq2.ONE);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 division with zero equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(Fq2.ZERO.div(a)).toEqual(Fq2.ZERO);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 division distributivity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2, num3) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          const c = new Fq2([num3[0], num3[1]]);
          expect(a.add(b).div(c)).toEqual(a.div(c).add(b.div(c)));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 addition with zero equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.add(Fq2.ZERO)).toEqual(a);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 addition commutatity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          expect(a.add(b)).toEqual(b.add(a));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 add associativity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2, num3) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          const c = new Fq2([num3[0], num3[1]]);
          expect(a.add(b.add(c))).toEqual(a.add(b).add(c));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 minus zero equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.subtract(Fq2.ZERO)).toEqual(a);
        expect(a.subtract(a)).toEqual(Fq2.ZERO);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 minus and negative equality", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num1[0], num1[1]]);
          expect(Fq2.ZERO.subtract(a)).toEqual(a.negate());
          expect(a.subtract(b)).toEqual(a.add(b.negate()));
          expect(a.subtract(b)).toEqual(a.add(b.multiply(-1n)));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 negative equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.negate()).toEqual(Fq2.ZERO.subtract(a));
        expect(a.negate()).toEqual(a.multiply(-1n));
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 division and multiplitaction equality", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2),
        (num1, num2) => {
          const a = new Fq2([num1[0], num1[1]]);
          const b = new Fq2([num2[0], num2[1]]);
          expect(a.div(b)).toEqual(a.multiply(b.invert()));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 pow and multiplitaction equality", () => {
    fc.assert(
      fc.property(fc.array(fc.bigInt(1n, Fq.ORDER), 2, 2), num => {
        const a = new Fq2([num[0], num[1]]);
        expect(a.pow(0n)).toEqual(Fq2.ONE);
        expect(a.pow(1n)).toEqual(a);
        expect(a.pow(2n)).toEqual(a.multiply(a));
        expect(a.pow(3n)).toEqual(a.multiply(a).multiply(a));
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp2 frobenius", () => {
    expect(Fq2.FROBENIUS_COEFFICIENTS[0].equals(Fq.ONE)).toBe(true);
    expect(Fq2.FROBENIUS_COEFFICIENTS[1].equals(Fq.ONE.negate().pow(0x0f81ae6945026025546c75a2a5240311d8ab75fac730cbcacd117de46c663f3fdebb76c445078281bf953ed363fa069bn))).toBe(true);
    let a = new Fq2([0x00f8d295b2ded9dcccc649c4b9532bf3b966ce3bc2108b138b1a52e0a90f59ed11e59ea221a3b6d22d0078036923ffc7n, 0x012d1137b8a6a8374e464dea5bcfd41eb3f8afc0ee248cadbe203411c66fb3a5946ae52d684fa7ed977df6efcdaee0dbn]);
    a = a.frobeniusMap(0);
    expect(a.equals(new Fq2([0x00f8d295b2ded9dcccc649c4b9532bf3b966ce3bc2108b138b1a52e0a90f59ed11e59ea221a3b6d22d0078036923ffc7n, 0x012d1137b8a6a8374e464dea5bcfd41eb3f8afc0ee248cadbe203411c66fb3a5946ae52d684fa7ed977df6efcdaee0dbn]))).toBe(true);
    a = a.frobeniusMap(1);
    expect(a.equals(new Fq2([0x00f8d295b2ded9dcccc649c4b9532bf3b966ce3bc2108b138b1a52e0a90f59ed11e59ea221a3b6d22d0078036923ffc7n, 0x18d400b280d93e62fcd559cbe77bd8b8b07e9bc405608611a9109e8f3041427e8a411ad149045812228109103250c9d0n]))).toBe(true);
    a = a.frobeniusMap(1);
    expect(a.equals(new Fq2([0x00f8d295b2ded9dcccc649c4b9532bf3b966ce3bc2108b138b1a52e0a90f59ed11e59ea221a3b6d22d0078036923ffc7n, 0x012d1137b8a6a8374e464dea5bcfd41eb3f8afc0ee248cadbe203411c66fb3a5946ae52d684fa7ed977df6efcdaee0dbn]))).toBe(true);
    a = a.frobeniusMap(2);
    expect(a.equals(new Fq2([0x00f8d295b2ded9dcccc649c4b9532bf3b966ce3bc2108b138b1a52e0a90f59ed11e59ea221a3b6d22d0078036923ffc7n, 0x012d1137b8a6a8374e464dea5bcfd41eb3f8afc0ee248cadbe203411c66fb3a5946ae52d684fa7ed977df6efcdaee0dbn]))).toBe(true);
  });
});
