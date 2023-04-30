import { updateAuthentication, updatePrintState, PrintPDFButton } from "./helpers";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleSubmit, handleMenuChange } from './helpers';
import Cookies from 'js-cookie';
import { handleGradeChange, handleNoteChange, handleGeneralNoteChange, updateSelectedItem, makeApiCall, getModifiedOptions } from './helpers';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
const { document } = window;
import { BrowserRouter } from "react-router-dom";

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

describe('handleSubmit', () => {
  it('should return an array of users when given a menu option', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve([{ name: 'John', employeeNumber: '12345', jobTitle: 'Software Engineer', allowedAccess: true }])
    }));
    global.fetch = mockFetch;
    const mockCookie = jest.spyOn(Cookies, 'get').mockImplementation(() => 'testSessionId');

    const users = await handleSubmit('user');
    
    expect(mockCookie).toHaveBeenCalledWith('session_id');
    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:5000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportName: 'users',
        granularity: 'user',
        sessionId: 'testSessionId'
      })
    });
    expect(users).toEqual([{ name: 'John', employeeNumber: '12345', jobTitle: 'Software Engineer', allowedAccess: true }]);
  });
});

describe('handleMenuChange', () => {
  it('should update the menuSelect state', () => {
    const setMenuSelect = jest.fn();
    const event = { target: { value: 'student' } };
    handleMenuChange(event, setMenuSelect);
    expect(setMenuSelect).toHaveBeenCalledWith('student');
  });
});

describe('handleGradeChange', () => {
  it('should update the grades array with the selected grade', () => {
    const grades = ['B', 'C'];
    const setGrades = jest.fn();
    const event = {
      target: {
        value: 'A',
      },
    };
    const index = 1;
    handleGradeChange(event, index, grades, setGrades);
    expect(setGrades).toHaveBeenCalledWith(['B', 'A']);
  });
});

describe('handleNoteChange', () => {
  it('should update the notes array with the new note', () => {
    const notes = ['', ''];
    const setNotes = jest.fn();
    const event = {
      target: {
        value: 'Some note',
      },
    };
    const index = 0;
    handleNoteChange(event, index, notes, setNotes);
    expect(setNotes).toHaveBeenCalledWith(['Some note', '']);
  });
});

describe('handleGeneralNoteChange', () => {
  it('should update the generalNote state with the new note', () => {
    const setGeneralNote = jest.fn();
    const event = {
      target: {
        value: 'Some general note',
      },
    };
    const generalNote = '';
    handleGeneralNoteChange(event, generalNote, setGeneralNote);
    expect(setGeneralNote).toHaveBeenCalledWith('Some general note');
  });
});

// Tests for updateSelectedItem function
test('updateSelectedItem returns the correct item when selectedItem is different from item', () => {
  const setReportType = jest.fn();
  const setReportParameter = jest.fn();
  const selectedItem = "Courses";
  const item = "Faculty";
  expect(updateSelectedItem(item, selectedItem, setReportType, setReportParameter)).toBe(item);
  expect(setReportType).toHaveBeenCalledWith("courseInfo");
  expect(setReportParameter).toHaveBeenCalledWith("course");
});

test('updateSelectedItem returns the same item when selectedItem is the same as item', () => {
  const setReportType = jest.fn();
  const setReportParameter = jest.fn();
  const selectedItem = "Courses";
  const item = "Courses";
  expect(updateSelectedItem(item, selectedItem, setReportType, setReportParameter)).toBe(item);
  expect(setReportType).toHaveBeenCalledWith("facultyInfo");
  expect(setReportParameter).toHaveBeenCalledWith("faculty");
});

// Tests for makeApiCall function
test('makeApiCall returns the expected data when the API call is successful', async () => {
  const mockResponse = { data: { result: "success" } };
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  );
  const data = await makeApiCall("courseInfo", "allCoursesAllDepartments", "course", "math", "science", "123");
  expect(data).toEqual(mockResponse.data);
});

test('makeApiCall returns null when the API call fails', async () => {
  global.fetch = jest.fn().mockImplementation(() => Promise.reject("API call failed"));
  const data = await makeApiCall("courseInfo", "allCoursesAllDepartments", "course", "math", "science", "123");
  expect(data).toBeNull();
});

describe('getModifiedOptions', () => {
  test('returns expected options for non-faculty and non-admin user', () => {
    const permission = "student";
    const expectedOptions = [
      { title: "Profile", path: "/profile" },
      { title: "Course Register", path: "/search" },
      { title: "Major Requirements", path: "/Major-Requirements" },
      { title: "Faculty And Course Information", path: "/faculty-and-course-info" }
    ];
    const modifiedOptions = getModifiedOptions(permission);
    expect(modifiedOptions).toEqual(expectedOptions);
  });

  test('returns expected options for faculty user', () => {
    const permission = "faculty";
    const expectedOptions = [
      { title: "Profile", path: "/profile" },
      { title: "Course Register", path: "/search" },
      { title: "Major Requirements", path: "/Major-Requirements" },
      { title: "Faculty And Course Information", path: "/faculty-and-course-info" },
      { title: "Course Grades", path: "/grades" }
    ];
    const modifiedOptions = getModifiedOptions(permission);
    expect(modifiedOptions).toEqual(expectedOptions);
  });

  test('returns expected options for admin user', () => {
    const permission = "admin";
    const expectedOptions = [
      { title: "Profile", path: "/profile" },
      { title: "Course Register", path: "/search" },
      { title: "Major Requirements", path: "/Major-Requirements" },
      { title: "Faculty And Course Information", path: "/faculty-and-course-info" },
      { title: "Course Grades", path: "/grades" }
    ];
    const modifiedOptions = getModifiedOptions(permission);
    expect(modifiedOptions).toEqual(expectedOptions);
  });
});
