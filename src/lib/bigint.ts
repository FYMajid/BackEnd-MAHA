/* eslint-disable no-extend-native */

export {}; // ⬅️ WAJIB supaya file jadi module

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
