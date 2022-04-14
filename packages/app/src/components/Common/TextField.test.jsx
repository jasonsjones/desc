import React from 'react';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';
import TextField from './TextField';

describe('TextField component', () => {
    afterEach(cleanup);

    it('with default props renders a div with class form-control', () => {
        const { container } = render(<TextField />);
        expect(container.firstChild.nodeName).toBe('DIV');
        expect(container.firstChild.classList).toContain('input-field');
    });

    it('with default props renders a single label and input', () => {
        const { container } = render(<TextField />);
        expect(container.querySelectorAll('label')).toHaveLength(1);
        expect(container.querySelectorAll('input')).toHaveLength(1);
    });

    it('displays the label value', () => {
        const props = { label: 'Test Label', name: 'test' };
        const { getByText } = render(<TextField {...props} />);
        expect(getByText('Test Label').nodeName).toBe('LABEL');
    });

    it('displays an input of the provide type', () => {
        const props = { label: 'Email', type: 'email', name: 'test' };
        const { getByLabelText } = render(<TextField {...props} />);
        expect(getByLabelText('Email').getAttribute('type')).toBe('email');
    });

    it('displays the input with the provided value', () => {
        const props = {
            label: 'Email',
            type: 'email',
            name: 'test',
            value: 'oliver',
            handleChange: () => {}
        };
        const { getByLabelText } = render(<TextField {...props} />);
        expect(getByLabelText('Email').value).toBe('oliver');
    });

    it(`calls 'handleChange' prop when value changes`, async () => {
        const handleChange = jest.fn();
        const props = {
            label: 'Email',
            type: 'email',
            name: 'test',
            value: 'oliver',
            handleChange
        };
        const { getByLabelText } = render(<TextField {...props} />);
        const input = getByLabelText('Email');
        await user.type(input, 'oliver@');
        expect(handleChange).toHaveBeenCalled();
    });
});
