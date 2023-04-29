import { updateAuthentication, updatePrintState, PrintPDFButton } from "./helpers";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleSubmit, handleMenuChange } from './helpers';
import Cookies from 'js-cookie';
import { handleGradeChange, handleNoteChange, handleGeneralNoteChange, renderOptionContent } from './helpers';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';


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

describe('renderOptionContent', () => {
  it('should render a table of students with grades and notes', () => {
    const students = [
      { id: '001', name: 'Student 1' },
      { id: '002', name: 'Student 2' },
    ];
    const grades = ['A', 'B'];
    const setGrades = jest.fn();
    const notes = ['', ''];
    const setNotes = jest.fn();
    const generalNote = 'General note';
    const setGeneralNote = jest.fn();
    const handleGradeChangeMock = jest.fn();
    const handleNoteChangeMock = jest.fn();
    const handleGeneralNoteChangeMock = jest.fn();
    const renderedComponent = render(
      <div>{renderOptionContent(students, grades, notes, generalNote, handleGradeChangeMock, handleNoteChangeMock, handleGeneralNoteChangeMock)}</div>
    );
    const student1GradeSelect = renderedComponent.container.querySelector('#grade-select-0');
    fireEvent.click(student1GradeSelect);
    const gradeCOption = renderedComponent.getByRole('option', {name: 'C'});
    fireEvent.click(gradeCOption);
    expect(handleGradeChangeMock).toHaveBeenCalledWith(expect.any(Object), 0, grades, setGrades);
    const student1NoteInput = renderedComponent.container.querySelector('input[type="text"]');
    fireEvent.change(student1NoteInput, { target: { value: 'Some note' } });
    expect(handleNoteChangeMock).toHaveBeenCalledWith(expect.any(Object), 0, notes, setNotes);
    const generalNoteInput = renderedComponent.container.querySelector('textarea');
    fireEvent.change(generalNoteInput, { target: { value: 'Some general note' } });
    expect(handleGeneralNoteChangeMock).toHaveBeenCalledWith(expect.any(Object), generalNote, setGeneralNote);
    expect(renderedComponent.container).toMatchSnapshot();
  });
});