import { describe, expect, it } from "vitest";
import { evaluateAgentPolicy, runSelfIteration } from "./harness.mjs";

describe("A2A self-iteration harness", () => {
  it("exposes a reproducible baseline failure and a passing patched policy", async () => {
    const baseline = await evaluateAgentPolicy("v1");
    const revised = await evaluateAgentPolicy("v2");

    expect(baseline.passed).toBe(5);
    expect(baseline.safetyPass).toBe(false);
    expect(baseline.metrics.VERIFY).toEqual({ passed: 1, total: 2 });
    expect(revised.passed).toBe(6);
    expect(revised.safetyPass).toBe(true);
  });

  it("accepts a prompt patch only after the same eval set improves", async () => {
    const result = await runSelfIteration({ delay: 0 });

    expect(result.accepted).toBe(true);
    expect(result.baseline.total).toBe(result.revised.total);
    expect(result.revised.passed).toBeGreaterThan(result.baseline.passed);
    expect(result.handoff.protocol).toBe("A2A");
    expect(result.handoff.failures.map((failure) => failure.id)).toEqual(["negative-constraint"]);
    expect(result.trace.map((step) => step.agent)).toEqual([
      "Builder Agent",
      "Evaluator Agent",
      "Evaluator Agent",
      "Reviewer Agent",
      "A2A Handoff",
      "Builder Agent",
      "Evaluator Agent",
      "Harness Gate"
    ]);
  });
});
