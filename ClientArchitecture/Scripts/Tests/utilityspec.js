describe("UtilityModule", function () {

    it("Testing isNumber", function () {
        expect(UtilityModule.isNumber(2)).toBe(true);
        expect(UtilityModule.isNumber(2.2)).toBe(true);
        expect(UtilityModule.isNumber(-2)).toBe(true);
        expect(UtilityModule.isNumber("5")).toBe(true);
    });
});