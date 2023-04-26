import { updateAuthentication, updatePrintState, PrintPDFButton } from "./helpers";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";


describe("helpers", () => {
  describe("updateAuthentication", () => {
    it("should update the isAuthenticated state", () => {
      const setIsAuthenticated = jest.fn();
      updateAuthentication(false, setIsAuthenticated);
      expect(setIsAuthenticated).toHaveBeenCalledWith(false);
    });
  });

  describe("updatePrintState", () => {
    it("should update the isPrintable state", () => {
      const setPrintable = jest.fn();
      updatePrintState(false, setPrintable);
      expect(setPrintable).toHaveBeenCalledWith(false);
    });
  });
});

describe("PrintPDFButton", () => {
    it("should render a button with the text 'Print PDF'", () => {
      render(<PrintPDFButton />);
      const buttonElement = screen.getByText(/print pdf/i);
      expect(buttonElement).toBeInTheDocument();
    });
  
    it("should call the window.print() method when the button is clicked", () => {
      window.print = jest.fn();
      render(<PrintPDFButton />);
      const buttonElement = screen.getByText(/print pdf/i);
      fireEvent.click(buttonElement);
      expect(window.print).toHaveBeenCalled();
    });
  });
