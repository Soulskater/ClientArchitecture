describe("Array Utils", function () {
    it("Testing map", function () {
        var testData = [1, 2, 3];

        Utils.array.map(testData, function (item, index) {
            expect(item).toBe(testData[index]);
        });

        expect(Utils.array.map(testData, function (item) { return { number: item }; }).length).toBe(3);

        expect(Utils.array.map(testData, function (item) { return { number: item }; })).toEqual([{ number: 1 }, { number: 2 }, { number: 3 }]);

        expect(Utils.array.map([], function (item) { return { number: item }; })).toEqual([]);
    });
    it("Testing forEach", function () {
        var testData = [1, 2, 3];
        Utils.array.forEach(testData, function (item, index) {
            expect(item).toBe(testData[index]);
        });
        expect(testData).toEqual([1, 2, 3]);
    });
    it("Testing first", function () {
        var testData = [1, 2, 3];
        Utils.array.first(testData, function (item, index) {
            expect(item).toBe(testData[index]);
            return true;
        });

        expect(Utils.array.first(testData, function (item) { return item == 3 })).toBe(3);

        //expect(Utils.array.first(testData, function (item) { return item == 1000 })).toThrowError("Didn't match any element with the conditions!");

        expect(Utils.array.first(testData)).toEqual(1);
    });
    it("Testing firstOrDefault", function () {
        var testData = [1, 2, 3];
        Utils.array.firstOrDefault(testData, function (item, index) {
            expect(item).toBe(testData[index]);
            return true;
        });

        expect(Utils.array.firstOrDefault(testData, function (item) { return item == 3 })).toBe(3);

        expect(Utils.array.firstOrDefault(testData, function (item) { return item == 1000 })).toBe(undefined);

        expect(Utils.array.firstOrDefault(testData)).toEqual(1);
    });
    it("Testing last", function () {
        var testData = [1, 2, 3];
        Utils.array.last(testData, function (item, index) {
            expect(item).toBe(testData[index]);
            return true;
        });

        expect(Utils.array.last(testData, function (item) { return item == 3 })).toBe(3);

        //expect(Utils.array.last(testData, function (item) { return item == 1000 })).toBe(undefined);

        expect(Utils.array.last(testData)).toEqual(3);
    });
    it("Testing lastOrDefault", function () {
        var testData = [1, 2, 3];
        Utils.array.lastOrDefault(testData, function (item, index) {
            expect(item).toBe(testData[index]);
            return true;
        });

        expect(Utils.array.lastOrDefault(testData, function (item) { return item == 3 })).toBe(3);

        expect(Utils.array.lastOrDefault(testData, function (item) { return item == 1000 })).toBe(undefined);

        expect(Utils.array.lastOrDefault(testData)).toEqual(3);
    });
    it("Testing any", function () {
        var testData = [1, 2, 3];

        expect(Utils.array.any(testData, 3)).toBe(true);

        expect(Utils.array.any(testData, 1000)).toBe(false);
    });
});