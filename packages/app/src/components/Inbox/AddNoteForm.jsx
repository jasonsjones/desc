import React, { useState } from 'react';
import M from 'materialize-css';
import TextField from '../Common/TextField';
import { useAuthContext } from '../../context/AuthContext';
import useAddNoteToItem from '../../hooks/useAddNoteToItem';

const AddNoteForm = React.memo(({ itemId, onNoteAdd }) => {
    const { contextUser } = useAuthContext();
    const [note, setNote] = useState('');

    const { addNote } = useAddNoteToItem((response) => {
        if (response.success) {
            onNoteAdd(itemId, response.payload.item);
            setNote('');
            M.updateTextFields();
            M.toast({ html: 'Note added to request', classes: 'teal' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (note.length > 0) {
            const noteBody = {
                authorId: contextUser.id,
                body: note
            };

            addNote({ itemId, noteBody });
        }
    };

    const handleChange = (e) => {
        setNote(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Add a Note (avoid including PII)"
                type="text"
                name={`note${itemId}`}
                value={note}
                handleChange={handleChange}
            />
            <button className="btn waves-effect waves-light" type="submit" onClick={() => {}}>
                Add Note
            </button>
        </form>
    );
});

export default AddNoteForm;
