/**
 * Test suite for TestComponent
 */
import React from "react";
import { render, screen, fireEvent } from "../../utils/test-utils";
import { TestComponent } from "../../../src/components/ui/TestComponent";

describe("TestComponent", () => {
  it("renders correctly", () => {
    render(<TestComponent />);

    expect(screen.getByText("NativeWind Test Component")).toBeTruthy();
    expect(screen.getByText("Test Button")).toBeTruthy();
  });

  it("handles button press", () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<TestComponent />);

    fireEvent.press(screen.getByText("Test Button"));

    expect(consoleSpy).toHaveBeenCalledWith("Button pressed");
    consoleSpy.mockRestore();
  });
});
