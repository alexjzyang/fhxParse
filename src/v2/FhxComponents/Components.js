export class FhxComponents {
  constructor(fhxblock) {
    this.fhx = fhxblock;
  }
  toString() {}
  testIdentical() {
    // removes '\r' from the string before comparing
    return this.fhx.replaceAll("\r", "") == this.toString();
  }

  testSimilar() {
    // method called testSimilar, because it trims the lines before comparing
    return this.getDifference().length == 0;
  }

  getDifference() {
    // method called testSimilar, because it trims the lines before comparing
    const diff = [];
    const str1Lines = this.fhx.split("\n");
    const str2Lines = this.toString().split("\n");

    const maxLength = Math.max(str1Lines.length, str2Lines.length);

    for (let i = 0; i < maxLength; i++) {
      if (
        str1Lines[i] &&
        str2Lines[i] &&
        str1Lines[i].trim() !== str2Lines[i].trim()
      ) {
        diff.push({
          line: i + 1,
          str1: str1Lines[i] || "",
          str2: str2Lines[i] || "",
        });
      }
    }

    return diff;
  }
  diffChars() {
    const maxLength = Math.max(this.fhx.length, this.toString().length);
    const differences = [];

    for (let i = 0; i < maxLength; i++) {
      if (this.fhx[i] !== this.toString()[i]) {
        differences.push({
          index: i,
          char1: this.fhx[i],
          char2: this.toString()[i],
        });
      }
    }

    return differences;
  }
}
