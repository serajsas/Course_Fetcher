import {capitalizeFirstLetterAndLowerRest, isTwoStringsContainTheSameWords} from "../../src/utils/StringUtils";
import {expect} from "chai";
import {InvalidMajorString} from "../../src/models/major/MajorModel";
import {fail} from "assert";

describe("String Utils Test", function () {
    describe("Capitalize String tests", function () {
        it("Test strings all capital except and", function () {
            let string = "CAPITALIZE THIS STRING and THE OTHER STRING";
            let result = capitalizeFirstLetterAndLowerRest(string.split(" ")).join(" ");
            expect(result).to.equal("Capitalize This String and The Other String")
        });
        it("Test string all small", function () {
            let string = "capitalize this string and the other string";
            let result = capitalizeFirstLetterAndLowerRest(string.split(" ")).join(" ");
            expect(result).to.equal("Capitalize This String and The Other String")
        });
        it("Test string small and capital with AND being all capital", function () {
            let string = "capiTAlize tHIs sTRIng AND the other string";
            let result = capitalizeFirstLetterAndLowerRest(string.split(" ")).join(" ");
            expect(result).to.equal("Capitalize This String and The Other String")
        });
    });
    describe("Test different words for two strings", function () {
        it("Test two strings do not contain the same words", function () {
            let stringOne = "Combined Honours (1376): Computer Science and Statistics (CPSC, STAT)";
            let stringTwo = "The second string";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, undefined);
            expect(result).to.be.false;
        });

        it("Test same words for two strings", function () {
            let stringOne = "Combined Honours (1376): Computer Science and Statistics (CPSC, STAT)";
            let stringTwo = "Computer Science and Statistics";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, undefined);
            expect(result).to.be.true;
        });

        it("Test same words for two strings given existing specialization(honours)", function () {
            let stringOne = "Combined honours: computer science and mathematics";
            let stringTwo = "mathematics and computer science";
            let specialization = "honours";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, specialization);
            expect(result).to.be.true;
        });

        it("Test same words for two strings given existing specialization(combined honours)", function () {
            let stringOne = "Combined honours: computer science and mathematics";
            let stringTwo = "mathematics and computer science";
            let specialization = "combined honours";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, specialization);
            expect(result).to.be.true;
        });

        it("Test same words for two strings given not existing specialization(major)", function () {
            let stringOne = "Combined honours: computer science and mathematics";
            let stringTwo = "mathematics and computer science";
            let specialization = "major";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, specialization);
            expect(result).to.be.false;
        });

        it("Test same words for two strings given not existing specialization(combined major)", function () {
            let stringOne = "Combined honours: computer science and mathematics";
            let stringTwo = "mathematics and computer science";
            let specialization = "combined major";
            let result: boolean = isTwoStringsContainTheSameWords(stringOne, stringTwo, specialization);
            expect(result).to.be.false;
        });
        it("Test invalid major string", function () {
            let stringOne = "computer science and mathematics";
            let stringTwo = "mathematics and computer science";
            let specialization = "combined major";
            try {
                isTwoStringsContainTheSameWords(stringOne, stringTwo, specialization);
            } catch (e: any) {
                return expect(e).to.be.instanceof(InvalidMajorString);
            }
            fail("This test should throw InvalidMajorString exception");
        });

    })
})