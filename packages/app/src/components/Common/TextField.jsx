import React, { forwardRef } from 'react';

const TextField = (
    { type, name, label, validate, value, error, icon, disabled, handleChange, ...props },
    ref
) => {
    return (
        <div className="input-field">
            {icon && <i className="small material-icons prefix">{icon}</i>}
            <input
                {...props}
                ref={ref}
                className={validate ? 'validate' : ''}
                type={type}
                id={name}
                value={value}
                onChange={handleChange}
                disabled={disabled}
            />
            <label htmlFor={name}>{label}</label>
            {error && <span className="helper-text red-text">{error}</span>}
        </div>
    );
};

export default forwardRef(TextField);
