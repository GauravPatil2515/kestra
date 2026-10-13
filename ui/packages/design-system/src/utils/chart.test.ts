import {describe, test, expect} from "vitest"
import {categoryLabel, buildDisabledFeaturesOverride, ChartFeature} from "./chart"

describe("categoryLabel", () => {
    test("keeps the last segment of a fully-qualified type, with its own casing", () => {
        expect(categoryLabel("io.kestra.plugin.ee.assets.VM")).toBe("VM")
        expect(categoryLabel("io.kestra.core.models.assets.External")).toBe("External")
    })

    test("capitalises enum-shaped values", () => {
        expect(categoryLabel("SUCCESS")).toBe("Success")
        expect(categoryLabel("prod")).toBe("Prod")
    })

    test("does not trim a namespace or a decimal value", () => {
        expect(categoryLabel("io.kestra.demo")).toBe("Io.kestra.demo")
        expect(categoryLabel("10.5")).toBe("10.5")
    })
})

describe("buildDisabledFeaturesOverride", () => {
    test("a single disabled feature produces an override naming just that feature", () => {
        expect(buildDisabledFeaturesOverride([ChartFeature.LEGEND])).toEqual({
            legend: {show: false},
        })

        expect(buildDisabledFeaturesOverride([ChartFeature.TOOLTIP])).toEqual({
            tooltip: {show: false},
        })
    })

    test("several disabled features are all present", () => {
        const result = buildDisabledFeaturesOverride([
            ChartFeature.LEGEND,
            ChartFeature.TOOLTIP,
        ])

        expect(result).toEqual({
            legend: {show: false},
            tooltip: {show: false},
        })
    })

    test("an empty list produces an override that disables nothing", () => {
        expect(buildDisabledFeaturesOverride([])).toEqual({})
    })

    test("an unknown feature name does not throw", () => {
        expect(() =>
            buildDisabledFeaturesOverride(["UNKNOWN_FEATURE" as ChartFeature]),
        ).not.toThrow()

        expect(
            buildDisabledFeaturesOverride(["UNKNOWN_FEATURE" as ChartFeature]),
        ).toEqual({})
    })

    test("the returned object is new each call rather than a shared mutable one", () => {
        const first = buildDisabledFeaturesOverride([ChartFeature.LEGEND])
        const second = buildDisabledFeaturesOverride([ChartFeature.LEGEND])

        expect(first).toEqual(second)
        expect(first).not.toBe(second)
    })
})
